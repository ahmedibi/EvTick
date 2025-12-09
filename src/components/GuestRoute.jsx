import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

 //if user in local, no login/register
  if (user) {

     switch (user.role) {
    case "admin": return <Navigate to="/admin" replace />;
    case "organizer": return <Navigate to="/organizer" replace />;
    default: return <Navigate to="/" replace />;
  }

  }

  return children;
}
