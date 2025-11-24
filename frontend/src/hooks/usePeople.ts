"use client";

import { useQuery } from "@tanstack/react-query";
import { getPersonCredits, searchPeople } from "@/lib/api/people";

export const usePersonSearch = (query: string) =>
  useQuery({
    queryKey: ["people", "search", query],
    queryFn: () => searchPeople(query),
    enabled: query.trim().length > 1
  });

export const usePersonCredits = (personId?: number) =>
  useQuery({
    queryKey: ["people", "credits", personId],
    queryFn: () => getPersonCredits(personId!),
    enabled: Boolean(personId)
  });
