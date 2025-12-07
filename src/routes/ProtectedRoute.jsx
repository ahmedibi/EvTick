import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, role, loading } = useSelector((state) => state.auth);

  // wait for firebase listener to finish
  if (loading) return null;

  // if not logged in, go to login
  if (!currentUser) return <Navigate to="/login" replace />;

  // if logged in but unauthorized role, return home
  if (requiredRole && role !== requiredRole) 
    return <Navigate to="/" replace />;

  return children;
}