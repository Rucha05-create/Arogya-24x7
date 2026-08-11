import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

    // Get login information
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Redirect if not logged in
    if (!token) {
        return <Navigate to="/login-selection" replace />;
    }

    // Redirect if wrong role
    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/login-selection" replace />;
    }

    // Render requested page
    return children;
}

export default ProtectedRoute;