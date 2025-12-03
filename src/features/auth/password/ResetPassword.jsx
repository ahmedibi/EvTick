import { useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../../../firebase/firebase.config";
import AuthLayout from "../components/AuthLayout";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();
//   const oobCode = params.get("oobCode"); // Get the oobCode from URL
const oobCode = new URLSearchParams(window.location.search).get("oobCode");

  // password rules
  const passwordRules = [
    { check: password.length >= 6, text: "• At least 6 characters" },
    { check: /[0-9]/.test(password), text: "• At least one number" },
    { check: /[!@#$%^&*]/.test(password), text: "• At least one special character" },
  ];

  const isValidPassword = passwordRules.every(rule => rule.check);
  const isConfirmed = password === confirm;

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidPassword) {
      return setError("Password does not meet required rules.");
    }

    if (!isConfirmed) {
      return setError("Passwords do not match.");
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout imageSrc="/auth.jpeg">
      {/* <h2 className="text-xl font-bold text-center mb-4">Set New Password</h2> */}
      <div className="absolute top-1 -right-12 bg-[#aa7e61] text-white font-bold w-80 py-3 shadow-md text-center text-xl rotate-[20deg]">
        <div className="ml-9">Set New Password</div>
      </div>

      <form onSubmit={handleReset} className="space-y-4">

        {/* New Password */}
        <input
          type="password"
          className="auth-input"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Password Requirements UI */}
        <ul className="text-sm space-y-1">
          {passwordRules.map((item, i) => (
            <li key={i} className={item.check ? "text-green-600" : "text-gray-600"}>
              {item.text}
            </li>
          ))}
        </ul>

        {/* Confirm Password */}
        <input
          type="password"
          className="auth-input"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {!isConfirmed && confirm.length > 0 && (
          <p className="text-red-600 text-sm">Passwords do not match</p>
        )}

        {/* Error / Success Messages */}
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        {/* Disabled until valid */}
        <button
          disabled={!isValidPassword || !isConfirmed}
          className={`w-full py-3 text-white rounded font-semibold
          ${(!isValidPassword || !isConfirmed) ? "opacity-50 cursor-not-allowed" : ""}
          `}
          style={{ background: "#aa7e61" }}
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}