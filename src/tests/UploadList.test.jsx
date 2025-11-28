import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UploadList from "../components/UploadList";
import { useUploadStore } from "../state/uploadStore";

// mock the Zustand hook
vi.mock("../state/uploadStore", () => ({
  useUploadStore: vi.fn(),
}));

describe("UploadList Component", () => {
  it("renders empty state when no uploads", () => {
    // mockImplementation must support selector or no-arg call
    useUploadStore.mockImplementation((selector) => {
      const state = {
        uploads: [],
        cancelUpload: vi.fn(),
      };
      return typeof selector === "function" ? selector(state) : state;
    });

    render(<UploadList />);

    expect(screen.getByText(/no files selected/i)).toBeInTheDocument();
  });

  it("renders upload items and cancel all button", () => {
    useUploadStore.mockImplementation((selector) => {
      const state = {
        uploads: [
          { id: "1", file: { name: "test.pdf" }, status: "pending" },
          { id: "2", file: { name: "doc.txt" }, status: "success" },
        ],
        cancelUpload: vi.fn(),
      };
      return typeof selector === "function" ? selector(state) : state;
    });

    render(<UploadList />);

    // list items
    expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/doc.txt/i)).toBeInTheDocument();

    // cancel all button exists
    expect(screen.getByText(/cancel all/i)).toBeInTheDocument();

    // count text (e.g. "2 file(s)")
    expect(screen.getByText(/2 file/i)).toBeInTheDocument();
  });
});
