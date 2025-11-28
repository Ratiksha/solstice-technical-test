import axios from "axios";
import { useAuthStore } from "../state/authStore";
import { refreshTokenRequest } from "./auth";

// Create Axios instance
const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/",
    timeout: 15000,
});

// Request Interceptor

client.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
         if(token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
         }

         return config;
    },
    (error) => Promise.reject(error)
);

// response Interceptor
// Handles refresh logic

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((req) => {
        if(error) {
            req.reject(error);
        } else {
            req.resolve(token);
        }
    });

    failedQueue = [];
}

// handle 401 and refresh
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // if there is no response or its not 401, just reject
        const status = error?.response?.status;

        if(status !== 401) {
            return Promise.reject(error);
        }

        // If _retry flag is set, we have already tried to refresh for this request
       if (originalRequest && originalRequest._retry) {
            return Promise.reject(error);
       }

            // mark we rae retrying this request ( to avoid loops)
            originalRequest._retry = true;

            const { refreshToken, logout, updateAccessToken } = useAuthStore.getState();

            // no refresh token than logout immediately
            if(!refreshToken) {
                logout();
                return Promise.reject(error);
            }

            // If already refreshing, queue the request
            if(isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(client(originalRequest));
                        },
                        reject,
                    });
                })
            }

            // Start refresh
            isRefreshing = true;

            try {
                const response = await refreshTokenRequest(refreshToken);

                const newAccessToken = response.data.accessToken;

                // update store + localstorage
                updateAccessToken(newAccessToken);

                // retry queued requests
                processQueue(null, newAccessToken);

                // set header and retry original
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return client(originalRequest);
            } catch (refreshError) {
                // refresh failed -> reject all queued requests and logout
                processQueue(refreshError, null);
                logout();

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
    }
);

export default client;

