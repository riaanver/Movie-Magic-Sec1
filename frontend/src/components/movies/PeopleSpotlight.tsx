import { useState } from "react";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { usePersonCredits, usePersonSearch } from "@/hooks/usePeople";
import type { PersonSummary } from "@/types";
import { PROFILE_SIZE, buildImageUrl } from "@/lib/constants";

const PeopleSpotlight = () => {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<PersonSummary>();
  const search = usePersonSearch(query.trim());
  const credits = usePersonCredits(selectedPerson?.id);

  const topPeople = search.data?.results.slice(0, 5) ?? [];
  const topWorks = credits.data?.cast?.slice(0, 4) ?? [];

  return (
    <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-muted)]">Talent radar</p>
          <p className="text-sm text-[color:var(--text-secondary)]">Powered by /person/search + filmography</p>
        </div>
        {search.isFetching && <Loader2 className="h-4 w-4 animate-spin text-[color:var(--accent)]" />}
      </div>
      <label className="mt-4 flex items-center gap-3 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--text-secondary)]">
        <Search className="h-4 w-4 text-[color:var(--accent)]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find an actor/director (e.g. Greta Gerwig)"
          className="flex-1 bg-transparent text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus:outline-none"
        />
      </label>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {topPeople.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[color:var(--border-soft)] px-4 py-6 text-xs text-[color:var(--text-muted)]">
            Start typing a name to surface TMDB people search results.
          </p>
        )}
        {topPeople.map((person) => {
          const profile = buildImageUrl(person.profile_path, PROFILE_SIZE);
          const isActive = person.id === selectedPerson?.id;
          return (
            <button
              key={person.id}
              type="button"
              onClick={() => setSelectedPerson(person)}
              className={`flex min-w-[140px] flex-col items-center rounded-2xl border px-3 py-4 text-center transition ${
                isActive
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                  : "border-[color:var(--border-soft)] bg-[color:var(--surface-2)] hover:border-[color:var(--border-strong)]"
              }`}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[color:var(--surface-1)]">
                {profile ? (
                  <Image src={profile} alt={person.name} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-[color:var(--text-muted)]">
                    No photo
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">{person.name}</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
                {person.known_for_department ?? "Unknown"}
              </p>
            </button>
          );
        })}
      </div>
      {selectedPerson && (
        <div className="mt-4 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{selectedPerson.name}</p>
              <p className="text-xs text-[color:var(--text-secondary)]">
                Popularity {selectedPerson.popularity ? selectedPerson.popularity.toFixed(1) : "—"}
              </p>
            </div>
            {credits.isFetching && <Loader2 className="h-4 w-4 animate-spin text-[color:var(--accent)]" />}
          </div>
          {topWorks.length > 0 ? (
            <ol className="mt-3 space-y-2 text-sm text-[color:var(--text-secondary)]">
              {topWorks.map((work) => (
                <li
                  key={`${work.media_type}-${work.id}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-1)] px-3 py-2"
                >
                  <div>
                    <p className="font-semibold text-[color:var(--text-primary)]">{work.title || work.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
                      {work.media_type.toUpperCase()} · {work.release_date?.slice(0, 4) ?? "--"}
                    </p>
                  </div>
                  <span className="text-xs text-[color:var(--text-secondary)]">{work.character || work.job || "Crew"}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-xs text-[color:var(--text-muted)]">No credits available yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PeopleSpotlight;
