import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UploadListItem from "../components/UploadListItem";
import { useUploadStore } from "../state/uploadStore";

vi.mock("../state/uploadStore", () => ({
  useUploadStore: vi.fn(),
}));

// Helper mock wrapper
const mockStore = (storeState) => {
  useUploadStore.mockImplementation((selector) => {
    // selector() OR direct call
    return typeof selector === "function" ? selector(storeState) : storeState;
  });
};

describe("UploadListItem Component", () => {
  it("renders file name and waiting state", () => {
    const upload = {
      id: "1",
      file: { name: "test.pdf" },
      status: "pending",
      progress: 0,
      processingProgress: 0,
    };

    mockStore({
      cancelUpload: vi.fn(),
      retryUpload: vi.fn(),
      removeUpload: vi.fn(),
    });

    render(<UploadListItem upload={upload} />);

    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    expect(screen.getByText(/waiting/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it("renders uploading state with progress", () => {
    const upload = {
      id: "1",
      file: { name: "file.docx" },
      status: "uploading",
      progress: 55,
      processingProgress: 0,
    };

    mockStore({
      cancelUpload: vi.fn(),
      retryUpload: vi.fn(),
      removeUpload: vi.fn(),
    });

    render(<UploadListItem upload={upload} />);

    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    expect(screen.getByText(/55%/i)).toBeInTheDocument(); // progress shown
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it("renders processing state with purple bar", () => {
    const upload = {
      id: "99",
      file: { name: "data.txt" },
      status: "processing",
      processingProgress: 40,
    };

    mockStore({
      cancelUpload: vi.fn(),
      retryUpload: vi.fn(),
      removeUpload: vi.fn(),
    });

    render(<UploadListItem upload={upload} />);

    expect(screen.getByText(/processing file/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it("renders success state and remove button", () => {
    const upload = {
      id: "3",
      file: { name: "done.pdf" },
      status: "success",
    };

    const removeUpload = vi.fn();

    mockStore({
      cancelUpload: vi.fn(),
      retryUpload: vi.fn(),
      removeUpload,
    });

    render(<UploadListItem upload={upload} />);

    const removeBtn = screen.getByText("×");
    expect(removeBtn).toBeInTheDocument();

    fireEvent.click(removeBtn);
    expect(removeUpload).toHaveBeenCalledWith("3");
  });

  it("renders failed state and retry button", () => {
    const upload = {
      id: "4",
      file: { name: "fail.pdf" },
      status: "failed",
      error: "Network error",
    };

    const retryUpload = vi.fn();

    mockStore({
      cancelUpload: vi.fn(),
      retryUpload,
      removeUpload: vi.fn(),
    });

    render(<UploadListItem upload={upload} />);

    expect(screen.getByText(/network error/i)).toBeInTheDocument();

    const retryBtn = screen.getByText(/retry/i);
    fireEvent.click(retryBtn);

    expect(retryUpload).toHaveBeenCalledWith("4");
  });
});
