import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase/firebase.config.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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

    //passsword rules
    const failedRules = passwordRules.filter((rule) => !rule.check);
    if (failedRules.length > 0) {
      newErrors.password = failedRules.map((rule) => rule.text).join(" ");
      valid = false;
    }

    //confirm password
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

    // redirect to home/dashboard
    navigate("/user");

  } catch (err) {
    setErrors((prev) => ({ ...prev, firebase: err.message }));
  }
};

  return (
    <AuthLayout>
      {/* <div className="absolute top-1 -right-12 bg-[#aa7e61] text-white font-bold w-80 py-3 shadow-md text-center text-2xl rotate-[20deg]">
        <div className="ml-9">Create Account</div>
      </div> */}
        <div className="relative w-full">
    <img 
      src="/ticket.png"   
      alt="ticket" 
      className="absolute -top-8 left-1/2 -translate-x-1/2 w-25 "
    />
  </div>
      <h2 className="font-serif text-xl font-bold mb-4 text-center mt-6">Register</h2>

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

          {/* <div className="mt-2 text-xs text-gray-600">
            {passwordRules.map((rule, i) => (
              <p key={i} className={rule.check ? "text-green-600" : "text-gray-500"}>{rule.text}</p>
            ))}
          </div> */}
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
      </form>

      <p className="mt-4 text-sm  text-center text-white/90">
        Already have an account?
        <Link to="/login" className=" font-bold text-[#0f9386]"> Log in</Link>
      </p>
    </AuthLayout>
  );
}