import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { useAuthStore } from "../state/authStore";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Mock MSW login handler
const server = setupServer(
  http.post("/auth/login", async ({ request }) => {
    const { email, password } = await request.json();

    if (email === "demo@gmail.com" && password === "qwerty") {
      return HttpResponse.json({
        accessToken: "mock_access",
        refreshToken: "mock_refresh",
        user: { id: 1, email, name: "Demo User" },
      });
    }

    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  })
);

// Start MSW
beforeAll(() => server.listen());
afterAll(() => server.close());
beforeEach(() => {
  server.resetHandlers();
  localStorage.clear();
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  });
});

// wrapper for router
const Wrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("LoginPage Tests", () => {
  it("shows validation errors when fields are empty", async () => {
    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>
    );

    const button = screen.getByRole("button", { name: /login/i });
    fireEvent.click(button);

    expect(await screen.findByText(/Email required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it("logs in successfully and stores tokens", async () => {
    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "demo@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "qwerty" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for navigation (mock)
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe("mock_access");
    expect(state.refreshToken).toBe("mock_refresh");
    expect(state.user.email).toBe("demo@gmail.com");
  });

  it("shows error message on login failure", async () => {
    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/invalid credentials/i)
    ).toBeInTheDocument();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
