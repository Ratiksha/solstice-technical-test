import { useUploadStore } from "../state/uploadStore";

const UploadListItem = ({ upload }) => {
  const {
    cancelUpload,
    retryUpload,
    removeUpload,
  } = useUploadStore();

  const getStatusText = () => {
    switch (upload.status) {
      case "pending":
        return "Waiting...";
      case "processing":
        return "Processing file...";
      case "uploading":
        return `Uploading... ${upload.progress}%`;
      case "success":
        return "Uploaded Successfully";
      case "failed":
      case "error":
        return upload.error;
      case "canceled":
        return "Upload canceled";
      default:
        return "";
    }
  };

  const renderProgressBar = () => {
    if (upload.status === "processing") {
      return (
        <div className="w-full bg-gray-200 h-3 rounded-lg overflow-hidden">
          <div
            className="h-3 bg-purple-400 animate-pulse"
            style={{ width: `${upload.processingProgress}%` }}
          />
        </div>
      );
    }

    if (upload.status === "uploading") {
      return (
        <div className="w-full bg-gray-200 h-3 rounded-lg overflow-hidden">
          <div
            className="h-3 bg-blue-600 transition-all"
            style={{ width: `${upload.progress}%` }}
          />
        </div>
      );
    }

    if (upload.status === "success") {
      return (
        <div className="w-full bg-green-200 h-3 rounded-lg overflow-hidden">
          <div className="h-3 bg-green-500 w-full" />
        </div>
      );
    }

    if (upload.status === "failed" || upload.status === "error") {
      return (
        <div className="w-full bg-red-200 h-3 rounded-lg overflow-hidden">
          <div className="h-3 bg-red-500 w-full" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="font-medium text-gray-800">{upload.file.name}</p>
          <p className="text-sm text-gray-500">{getStatusText()}</p>
        </div>

        <div className="flex gap-3">

          {/* Cancel */}
          {(upload.status === "uploading" ||
            upload.status === "processing" ||
            upload.status === "pending") && (
            <button
              onClick={() => cancelUpload(upload.id)}
              className="text-red-600 hover:text-red-800"
            >
              Cancel
            </button>
          )}

          {/* Retry */}
          {(upload.status === "failed" ||
            upload.status === "canceled" ||
            upload.status === "error") && (
            <button
              onClick={() => retryUpload(upload.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              Retry
            </button>
          )}

          {/* Remove */}
          {upload.status === "success" && (
            <button
              onClick={() => removeUpload(upload.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {renderProgressBar()}
    </div>
  );
};

export default UploadListItem;
