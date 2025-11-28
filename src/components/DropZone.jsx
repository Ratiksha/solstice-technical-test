import { useDropzone } from "react-dropzone";
import { useUploadStore } from "../state/uploadStore";

const MAX_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = {
    "application/pdf": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    "text/plain": [],
};

const DropZone = () => {
    const addFiles = useUploadStore((state) => state.addFiles);

    const onDrop = (acceptedFiles) => {
        addFiles(acceptedFiles);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        // ACCEPT ANY FILE — let uploadStore decide what is valid
        accept: undefined,
        maxSize: undefined,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center transition
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
            <input {...getInputProps()} />
            <p className="text-lg text-gray-600">
                Drag & drop files here, or <span className="text-blue-600 font-semibold">browser</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Allowed: PDF, DOCX, TXT | Max 10MB per file
            </p>
        </div>
    );
};

export default DropZone;