import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { db } from "../../../firebase/firebase.config"; 
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
   try {
      //check if email exists in Firestore
      const q = query(
        collection(db, "users"),
        where("email", "==", normalizedEmail)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setMessage("Wrong Email.");
        return;
      }

      // 2) If exists in Firestore, send reset email via Firebase Auth
      await sendPasswordResetEmail(auth, normalizedEmail, {
        url: "http://localhost:5173/reset-password",
        handleCodeInApp: true,
      });

      setMessage("Password reset link sent! Check your email.");
    } catch (error) {
      const code = error?.code || "";
      if (code === "auth/invalid-email") setMessage("Invalid email address.");
      else setMessage(error.message);
    } finally {
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
           disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition mt-4
        ${loading ? "bg-[#0f9386]/70 cursor-not-allowed" : "bg-[#0f9386] hover:opacity-90"}
      `}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
            Sending Link...
          </div>
        ) : (
          "Send Reset Link"
        )}
        </button>
      </form>

      <p className="mt-4 text-sm  text-center">
        Back to <Link to="/login" className=" font-bold text-[#0f9386]">Login</Link>
      </p>
    </AuthLayout>
  );
}