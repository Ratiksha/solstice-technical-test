import { create } from "zustand";
import { nanoid } from "nanoid";
import { MAX_FILE_SIZE, ALLOWED_TYPES } from "../config/constants";

export const useUploadStore = create((set, get) => ({
  uploads: [], // all files added (pending + uploading + done + failed)
  activeCount: 0,

  // Add files from drop or file picker
  addFiles: (fileList) => {
    const newItems = Array.from(fileList).map((file) => {
      const isValidType = ALLOWED_TYPES.includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE;

      if (!isValidType || !isValidSize) {
        return {
          id: nanoid(),
          file,
          status: "error",
          progress: 0,
          processingProgress: 0,
          error: !isValidType
            ? "Invalid file type"
            : `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          cancelSource: null,
        };
      }

      return {
        id: nanoid(),
        file,
        status: "pending",
        progress: 0,
        processingProgress: 0,
        error: null,
        cancelSource: null,
      };
    });

    set((state) => ({
      uploads: [...state.uploads, ...newItems],
    }));
  },

  // Update single upload item
  updateUpload: (id, updates) => {
    set((state) => ({
      uploads: state.uploads.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  retryUpload: (id) => 
    set((state) => ({
        uploads: state.uploads.map((item) => 
        item.id === id ? { ...item, status: "pending", progress: 0, processingProgress: 0, error: null } : item
        ),
  })),

  cancelUpload: (id) => {
    const upload = get().uploads.find((item) => item.id === id);
    if(upload?.cancelSource) upload.cancelSource.cancel("User canceled");

    get().updateUpload(id, {
        status: "canceled",
        error: "Upload canceled",
    });
  },

  // Remove single file
  removeUpload: (id) => {
    set((state) => ({
      uploads: state.uploads.filter((item) => item.id !== id),
    }));
  },

  // Reset everything
  resetAll: () => set({ uploads: [], activeCount: 0 }),
}));
