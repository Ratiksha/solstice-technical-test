import { create } from "zustand";

export const useAuthStore = create((set) => ({
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isAuthenticated: !!localStorage.getItem("accessToken"),

    setTokens: (accessToken, refreshToken, user) => {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (user) localStorage.setItem("user", JSON.stringify(user));

        set({
            accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
        });
    },

    updateAccessToken: (accessToken) => {
        localStorage.setItem("accessToken", accessToken);

        set({
            accessToken,
            isAuthenticated: true,
        });
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        set({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false
        });
    },
}));