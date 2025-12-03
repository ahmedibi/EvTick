//import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../features/auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../features/firebase/config";
import { useDispatch } from "react-redux";

export default function LogoutButton() {
  
const dispatch = useDispatch();

const logout = async () => {
  await signOut(auth);
  dispatch(logoutUser());
};

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
}