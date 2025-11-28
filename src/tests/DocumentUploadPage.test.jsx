import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import DocumentUploadPage from "../pages/DocumentUploadPage";
import { startUploadEngine } from "../engine/uploadManager";

// Mock child components
vi.mock("../components/TopBar", () => ({
  default: () => <div data-testid="topbar">TopBar</div>,
}));

vi.mock("../components/DropZone", () => ({
  default: () => <div data-testid="dropzone">DropZone</div>,
}));

vi.mock("../components/UploadList", () => ({
  default: () => <div data-testid="uploadlist">UploadList</div>,
}));

// Mock the upload manager
vi.mock("../engine/uploadManager", () => ({
  startUploadEngine: vi.fn(),
}));

describe("DocumentUploadPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls startUploadEngine on mount", () => {
    render(<DocumentUploadPage />);
    expect(startUploadEngine).toHaveBeenCalledTimes(1);
  });

  it("renders the TopBar, DropZone, UploadList, and heading", () => {
    render(<DocumentUploadPage />);

    expect(screen.getByTestId("topbar")).toBeInTheDocument();
    expect(screen.getByTestId("dropzone")).toBeInTheDocument();
    expect(screen.getByTestId("uploadlist")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /document upload manager/i })
    ).toBeInTheDocument();
  });
});
