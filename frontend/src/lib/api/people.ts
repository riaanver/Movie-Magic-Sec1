import apiClient from "@/lib/api-client";
import type { PaginatedPersonResponse, PersonCredits } from "@/types";

export const searchPeople = async (
  query: string,
  page = 1
): Promise<PaginatedPersonResponse> => {
  const { data } = await apiClient.get<PaginatedPersonResponse>("/person/search", {
    params: { query, page }
  });
  return data;
};

export const getPersonCredits = async (personId: number): Promise<PersonCredits> => {
  const { data } = await apiClient.get<PersonCredits>(`/person/${personId}/credits`);
  return data;
};
