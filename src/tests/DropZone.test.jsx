import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DropZone from "../components/DropZone";
import { useUploadStore } from "../state/uploadStore";

// Mock store
vi.mock("../state/uploadStore", () => ({
  useUploadStore: vi.fn(),
}));

// mock addFiles fn
const addFilesMock = vi.fn();
useUploadStore.mockReturnValue({
  addFiles: addFilesMock,
});

describe("DropZone Component", () => {
  it("renders dropzone text", () => {
    render(<DropZone />);

    expect(
      screen.getByText(/drag & drop files here/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/allowed: pdf, docx, txt/i)
    ).toBeInTheDocument();
  });
});
