import Swal from "sweetalert2";

export const showSuccessAlert = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    iconColor: "#0F9386",
    text: message,
    confirmButtonColor: "#0F9386",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showErrorAlert = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonColor: "#ef4444",
  });
};

export const showConfirmAlert = async (message) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0F9386",
    cancelButtonColor: "gray",
    confirmButtonText: "Yes",
  });
  return result.isConfirmed;
};

export const showLoginSuccess = (message = "You have successfully logged in!", name) => {
  Swal.fire({
    title: `Welcome Back ${name}`,
    text: message,
    icon: "success",
    iconColor: "#0F9386",
    background: "#fff",
    color: "#333",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

export const showLoginError = (message = "Invalid email or password.") => {
  Swal.fire({
    title: "Login Failed",
    text: message,
    icon: "error",
    iconColor: "#d33",
    confirmButtonText: "Try Again",
    confirmButtonColor: "#0F9386",
    background: "#fff",
    color: "#333",
  });
};

export const showLoginRequired = (message = "Please login first", navigate) => {
  Swal.fire({
    title: "Login Required ",
    text: message,
    icon: "warning",
    confirmButtonText: "Login Now",
    confirmButtonColor: "#0F9386",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    background: "#fff",
    color: "#333",
  }).then((result) => {
    if (result.isConfirmed && navigate) {
      setTimeout(() => {
        navigate("/login");
      }, 300);
    }
  });
};

import { logoutUser } from "../features/auth/authSlice";

export const showLogout = (navigate, dispatch) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out from your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0F9386",
    cancelButtonColor: "gray",
    confirmButtonText: "Yes, log out",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("user");

      if (dispatch) {
        dispatch(logoutUser());
      }

      showSuccessAlert("You have logged out successfully!");

      if (navigate) {
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    }
  });
};




