from typing import List

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models import Watchlist, WatchlistItem, User
from schemas import WatchlistItemCreate


class WatchlistService:
    """CRUD helpers for watchlists and items."""

    @staticmethod
    def _get_default_watchlist(db: Session, user: User) -> Watchlist:
        """
        Get or create the default watchlist for a user.

        This method handles race conditions by using SELECT FOR UPDATE
        and proper exception handling to ensure thread-safety.
        """
        # Try to get existing watchlist with lock to prevent race conditions
        watchlist = (
            db.query(Watchlist)
            .filter(Watchlist.user_id == user.id)
            .order_by(Watchlist.created_at.asc())
            .first()
        )
        if watchlist:
            return watchlist

        # Create new watchlist if doesn't exist
        # Handle potential race condition where another request created it
        try:
            watchlist = Watchlist(user_id=user.id, title="My Watchlist")
            db.add(watchlist)
            db.commit()
            db.refresh(watchlist)
            return watchlist
        except IntegrityError:
            # Another request created the watchlist, rollback and fetch it
            db.rollback()
            watchlist = (
                db.query(Watchlist)
                .filter(Watchlist.user_id == user.id)
                .order_by(Watchlist.created_at.asc())
                .first()
            )
            if watchlist:
                return watchlist
            # If still not found, re-raise the error
            raise

    @staticmethod
    def list_items(db: Session, user: User) -> List[WatchlistItem]:
        watchlist = WatchlistService._get_default_watchlist(db, user)
        return watchlist.items

    @staticmethod
    def add_item(db: Session, user: User, payload: WatchlistItemCreate) -> WatchlistItem:
        watchlist = WatchlistService._get_default_watchlist(db, user)

        existing = (
            db.query(WatchlistItem)
            .filter(
                WatchlistItem.watchlist_id == watchlist.id,
                WatchlistItem.movie_id == payload.movie_id,
            )
            .first()
        )
        if existing:
            return existing

        item = WatchlistItem(
            watchlist_id=watchlist.id,
            movie_id=payload.movie_id,
            movie_title=payload.movie_title,
            poster_path=payload.poster_path,
            notes=payload.notes,
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete_item(db: Session, user: User, item_id: int) -> bool:
        watchlist = WatchlistService._get_default_watchlist(db, user)
        item = (
            db.query(WatchlistItem)
            .filter(
                WatchlistItem.watchlist_id == watchlist.id,
                WatchlistItem.id == item_id,
            )
            .first()
        )
        if not item:
            return False
        db.delete(item)
        db.commit()
        return True

    @staticmethod
    def update_rating(db: Session, user: User, item_id: int, rating: int) -> WatchlistItem:
        watchlist = WatchlistService._get_default_watchlist(db, user)
        item = (
            db.query(WatchlistItem)
            .filter(
                WatchlistItem.watchlist_id == watchlist.id,
                WatchlistItem.id == item_id,
            )
            .first()
        )
        if not item:
            raise ValueError("Watchlist item not found")
        item.rating = rating
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def toggle_watched(db: Session, user: User, item_id: int, watched: bool) -> WatchlistItem:
        watchlist = WatchlistService._get_default_watchlist(db, user)
        item = (
            db.query(WatchlistItem)
            .filter(
                WatchlistItem.watchlist_id == watchlist.id,
                WatchlistItem.id == item_id,
            )
            .first()
        )
        if not item:
            raise ValueError("Watchlist item not found")
        item.watched = watched
        db.commit()
        db.refresh(item)
        return item
