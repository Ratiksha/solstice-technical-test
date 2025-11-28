import { useUploadStore } from "../state/uploadStore";
import UploadListItem from "./UploadListItem";

const UploadList = () => {
  const uploads = useUploadStore((state) => state.uploads);
  const cancelUpload = useUploadStore((state) => state.cancelUpload);

  if (uploads.length === 0) {
    return (
      <p className="text-gray-500 mt-6 text-center">
        No files selected.
      </p>
    );
  }

  const cancelAll = () => {
    uploads.forEach((u) => {
      if (u.status === "uploading" || u.status === "pending" || u.status === "processing") {
        cancelUpload(u.id);
      }
    });
  };

  return (
    <div className="mt-10 space-y-4">

      {/* Cancel All */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">
          {uploads.length} file(s)
        </p>
        <button
          onClick={cancelAll}
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Cancel All
        </button>
      </div>

      {/* Render Items */}
      {uploads.map((item) => (
        <UploadListItem key={item.id} upload={item} />
      ))}
    </div>
  );
};

export default UploadList;