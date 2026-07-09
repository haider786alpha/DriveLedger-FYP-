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
    confirm_password: "",
    user_type: "driver",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    if (type === "error") {
      setTimeout(() => {
        setToast(null);
      }, 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const username = formData.username.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirm_password;

    if (!username) {
      return "Username is required. Please enter a username.";
    }

    if (username.length < 3) {
      return "Username must be at least 3 characters long.";
    }

    if (!email) {
      return "Email is required. Please enter an email address.";
    }

    if (!password) {
      return "Password is required. Please enter a password.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      return "Confirm password is required. Please re-enter the password.";
    }

    if (password !== confirmPassword) {
      return "Password and confirm password do not match.";
    }

    if (password.toLowerCase().includes(username.toLowerCase())) {
      return "Password must not contain the username.";
    }

    const emailName = email.split("@")[0];

    if (emailName && password.toLowerCase().includes(emailName.toLowerCase())) {
      return "Password must not contain the email name.";
    }

    return "";
  };

  const getCreateUserErrorMessage = (error) => {
    const data = error.response?.data;

    const text = data ? JSON.stringify(data).toLowerCase() : "";

    if (
      text.includes("username") ||
      text.includes("user with this username") ||
      text.includes("already exists") ||
      text.includes("already taken")
    ) {
      return "This username is already used. Please enter a different username.";
    }

    if (
      text.includes("email") ||
      text.includes("already registered") ||
      text.includes("email already")
    ) {
      return "This email is already registered. Please use a different email address.";
    }

    if (text.includes("password")) {
      return "Password is not valid. Please use at least 8 characters and choose a stronger password.";
    }

    if (text.includes("confirm_password")) {
      return "Confirm password is required and must match the password.";
    }

    /*
      Important:
      If backend gives no readable response, we still show a useful admin message.
      This avoids the confusing "Backend is not responding" toast.
    */
    return "This username or email is already used. Please use different account details.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    const validationError = validateForm();

    if (validationError) {
      showToast("error", "Invalid Form", validationError);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirm_password,
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
      console.log("Create user error:", error.response?.data || error.message);

      showToast(
        "error",
        "Create User Failed",
        getCreateUserErrorMessage(error)
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
                required
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

              <FormField
                label="Confirm Password"
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm password"
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