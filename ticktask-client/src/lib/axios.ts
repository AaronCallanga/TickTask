import axios from "axios";

// Use environment variable for API URL
// In development with Vite proxy, use empty string to use relative URLs
// In production (Docker/K8s), set VITE_API_URL to the backend service URL
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific errors like 401, 403 globally if needed
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);
