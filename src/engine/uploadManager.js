import axios from "axios";
import { uploadFile } from "../api/upload";
import { useUploadStore } from "../state/uploadStore";

const MAX_CONCURRENT = 3;
let intervalRunning = false;

export const startUploadEngine = () => {
  if (intervalRunning) return;
  intervalRunning = true;

  const run = () => {
    const store = useUploadStore.getState();
    const { uploads, activeCount, updateUpload } = store;

    if (activeCount >= MAX_CONCURRENT) return;

    // find next pending OR processing file
    const next = uploads.find(
      (u) => u.status === "pending" || u.status === "processing"
    );
    if (!next) return;

    // If file is not yet in processing mode
    if (next.status === "pending") {
      updateUpload(next.id, {
        status: "processing",
        processingProgress: 0,
      });
      return; // processing step runs in next intervals
    }

    // Simulate processing progress before upload
    if (next.status === "processing") {
      if (next.processingProgress < 15) {
        updateUpload(next.id, {
          processingProgress: next.processingProgress + 3,
        });
        return;
      }

      // Processing is done — start upload
      updateUpload(next.id, { status: "uploading" });
    }

    // Real upload begins here
    const cancelSource = axios.CancelToken.source();
    updateUpload(next.id, { cancelSource });

    store.activeCount++;

    uploadFile(
      next.file,
      (progress) => updateUpload(next.id, { progress }),
      cancelSource.token
    )
      .then(() =>
        updateUpload(next.id, {
          status: "success",
          progress: 100,
        })
      )
      .catch((err) => {
        if (axios.isCancel(err)) {
          updateUpload(next.id, {
            status: "canceled",
            error: "Upload canceled",
          });
        } else {
          updateUpload(next.id, {
            status: "failed",
            error: err.response?.data?.message || "Upload failed",
          });
        }
      })
      .finally(() => {
        useUploadStore.setState((s) => ({
          activeCount: s.activeCount - 1,
        }));
      });
  };

  setInterval(run, 300);
};
