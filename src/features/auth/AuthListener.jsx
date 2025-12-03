import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import { setUser, setRole, setLoading } from "./authSlice";
//import { useNavigate } from "react-router-dom";

export default function AuthListener({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If NO user logged in
      if (!user) {
        dispatch(setUser(null));
        dispatch(setRole(null));
        dispatch(setLoading(false));
        return;
      }

      // Get extra user data from Firestore
      const snap = await getDoc(doc(db, "users", user.uid));
      //const role = snap.exists() ? snap.data().role : "user";

      // Build lightweight user object to store in Redux + localStorage
      const userData = {
        uid: user.uid,
        email: user.email ?? null,
        phoneNumber: user.phoneNumber ?? null,
        fullName: snap.exists() ? snap.data().fullName : null,
      };

      dispatch(setUser(userData)); // Saves to redux + localStorage
      dispatch(setRole(snap.exists() ? snap.data().role : null));
      dispatch(setLoading(false));

     
    });

    return unsubscribe;
  }, [dispatch]);

  return children;
}