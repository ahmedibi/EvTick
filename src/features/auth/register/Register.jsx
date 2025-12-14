import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updatePassword } from "firebase/auth";
import { auth, db, googleProvider } from "../../../firebase/firebase.config.js";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setRole } from "../authSlice";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // New state for Google Signup flow
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    firebase: "",
  });

  const navigate = useNavigate();

  //validation

  const nameRegex = /^[A-Za-z ]+$/; // only letters and spaces
  const phoneRegex = /^(010|011|012)[0-9]{8,9}$/; // must start 010/011/012 + total 11-12 digits
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRules = [
    { check: password.length >= 6, text: "please enter at least 6 characters." },
    { check: /[0-9]/.test(password), text: "please enter at least one number." },
    { check: /[!@#$%^&*]/.test(password), text: "please enter at least one special character." },
  ];

  const validateForm = () => {
    let valid = true;
    let newErrors = { fullName: "", phone: "", email: "", password: "", confirmPassword: "", firebase: "" };

    if (!isGoogleSignup) {
      //full name (must contain two names)
      if (!fullName || !nameRegex.test(fullName) || fullName.trim().split(" ").length < 2) {
        newErrors.fullName = "Please enter first & last name (letters only).";
        valid = false;
      }

      // phone validation
      if (!phoneRegex.test(phone)) {
        newErrors.phone = "Invalid Phone";
        valid = false;
      }

      // email
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email address.";
        valid = false;
      }
    }

    //passsword rules (common for both)
    const failedRules = passwordRules.filter((rule) => !rule.check);
    if (failedRules.length > 0) {
      newErrors.password = failedRules.map((rule) => rule.text).join(" ");
      valid = false;
    }

    //confirm password (common for both)
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      const newUser = {
        uid: cred.user.uid,
        fullName,
        email,
        phone,
        role: "user"
      };

      await setDoc(doc(db, "users", cred.user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
      });

      // save to redux and localStorage
      dispatch(setUser(newUser));
      dispatch(setRole("user"));

      // redirect to home
      navigate("/");

    } catch (err) {
      setErrors((prev) => ({ ...prev, firebase: err.message }));
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // User exists -> Login immediately
        const userData = userDocSnapshot.data();
        dispatch(setUser({
          uid: userData.uid,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          role: userData.role
        }));
        dispatch(setRole(userData.role));
        navigate("/");
      } else {
        // New user -> Request password
        setGoogleUser(user);
        setIsGoogleSignup(true);
        // Clear potential previous errors
        setErrors({ ...errors, firebase: "" });
      }

    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setErrors((prev) => ({ ...prev, firebase: error.message }));
    }
  };

  const finalizeGoogleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // validates password only since isGoogleSignup is true

    try {
      if (googleUser) {
        // 1. Set the password for the Google user
        await updatePassword(googleUser, password);

        // 2. Create Firestore Doc
        const newUser = {
          uid: googleUser.uid,
          fullName: googleUser.displayName || "Google User",
          email: googleUser.email,
          phone: "",
          role: "user",
          createdAt: serverTimestamp(),
        };

        await setDoc(doc(db, "users", googleUser.uid), newUser);

        // 3. Dispatch & Navigate
        dispatch(setUser(newUser));
        dispatch(setRole("user"));
        navigate("/");
      }
    } catch (error) {
      console.error("Error finalizing google signup", error);
      // If requires-recent-login error, prompt to sign in again or handle gracefully
      setErrors({ ...errors, firebase: error.message });
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
      <h2 className="font-serif text-xl font-bold mb-4 text-center mt-6">
        {isGoogleSignup ? "Set Password" : "Register"}
      </h2>

      {isGoogleSignup ? (
        // GOOGLE SIGNUP - PASSWORD ONLY FORM
        <form onSubmit={finalizeGoogleSignup} className="space-y-4">
          <p className="text-white text-center text-sm mb-4">
            Please set a password for your account linked to: <br />
            <span className="font-bold">{googleUser?.email}</span>
          </p>

          {/* password */}
          <div className="relative">
            <input type={show ? "text" : "password"} className="auth-input"
              placeholder="Create Password" value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <span className="eye-btn" onClick={() => setShow(!show)}>
              {show ? <FaEye /> : <FaEyeSlash />}
            </span>

            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          {/* confirm password */}
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} className="auth-input"
              placeholder="Confirm Password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />

            <span className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </span>

            {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword}</p>}
          </div>

          {errors.firebase && <p className="auth-error">{errors.firebase}</p>}

          <button type="submit"
            className="w-full py-3 text-white rounded font-semibold outline-none"
            style={{ background: "#0f9386" }}>
            Complete Registration
          </button>
          <button
            type="button"
            onClick={() => setIsGoogleSignup(false)}
            className="w-full py-2 text-white/70 text-sm hover:text-white"
          >
            Cancel
          </button>
        </form>
      ) : (
        // DEFAULT REGISTRATION FORM
        <form onSubmit={handleSubmit} className="space-y-2 ">

          {/* full name */}
          <div>
            <input className="auth-input" placeholder="Full Name"
              value={fullName} onChange={(e) => setFullName(e.target.value)} />
            {errors.fullName && <p className="auth-error">{errors.fullName}</p>}
          </div>

          {/* phone */}
          <div>
            <input className="auth-input" placeholder="Phone Number"
              value={phone} onChange={(e) => setPhone(e.target.value)} />
            {errors.phone && <p className="auth-error">{errors.phone}</p>}
          </div>

          {/*email */}
          <div>
            <input className="auth-input" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          {/* password */}
          <div className="relative">
            <input type={show ? "text" : "password"} className="auth-input"
              placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <span className="eye-btn" onClick={() => setShow(!show)}>
              {show ? <FaEye /> : <FaEyeSlash />}
            </span>

            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          {/* confirm password */}
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} className="auth-input"
              placeholder="Confirm Password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />

            <span className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </span>

            {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword}</p>}
          </div>

          {errors.firebase && <p className="auth-error">{errors.firebase}</p>}

          <button type="submit"
            className="w-full py-3 text-white rounded font-semibold outline-none"
            style={{ background: "#0f9386" }}>
            Sign Up
          </button>

          <div className="relative flex items-center justify-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="absolute bg-white px-2 text-gray-500 text-sm">OR</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="text-red-500" />
            Sign up with Google
          </button>

        </form>
      )}

      {!isGoogleSignup && (
        <p className="mt-4 text-sm  text-center text-white/90">
          Already have an account?
          <Link to="/login" className=" font-bold text-[#0f9386]"> Log in</Link>
        </p>
      )}
    </AuthLayout>
  );
}