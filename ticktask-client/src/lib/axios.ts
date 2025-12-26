import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific errors like 401, 403 globally if needed
        return Promise.reject(error);
    }
);
