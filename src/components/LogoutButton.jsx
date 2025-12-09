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
      className="px-4 py-2 bg-black text-white rounded"
    >
      Logout
    </button>
  );
}