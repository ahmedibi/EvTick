//import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../features/auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showSuccessAlert } from "./sweetAlert";
import Swal from "sweetalert2";

export default function LogoutButton() {
  
const dispatch = useDispatch();
const navigate = useNavigate();


const logout = async () => {
  
  const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out from your account.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0F9386",
        cancelButtonColor: "gray",
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel",
      });
  
      if (result.isConfirmed) {
      
        await signOut(auth);
        dispatch(logoutUser());
        navigate("/"); 
        showSuccessAlert("You have logged out successfully");
      }
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

