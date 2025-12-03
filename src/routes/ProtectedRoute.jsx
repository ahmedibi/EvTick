import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, role, loading } = useSelector((state) => state.auth);

  // Wait for Firebase listener to finish
  if (loading) return null;

  // If not logged in → go to login
  if (!currentUser) return <Navigate to="/login" replace />;

  // If logged in but unauthorized role → return home (or 403 page)
  if (requiredRole && role !== requiredRole) 
    return <Navigate to="/" replace />;

  return children;
}