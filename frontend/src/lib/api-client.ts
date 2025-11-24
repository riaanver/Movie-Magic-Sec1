import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  timeout: 0 // No timeout - wait indefinitely
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.detail || error.message || "Unexpected error";
    const requestUrl = error.config?.url || "";

    // Handle 401 Unauthorized - token expired or invalid
    if (status === 401) {
      // Only handle 401 for protected endpoints (auth, watchlist)
      // Don't redirect for public endpoints like movies, conversations
      const isProtectedEndpoint = requestUrl.includes("/watchlist") || requestUrl.includes("/auth/me");

      if (isProtectedEndpoint && typeof window !== "undefined") {
        // Clear token from localStorage
        localStorage.removeItem("movie-magic-token");

        // Only redirect if not already on auth pages
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/auth")) {
          // Redirect to login page
          window.location.href = "/auth/login?expired=true";
        }
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      console.error("Access forbidden:", message);
    }

    // Handle 500 Server Error
    if (status >= 500) {
      console.error("Server error:", message);
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
