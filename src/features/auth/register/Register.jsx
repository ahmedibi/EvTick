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
import RegisterForm from "./RegisterForm.jsx";
import { showRegisterSuccess} from "../../../components/sweetAlert.js";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const AuthError = (err) => {
  const code = err?.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "Email already in use.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
};

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

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

      //save to redux and localStorage
      dispatch(setUser(newUser));
      dispatch(setRole("user"));
      showSuccessAlert("Registration successful!");
      //redirect to home
      showRegisterSuccess("Account created successfully!", fullName || "User");
      navigate("/");

    } catch (err) { 
      setErrors((prev) => ({ ...prev, 
        firebase: AuthError(err), 
      }));
    } finally {
    setLoading(false);
  }
  };


  const handleGoogleSignIn = async () => {
      setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      //check if user exists in firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        //user exists, Login immediately
        const userData = userDocSnapshot.data();
        dispatch(setUser({
          uid: userData.uid,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          role: userData.role
        }));
        dispatch(setRole(userData.role));
        // showLoginSuccess
        showRegisterSuccess("You Have Successfully logged in!",userData.fullName || user.displayName  || "User");
        navigate("/");
      } else {
        // new user, request password
        setGoogleUser(user);
        setIsGoogleSignup(true);
        // clear previous errors
        setErrors({ ...errors, firebase: "" });
      }

    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setErrors((prev) => ({ ...prev, firebase: error.message }));
      showErrorAlert(error.message);
    }finally {
    setLoading(false);
  }
  };

  const finalizeGoogleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // validates password only since isGoogleSignup is true

    try {
      if (googleUser) {
        //set the password for google user
        await updatePassword(googleUser, password);

        //create Firestore Doc
        const newUser = {
          uid: googleUser.uid,
          fullName: googleUser.displayName || "Google User",
          email: googleUser.email,
          phone: "",
          role: "user",
          createdAt: serverTimestamp(),
        };

        await setDoc(doc(db, "users", googleUser.uid), newUser);

        //dispatch and navigate to home
        dispatch(setUser(newUser));
        dispatch(setRole("user"));
        showSuccessAlert("Registration successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Error finalizing google signup", error);
      setErrors({ ...errors, firebase: error.message });
      showErrorAlert(error.message);
    }
  };

  const cancelGoogleSignup = async () => {
  await auth.signOut();     
  setGoogleUser(null);
  setIsGoogleSignup(false);
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

        <RegisterForm
    isGoogleSignup={isGoogleSignup}
    googleUser={googleUser}
    fullName={fullName}
    setFullName={setFullName}
    phone={phone}
    setPhone={setPhone}
    email={email}
    setEmail={setEmail}
    password={password}
    setPassword={setPassword}
    confirmPassword={confirmPassword}
    setConfirmPassword={setConfirmPassword}
    show={show}
    setShow={setShow}
    showConfirm={showConfirm}
    setShowConfirm={setShowConfirm}
    errors={errors}
    loading={loading} 
    handleSubmit={handleSubmit}
    handleGoogleSignIn={handleGoogleSignIn}
    finalizeGoogleSignup={finalizeGoogleSignup}
    cancelGoogleSignup={cancelGoogleSignup}
    />


    {!isGoogleSignup && (
    <p className="mt-4 text-sm text-center text-white/90">
    Already have an account?
    <Link to="/login" className=" font-bold text-[#0f9386]"> Log in</Link>
    </p>
    )}
    </AuthLayout>
  );
}