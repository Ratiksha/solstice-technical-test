import { useEffect } from "react";
import DropZone from "../components/DropZone";
import UploadList from "../components/UploadList";
import { startUploadEngine } from "../engine/uploadManager";
import TopBar from "../components/TopBar";

const DocumentUploadPage = () => {

   useEffect(() => {
    startUploadEngine();
   }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <TopBar />
            <h1 className="text-3xl font-bold mb-6">Document Upload Manager</h1>

            {/* Drag & Drop Zone */}
            <DropZone />

            {/* File List */}
            <UploadList />
            
        </div>
    )
}

export default DocumentUploadPage;