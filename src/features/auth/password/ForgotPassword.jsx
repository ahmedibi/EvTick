import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { showSuccessAlert, showErrorAlert } from "../../../components/sweetAlert";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email,{
   url: "http://localhost:5173/reset-password", 
   handleCodeInApp: true
});
      showSuccessAlert("Password reset link sent! Check your email.");
    } catch (error) {
      setMessage(error.message);
      showErrorAlert(error.message);
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
      <h2 className="text-xl font-serif font-bold mb-4 text-center mt-6">Reset Password</h2>
      {/* <div className="absolute top-1 -left-12 bg-[#aa7e61] text-white font-bold w-80 py-3 shadow-md text-center text-2xl rotate-[-20deg]">
        <div className="mr-12">Reset Password</div>
      </div> */}

      <form onSubmit={handleReset} className="space-y-4">
        <input
          className="auth-input"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {message && <p className="mt-2 text-sm text-teal-600 text-center">{message}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-[#aa7e61] text-white rounded font-semibold mt-4"
           style={{ background: "#0f9386" }}
        >
          Send Reset Link
        </button>
      </form>

      <p className="mt-4 text-sm  text-center">
        Back to <Link to="/login" className=" font-bold text-[#0f9386]">Login</Link>
      </p>
    </AuthLayout>
  );
}