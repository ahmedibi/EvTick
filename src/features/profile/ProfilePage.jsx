import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Firebase
import { db } from "../../firebase/firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    oldPassword: "",
    password: "",
    "re-password": "",
  });

  const [editable, setEditable] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
    oldPassword: false,
    password: false,
    rePassword: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      setFormData({
        fullName: parsed.fullName || "",
        email: parsed.email || "",
        phoneNumber: parsed.phoneNumber || "",
        oldPassword: "",
        password: "",
        "re-password": "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const enableEdit = (field) => {
    setEditable({ ...editable, [field]: true });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user?.uid) return alert("User not found!");

    const updatedFields = {};

    // تحديث البيانات العادية
    if (formData.fullName !== user.fullName) updatedFields.fullName = formData.fullName;
    if (formData.email !== user.email) updatedFields.email = formData.email;
    if (formData.phoneNumber !== user.phoneNumber) updatedFields.phoneNumber = formData.phoneNumber;

    // تحديث الباسورد
    if (formData.password) {
      if (formData.password !== formData["re-password"])
        return alert("Passwords do not match.");

      try {
        const currentUser = auth.currentUser;

        const credential = EmailAuthProvider.credential(
          currentUser.email,
          formData.oldPassword
        );

        // خطوة إجبارية قبل تغيير الباسورد
        await reauthenticateWithCredential(currentUser, credential);

        // تغيير الباسورد
        await updatePassword(currentUser, formData.password);

        updatedFields.password = formData.password;
      } catch (error) {
        console.log(error);
        return alert("Old password is incorrect!");
      }
    }

    // تحديث Firestore
    await updateDoc(doc(db, "users", user.uid), updatedFields);

    // تحديث localStorage
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    alert("Updated successfully!");

    // Disable inputs
    setEditable({
      fullName: false,
      email: false,
      phoneNumber: false,
      oldPassword: false,
      password: false,
      rePassword: false,
    });
  };

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center"
      
    >
    
      <div className="relative bg-white/10 rounded-2xl w-full max-w-4xl p-10 shadow-xl">
        <div className="flex items-center gap-5 mb-8">
          <img
            src={
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            className="w-20 h-20 rounded-full border border-gray-300"
            alt="avatar"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-100">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="font-semibold">Full Name</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="text"
                  name="name"
                  disabled={!editable.fullName}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-teal-300 text-gray-300 px-3 py-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => enableEdit("name")}
                  className="text-teal-300 font-medium"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold">Email</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="email"
                  name="email"
                  disabled={!editable.email}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border text-gray-300 border-teal-300 px-3 py-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => enableEdit("email")}
                  className="text-teal-300 font-medium"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="font-semibold ">Phone Number</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="text"
                  name="phoneNumber"
                  disabled={!editable.phoneNumber}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border border-teal-300 text-gray-300 px-3 py-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => enableEdit("phoneNumber")}
                  className="text-teal-300 font-medium"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>

            {/* Old Password */}
            <div>
              <label className="font-semibold ">Old Password</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="password"
                  name="oldPassword"
                  disabled={!editable.oldPassword}
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="w-full border border-teal-300 text-gray-300 px-3 py-2 rounded-lg"
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
              <label className="font-semibold ">New Password</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="password"
                  name="password"
                  disabled={!editable.password}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-teal-300 text-gray-300 px-3 py-2 rounded-lg"
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

            {/* Re Password */}
            <div>
              <label className="font-semibold">Re-enter Password</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="password"
                  name="re-password"
                  disabled={!editable.rePassword}
                  value={formData["re-password"]}
                  onChange={handleChange}
                  className="w-full border border-teal-300 text-gray-300 px-3 py-2 rounded-lg"
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
              className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
