// src/config/constants.js
export const MAX_FILE_SIZE =
  Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 10 * 1024 * 1024;

export const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const USE_MSW = import.meta.env.VITE_USE_MSW === "true";

export const RANDOM_FAILURE_ENABLED =
  import.meta.env.VITE_RANDOM_FAILURE_ENABLED === "true";

export const UPLOAD_SIMULATED_DELAY =
  Number(import.meta.env.VITE_UPLOAD_SIMULATED_DELAY) || 1000;
