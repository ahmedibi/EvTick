import Swal from "sweetalert2";

/* =========================
   SUCCESS ALERT
========================= */
export const showSuccess = (text, title = "Success") => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#14b8a6", // teal
  });
};

/* =========================
   ERROR ALERT
========================= */
export const showError = (text, title = "Error") => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#ef4444", // red
  });
};

/* =========================
   WARNING / CONFIRM ALERT
========================= */
export const showConfirm = ({
  text,
  title = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#14b8a6",
    cancelButtonColor: "#6b7280",
  });
};

/* =========================
   LOADING ALERT
========================= */
export const showLoading = (text = "Processing...") => {
  Swal.fire({
    title: text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/* =========================
   CLOSE ALERT
========================= */
export const closeAlert = () => {
  Swal.close();
};
