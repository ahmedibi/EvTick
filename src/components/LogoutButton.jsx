import { logoutUser } from "../features/auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LucideLogOut } from "lucide-react";
import { showSuccessAlert } from "./sweetAlert";

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
      className="px-4 py-2  text-white rounded cursor-pointer w-full bg-neutral-800 mt-10 flex justify-center"
    >
      <LucideLogOut/>
    </button>
  );
}
