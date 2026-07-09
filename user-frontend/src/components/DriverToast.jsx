import React from "react";
import "./DriverToast.css";

const DriverToast = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const toastClass =
    type === "success"
      ? "driver-toast-success"
      : type === "error"
      ? "driver-toast-error"
      : type === "warning"
      ? "driver-toast-warning"
      : "driver-toast-info";

  const title =
    type === "success"
      ? "Success"
      : type === "error"
      ? "Action Failed"
      : type === "warning"
      ? "Warning"
      : "Notice";

  const icon =
    type === "success" ? "✓" : type === "error" ? "!" : type === "warning" ? "!" : "i";

  return (
    <div className="driver-toast-wrap">
      <div className={`driver-toast ${toastClass}`}>
        <div className="driver-toast-icon">{icon}</div>

        <div className="driver-toast-content">
          <strong>{title}</strong>
          <p>{message}</p>
        </div>

        <button type="button" onClick={onClose} className="driver-toast-close">
          ×
        </button>
      </div>
    </div>
  );
};

export default DriverToast;