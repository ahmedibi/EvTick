//import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../features/auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  
const dispatch = useDispatch();
const navigate = useNavigate();


const logout = async () => {
  await signOut(auth);
  dispatch(logoutUser());
  navigate("/");
};

  return (
    <button
    onClick={logout}
    className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
    aria-label="Logout">
    <svg
        className="w-6 h-6 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
        />
    </svg>
</button>
  );
}

