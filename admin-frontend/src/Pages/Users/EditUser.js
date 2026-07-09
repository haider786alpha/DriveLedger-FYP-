import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Users.css";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    user_type: "driver",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    if (type === "error") {
      setTimeout(() => {
        setToast(null);
      }, 3500);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(API_URL(`/api/users/${id}/`));
      const data = res.data || res;

      setFormData({
        username: data.username || "",
        email: data.email || "",
        user_type: data.is_staff ? "admin" : "driver",
      });
    } catch (error) {
      console.error("Fetch user error:", error);

      showToast(
        "error",
        "User Load Failed",
        "Could not load this user account. Please go back and try again."
      );
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
        is_staff: formData.user_type === "admin",
      };

      await axios.patch(API_URL(`/api/users/${id}/`), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      showToast(
        "success",
        "User Updated Successfully",
        "User account details have been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/users");
      }, 1000);
    } catch (error) {
      console.error("Update user error:", error.response?.data || error);

      showToast(
        "error",
        "Update Failed",
        "User could not be updated. Please check the form and try again."
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
              Update User Account
            </div>

            <h4>Edit User</h4>
            <p>
              Update username, email, and role permissions for this DriveLedger
              account.
            </p>
          </div>

          <Link to="/users" className="users-add-btn">
            ← Back to Users
          </Link>
        </div>

        <div className="users-alert users-reveal users-delay-2">
          <div className="users-alert-icon">!</div>
          <div>
            <strong>Important:</strong> Do not mark driver accounts as Admin
            unless they should access the admin panel.
          </div>
        </div>

        <div className="user-form-card users-reveal users-delay-3">
          <div className="user-form-section-title">
            <h5>User Account Details</h5>
            <p>Review and update the account details before saving changes.</p>
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
                  Admin users can access the admin panel. Driver users can
                  access the driver panel after a driver profile is created.
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
                    {saving ? "Updating..." : "Update User"}
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

export default EditUser;