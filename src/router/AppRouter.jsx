import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// lazy-loaded pages
const LoginPage = lazy(() => import("../pages/LoginPage"));
const DocumentUploadPage = lazy(() => import("../pages/DocumentUploadPage"));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="mb-2">Loading…</div>
      <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin" />
    </div>
  </div>
);

const AppRouter = () => {
    return(
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<LoginPage />} />
                    {/* Protected Route */}
                    <Route 
                        path="/uploads" 
                        element={
                            <ProtectedRoute >
                                <DocumentUploadPage />
                            </ProtectedRoute>
                        } />
                    {/* Default Route */}
                    <Route path="*" element={<LoginPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default AppRouter;