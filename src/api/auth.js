import client from "./client";

export const loginapi = async (email, password) => {
    return client.post("/auth/login", { email, password });;
}

export const refreshTokenRequest = async (refreshToken) => {
    return client.post("/auth/refresh", { refreshToken });
}