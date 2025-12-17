import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { showSuccessAlert } from "../../components/sweetAlert"; // تأكد من المسار

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    oldPassword: "",
    password: "",
    "re-password": "",
  });

  const [editable, setEditable] = useState({
    fullName: false,
    phone: false,
    oldPassword: false,
    password: false,
    rePassword: false,
  });

  const [saving, setSaving] = useState(false);

  const inputRefs = {
    fullName: useRef(),
    phone: useRef(),
    oldPassword: useRef(),
    password: useRef(),
    rePassword: useRef(),
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({
        fullName: parsed.fullName || "",
        phone: parsed.phone || "",
        oldPassword: "",
        password: "",
        "re-password": "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enableEdit = (field) => {
    setEditable({ ...editable, [field]: true });
    setTimeout(() => {
      inputRefs[field].current?.focus();
    }, 0);
  };

  const hasChanges = () => {
    if (!user) return false;
    if (formData.fullName !== user.fullName) return true;
    if (formData.phone !== user.phone) return true;
    if (formData.password) return true;
    return false;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?.uid) return alert("User not found!");

    setSaving(true);

    const updatedFields = {};

    if (formData.fullName !== user.fullName) updatedFields.fullName = formData.fullName;
    if (formData.phone !== user.phone) updatedFields.phone = formData.phone;

    try {
      if (formData.password) {
        if (formData.password !== formData["re-password"])
          return alert("Passwords do not match.");

        const currentUser = auth.currentUser;
        const credential = EmailAuthProvider.credential(currentUser.email, formData.oldPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, formData.password);
      }

      await updateDoc(doc(db, "users", user.uid), updatedFields);

      const updatedUser = { ...user, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      showSuccessAlert("Profile updated successfully");

      setEditable({
        fullName: false,
        phone: false,
        oldPassword: false,
        password: false,
        rePassword: false,
      });

      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        password: "",
        "re-password": "",
      }));
    } catch (error) {
      console.error(error);
      alert(error.message || "Update failed!");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative bg-white rounded-2xl w-full max-w-4xl p-10 shadow-xl">
        <div className="flex items-center gap-5 mb-8">
          <img
            src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            className="w-20 h-20 rounded-full border border-black"
            alt="avatar"
          />
          <div>
            <h2 className="text-xl font-semibold text-black">{user?.fullName}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex-1 w-full col-span-2">
              <label className="font-semibold text-gray-600">Full Name</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="text"
                  name="fullName"
                  disabled={!editable.fullName}
                  ref={inputRefs.fullName}
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full bg-gray-100 border border-teal-300 px-3 py-2 rounded-lg ${
                    editable.fullName ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => enableEdit("fullName")}
                  className="text-teal-300 font-medium"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="font-semibold text-gray-600">Phone Number</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="text"
                  name="phone"
                  disabled={!editable.phone}
                  ref={inputRefs.phone}
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full border bg-gray-100 border-teal-300 px-3 py-2 rounded-lg ${
                    editable.phone ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => enableEdit("phone")}
                  className="text-teal-300 font-medium"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>

            {/* Old Password */}
            <div>
              <label className="font-semibold text-gray-600">Old Password</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="password"
                  name="oldPassword"
                  disabled={!editable.oldPassword}
                  ref={inputRefs.oldPassword}
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className={`w-full border bg-gray-100 border-teal-300 px-3 py-2 rounded-lg ${
                    editable.oldPassword ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => enableEdit("oldPassword")}
                  className="text-teal-300 font-medium"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="font-semibold text-gray-600">New Password</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="password"
                  name="password"
                  disabled={!editable.password}
                  ref={inputRefs.password}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border bg-gray-100 border-teal-300 px-3 py-2 rounded-lg ${
                    editable.password ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => enableEdit("password")}
                  className="text-teal-300 font-medium"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>

            {/* Re-enter Password */}
            <div>
              <label className="font-semibold text-gray-600">Re-enter Password</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="password"
                  name="re-password"
                  disabled={!editable.rePassword}
                  ref={inputRefs.rePassword}
                  value={formData["re-password"]}
                  onChange={handleChange}
                  className={`w-full border bg-gray-100 border-teal-300 px-3 py-2 rounded-lg ${
                    editable.rePassword ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => enableEdit("rePassword")}
                  className="text-teal-300 font-medium"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="text-right mt-8">
            <button
              type="submit"
              disabled={!hasChanges() || saving}
              className={`bg-teal-600 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-700 transition ${
                (!hasChanges() || saving) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
