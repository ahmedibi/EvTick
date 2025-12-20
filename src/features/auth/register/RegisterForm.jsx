import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function RegisterForm({
  isGoogleSignup,
  googleUser,
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  show,
  setShow,
  showConfirm,
  setShowConfirm,
  errors,
  handleSubmit,
  handleGoogleSignIn,
  finalizeGoogleSignup,
  cancelGoogleSignup,
  loading,
}) {
  return (
    <>
      {isGoogleSignup ? (
        //google signup
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
            onClick={cancelGoogleSignup}
            className="w-full py-2 text-white/70 text-sm hover:text-white"
          >
            Cancel
          </button>
        </form>
      ) : (
        //default register
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

          <button
             type="submit"
             disabled={loading}
             className={`w-full py-3 text-white rounded font-semibold outline-none
               flex items-center justify-center gap-2
               ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
             style={{ background: "#0f9386" }}
           >
             {loading ? (
               <>
                 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                 Signing up...
               </>
             ) : (
               "Sign Up"
             )}
           </button>


          <div className="relative flex items-center justify-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="absolute bg-teal-500 px-2 text-white rounded-2 ">OR</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full mt-6 py-3 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="text-rose-500" />
            Sign in with Google
          </button>

        </form>
      )}
    </>
  );
}