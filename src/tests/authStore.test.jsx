import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../state/authStore";

describe("authStore", () => {
  beforeEach(() => {
    // clear store/localStorage before each test
    localStorage.clear();
    // reinitialize store by resetting it to initial shape
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("setTokens stores tokens and user in localStorage and state", () => {
    const access = "access_test";
    const refresh = "refresh_test";
    const user = { id: 1, name: "Test User" };

    // call setTokens via store
    useAuthStore.getState().setTokens(access, refresh, user);

    // check localStorage
    expect(localStorage.getItem("accessToken")).toBe(access);
    expect(localStorage.getItem("refreshToken")).toBe(refresh);
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(user);

    // check store state
    const state = useAuthStore.getState();
    expect(state.accessToken).toBe(access);
    expect(state.refreshToken).toBe(refresh);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBeTruthy();
  });

  it("updateAccessToken updates access token in state and localStorage", () => {
    const initial = "access_old";
    const refresh = "refresh_old";
    const user = { id: 2 };

    // set initial values
    useAuthStore.getState().setTokens(initial, refresh, user);

    const newAccess = "access_new";
    useAuthStore.getState().updateAccessToken(newAccess);

    expect(localStorage.getItem("accessToken")).toBe(newAccess);
    expect(useAuthStore.getState().accessToken).toBe(newAccess);
  });

  it("logout clears tokens, user and sets isAuthenticated false", () => {
    useAuthStore.getState().setTokens("a", "r", { id: 3 });
    expect(useAuthStore.getState().isAuthenticated).toBeTruthy();

    useAuthStore.getState().logout();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();

    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBeFalsy();
  });
});
