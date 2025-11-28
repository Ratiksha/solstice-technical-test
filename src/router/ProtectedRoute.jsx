import { Navigate } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    console.log(isAuthenticated)
    
    if(!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return children;
}

export default ProtectedRoute;