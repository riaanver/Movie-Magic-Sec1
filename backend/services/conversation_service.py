from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from models import Conversation, ConversationMessage


class ConversationService:
    @staticmethod
    def create_conversation(db: Session, user_id: str) -> Conversation:
        conversation = Conversation(
            user_id=user_id,
            started_at=datetime.utcnow(),
            last_message_at=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation

    @staticmethod
    def get_conversation_by_id(db: Session, conversation_id: int) -> Optional[Conversation]:
        return db.query(Conversation).filter(Conversation.id == conversation_id).first()

    @staticmethod
    def get_user_conversations(db: Session, user_id: str) -> List[Conversation]:
        return db.query(Conversation).filter(
            Conversation.user_id == user_id
        ).order_by(Conversation.last_message_at.desc()).all()

    @staticmethod
    def delete_conversation(db: Session, conversation_id: int) -> bool:
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conversation:
            return False
        db.query(ConversationMessage).filter(ConversationMessage.conversation_id == conversation_id).delete()

        db.delete(conversation)
        db.commit()
        return True

    @staticmethod
    def get_conversation_messages(db: Session, conversation_id: int) -> List[ConversationMessage]:
        return db.query(ConversationMessage).filter(
            ConversationMessage.conversation_id == conversation_id
        ).order_by(ConversationMessage.created_at.asc()).all()

    @staticmethod
    def add_message(db: Session, conversation_id: int, role: str, content: str) -> ConversationMessage:
        message = ConversationMessage(
            conversation_id=conversation_id,
            role=role,
            content=content,
            created_at=datetime.utcnow()
        )
        db.add(message)

        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if conversation:
            conversation.last_message_at = datetime.utcnow()

        db.commit()
        db.refresh(message)
        return message

    @staticmethod
    def get_or_create_conversation(db: Session, user_id: str, conversation_id: Optional[int] = None) -> Conversation:
        if conversation_id:
            conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
            if not conversation:
                raise ValueError(f"Conversation {conversation_id} not found")
            return conversation

        return ConversationService.create_conversation(db, user_id)