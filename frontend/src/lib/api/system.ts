import apiClient from "@/lib/api-client";

export interface HealthResponse {
  status: string;
  database?: string;
  timestamp?: string;
  message?: string;
  version?: string;
}

export const getRootStatus = async (): Promise<HealthResponse> => {
  const { data } = await apiClient.get<HealthResponse>("/");
  return data;
};

export const getHealthStatus = async (): Promise<HealthResponse> => {
  const { data } = await apiClient.get<HealthResponse>("/health");
  return data;
};
