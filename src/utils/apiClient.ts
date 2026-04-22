// utils/apiClient.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import userStore from "../store/userStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
});

// Attach JWT automatically to every request
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            // Ensure headers exist and type assertion
            config.headers = config.headers ?? {} as Record<string, string>;
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const username = userStore.getState().userName;
const userId = userStore.getState().userId;
const userType = userStore.getState().userType;
const userSegment = userStore.getState().userSegment;

// Handle 401 responses (token expired)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Example: try refreshing token
            try {
                if (username) {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}jwttoken`, {
                        params: {
                            username: username,
                            userid: userId,
                        }
                    });
                    //debugger
                    const newToken = res.data?.data?.token;
                    if (newToken) {
                        localStorage.setItem("accessToken", newToken);

                        // retry original request
                        error.config.headers["Authorization"] = `Bearer ${newToken}`;
                        return api(error.config);
                    }
                }
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                localStorage.removeItem("accessToken");
                // localStorage.removeItem("refresh_token");
                // Optional: redirect to login
            }
        }
        return Promise.reject(error);
    }
);

// Generic request function
const request = async <T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: any,
    params?: any,
    headers?: Record<string, string>,
): Promise<T> => {
    const config: AxiosRequestConfig = {
        method,
        url,
        data,
        params,
        headers,
    };

    try {
        const response: AxiosResponse<T> = await api.request<T>(config);
        return response.data;
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// Blocks for different methods
export const apiCall = {
    get: <T>(url: string, params?: any, headers?: Record<string, string>) =>
        request<T>("get", url, undefined, params, headers),
    post: <T>(url: string, body?: any, params?: any, headers?: Record<string, string>) =>
        request<T>("post", url, body, params, headers),
    put: <T>(url: string, body?: any, params?: any, headers?: Record<string, string>) =>
        request<T>("put", url, body, params, headers),
    delete: <T>(url: string, params?: any, headers?: Record<string, string>) =>
        request<T>("delete", url, undefined, params, headers),
};
