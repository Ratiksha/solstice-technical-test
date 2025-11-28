import client from "./client";

export const uploadFile = (file, onProgress, cancelToken) => {
    const formData = new FormData();
    formData.append("file", file);

    return client.post("/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        cancelToken,
        onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            onProgress(percent);
        },
    });
};