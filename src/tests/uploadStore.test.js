import { describe, it, expect, beforeEach } from "vitest";
import { useUploadStore } from "../state/uploadStore";

const pdfFile = new File(["test"], "test.pdf", { type: "application/pdf" });
const bigFile = new File(["a".repeat(11 * 1024 * 1024)], "big.pdf", {
  type: "application/pdf",
});

describe("Upload Store Tests", () => {
  beforeEach(() => {
    useUploadStore.setState({
      uploads: [],
      activeCount: 0,
    });
  });

  it("adds valid files as pending", () => {
    useUploadStore.getState().addFiles([pdfFile]);

    const uploads = useUploadStore.getState().uploads;

    expect(uploads.length).toBe(1);
    expect(uploads[0].status).toBe("pending");
    expect(uploads[0].error).toBe(null);
  });

  it("rejects oversized files", () => {
    useUploadStore.getState().addFiles([bigFile]);

    const uploads = useUploadStore.getState().uploads;

    expect(uploads.length).toBe(1);
    expect(uploads[0].status).toBe("error");
    expect(uploads[0].error).toMatch(/size/i);
  });

  it("updates upload progress", () => {
    useUploadStore.getState().addFiles([pdfFile]);

    const id = useUploadStore.getState().uploads[0].id;

    useUploadStore.getState().updateUpload(id, { progress: 50 });

    expect(useUploadStore.getState().uploads[0].progress).toBe(50);
  });

  it("can retry failed uploads", () => {
    useUploadStore.getState().addFiles([pdfFile]);

    const id = useUploadStore.getState().uploads[0].id;

    // simulate fail
    useUploadStore.getState().updateUpload(id, {
      status: "failed",
      error: "Network error",
    });

    useUploadStore.getState().retryUpload(id);

    const updated = useUploadStore.getState().uploads[0];

    expect(updated.status).toBe("pending");
    expect(updated.error).toBe(null);
  });

  it("can cancel upload", () => {
    useUploadStore.getState().addFiles([pdfFile]);

    const id = useUploadStore.getState().uploads[0].id;

    useUploadStore.getState().cancelUpload(id);

    const updated = useUploadStore.getState().uploads[0];

    expect(updated.status).toBe("canceled");
    expect(updated.error).toMatch(/canceled/i);
  });

  it("removes upload", () => {
    useUploadStore.getState().addFiles([pdfFile]);

    const id = useUploadStore.getState().uploads[0].id;

    useUploadStore.getState().removeUpload(id);

    expect(useUploadStore.getState().uploads.length).toBe(0);
  });

  it("resets all uploads", () => {
    useUploadStore.getState().addFiles([pdfFile]);

    useUploadStore.getState().resetAll();

    expect(useUploadStore.getState().uploads.length).toBe(0);
    expect(useUploadStore.getState().activeCount).toBe(0);
  });
});
