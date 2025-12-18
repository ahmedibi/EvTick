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


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

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

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (!snap.exists()) throw new Error("User profile not found!");

      const userData = snap.data();

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

      // role-based redirect
      switch (userData.role) {
        case "admin": navigate("/admin"); break;
        case "organizer": navigate("/organizer"); break;   //"/organizer"
        default: navigate("/");
      }

    } catch (err) {
      let msg = err.message.replace("Firebase:", "").trim();
      setErrors((prev) => ({ ...prev, firebase: msg }));
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

        <button type="submit" className="w-full py-3 text-white font-semibold rounded"
          style={{ background: "#0f9386" }}>
          Sign in
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