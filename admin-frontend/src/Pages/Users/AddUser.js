import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Users.css";

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "driver",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    if (type === "error") {
      setTimeout(() => {
        setToast(null);
      }, 3500);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        is_staff: formData.user_type === "admin",
      };

      await axios.post(API_URL("/api/users/"), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      showToast(
        "success",
        formData.user_type === "admin"
          ? "Admin User Created"
          : "Driver User Created",
        "New user account has been created successfully in DriveLedger."
      );

      setTimeout(() => {
        navigate("/users");
      }, 1000);
    } catch (error) {
      console.error("Create user error:", error.response?.data || error);

      showToast(
        "error",
        "Create User Failed",
        "User could not be created. Please check the form and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content driveledger-users">
      {toast && (
        <div className={`user-toast user-toast-${toast.type}`}>
          <div className="user-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="users-hero users-reveal users-delay-1">
          <div>
            <div className="users-hero-pill">
              <span className="dl-status-dot"></span>
              New User Account
            </div>

            <h4>Add User</h4>
            <p>
              Create admin users or driver login accounts with correct access
              permissions.
            </p>
          </div>

          <Link to="/users" className="users-add-btn">
            ← Back to Users
          </Link>
        </div>

        <div className="users-alert users-reveal users-delay-2">
          <div className="users-alert-icon">i</div>
          <div>
            <strong>Access Rule:</strong> Admin users are created with staff
            access. Driver users are created without staff access and must be
            linked in Driver Management.
          </div>
        </div>

        <div className="user-form-card users-reveal users-delay-3">
          <div className="user-form-section-title">
            <h5>User Account Details</h5>
            <p>Fill in the information below to create a new account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <FormField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />

              <FormField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

              <FormField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />

              <div className="col-md-6 mb-3">
                <label className="user-form-label">User Type</label>
                <select
                  name="user_type"
                  className="user-form-select"
                  value={formData.user_type}
                  onChange={handleChange}
                  required
                >
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>

                <small className="user-form-help">
                  Driver users can access the driver panel only after a driver
                  profile is created. Admin users can access the admin panel.
                </small>
              </div>

              <div className="col-md-12">
                <div className="user-form-actions">
                  <Link to="/users" className="user-form-cancel-btn">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="user-form-save-btn"
                    disabled={saving}
                  >
                    {saving ? "Creating..." : "Create User"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) => (
  <div className="col-md-6 mb-3">
    <label className="user-form-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="user-form-input"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default AddUser;