import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../authSlice";
import { showLoginSuccess } from "../../../components/sweetAlert.js";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);


  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firebase: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //validation
  const validateForm = () => {
    let valid = true;
    let newErrors = { email: "", password: "", firebase: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (!snap.exists()) throw new Error("User profile not found!");

      const userData = snap.data();

      if (userData.role === "admin" || userData.role === "organizer") {
      setErrors((prev) => ({
        ...prev,
        firebase: "Invalid Email or Password."
      }));

      await auth.signOut(); 
      return;
      }

      // save user to localStorage
      localStorage.setItem("user", JSON.stringify({
        uid: cred.user.uid,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        eventOwner: userData.eventOwner,
        profilePic:userData.profilePic
      }));

      // dispatch to Redux 
      dispatch(setUser(userData));
      //  showSuccessAlert("Welcome back!");
      showLoginSuccess("You Have Successfully logged in!", userData.fullName  || "User");
      // role-based redirect
      switch (userData.role) {
        case "admin": navigate("/admin"); break;
        case "organizer": navigate("/organizer"); break;   //"/organizer"
        default: navigate("/");
      }

    }catch (err) {
  let msg = "";

  switch (err.code) {
    case "auth/invalid-email":
      msg = "Invalid email address.";
      break;
    case "auth/user-not-found":
    case "auth/wrong-password":
      case "auth/invalid-credential":
      msg = "Wrong email or password.";
      break;
    case "auth/too-many-requests":
      msg = "Too many attempts. Try again later.";
      break;
    default:
      msg = "Something went wrong. Please try again later.";
  }

      setErrors((prev) => ({ ...prev, firebase: msg }));
      // showErrorAlert(msg);
    }finally {
    setLoading(false);
  }
  };

  return (
    <AuthLayout>
      <div className="relative w-full">
    <img 
      src="/ticket.png"   
      alt="ticket" 
      className="absolute -top-8 left-1/2 -translate-x-1/2 w-25 "
    />
  </div>
      <h2 className="font-serif text-xl font-bold mb-4 text-center mt-6">Log in</h2>
      
      {/* <div className="absolute top-1 -left-12 bg-[#aa7e61] text-white font-bold w-80 py-3 shadow-md text-center text-2xl rotate-[-20deg]">
        <div className="mr-12">Welcome Back</div>
      </div> */}

      <form onSubmit={handleLogin} className="space-y-3 ">

        {/* Email */}
        <div>
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="auth-error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-btn" onClick={() => setShow(!show)}>
            {show ? <FaEye /> : <FaEyeSlash />}
          </span>
          {errors.password && <p className="auth-error">{errors.password}</p>}
        </div>

        {errors.firebase && <p className="auth-error">{errors.firebase}</p>}
        <p className="text-sm  font-medium mt-2 text-right text-[#0f9386]">
        <Link to="/forgot-password">Forgot Password?</Link>
       </p>

        <button type="submit" 
        disabled={loading}
        className={`w-full py-3 text-white font-semibold rounded ${loading ? "bg-[#0f9386]/70 cursor-not-allowed" : "bg-[#0f9386] hover:opacity-90"}`}
          >
         {loading ? (
        <div className="flex items-center justify-center gap-2">
          <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
          Signing in...
        </div>
      ) : (
        "Sign in"
      )}
        </button>
        {/* <p className="text-sm text-[#aa7e61] font-medium mt-2">
        <Link to="/forgot-password">Forgot Password?</Link>
       </p> */}
      </form>

      <p className="mt-4 text-sm  text-center text-white/90">
        Don’t have an account?
        <Link to="/register" className="text-[#0f9386] font-bold"> Sign up</Link>
      </p>
    </AuthLayout>
  );
}