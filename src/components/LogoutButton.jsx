//import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../features/auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LucideLogOut } from "lucide-react";

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
      className="px-4 py-2  text-white rounded cursor-pointer bg-red-400 mt-10 flex justify-center"
    >
      <LucideLogOut/>
    </button>
  );
}