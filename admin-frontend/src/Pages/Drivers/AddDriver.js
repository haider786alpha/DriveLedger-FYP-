import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Drivers.css";

const AddDriver = () => {
  const navigate = useNavigate();

  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    user: "",
    cnic: "",
    license_number: "",
    address: "",
    profile_photo: null,
    license_copy: null,
  });

  useEffect(() => {
    fetchAvailableDriverUsers();
  }, []);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    if (type === "error") {
      setTimeout(() => {
        setToast(null);
      }, 3500);
    }
  };

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchAvailableDriverUsers = async () => {
    try {
      setLoadingUsers(true);

      const [usersRes, driversRes] = await Promise.all([
        axios.get(API_URL("/api/users/")),
        axios.get(API_URL("/api/drivers/")),
      ]);

      const users = normalizeResponse(usersRes);
      const drivers = normalizeResponse(driversRes);

      const linkedUserIds = drivers.map((driver) => Number(driver.user));

      const driverUsersOnly = users.filter(
        (user) => !user.is_staff && !linkedUserIds.includes(Number(user.id))
      );

      setAvailableUsers(driverUsersOnly);
    } catch (error) {
      console.error("Fetch available driver users error:", error);
      setAvailableUsers([]);

      showToast(
        "error",
        "Driver Users Load Failed",
        "Could not load available driver users. Please refresh and try again."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user) {
      showToast("error", "Driver User Required", "Please select a driver user.");
      return;
    }

    setSaving(true);
    setToast(null);

    try {
      const payload = new FormData();

      payload.append("user", formData.user);
      payload.append("cnic", formData.cnic);
      payload.append("license_number", formData.license_number);
      payload.append("address", formData.address);

      if (formData.profile_photo) {
        payload.append("profile_photo", formData.profile_photo);
      }

      if (formData.license_copy) {
        payload.append("license_copy", formData.license_copy);
      }

      await axios.post(API_URL("/api/drivers/"), payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(
        "success",
        "Driver Added Successfully",
        "New driver profile has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/drivers");
      }, 1000);
    } catch (error) {
      console.error("FULL ERROR:", error.response?.data || error);

      showToast(
        "error",
        "Add Driver Failed",
        "Driver could not be added. Please check the form and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content driveledger-drivers">
      {toast && (
        <div className={`driver-toast driver-toast-${toast.type}`}>
          <div className="driver-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="drivers-hero drivers-reveal drivers-delay-1">
          <div>
            <div className="drivers-hero-pill">
              <span className="dl-status-dot"></span>
              New Driver Profile
            </div>

            <h4>Add New Driver</h4>
            <p>
              Create a driver profile by linking an available driver user and
              uploading required documents.
            </p>
          </div>

          <Link to="/drivers" className="driver-form-back-btn">
            ← Back to Drivers
          </Link>
        </div>

        <div className="drivers-search-card drivers-reveal drivers-delay-2">
          <div className="d-flex align-items-start gap-3">
            <div className="users-alert-icon">i</div>
            <div>
              <strong>Important:</strong> First create a user with{" "}
              <strong>User Type = Driver</strong> in User Management. Then select
              that user here to create the driver profile.
            </div>
          </div>
        </div>

        <div className="driver-form-card drivers-reveal drivers-delay-3">
          <div className="driver-form-section-title">
            <h5>Driver Information</h5>
            <p>Fill in CNIC, license, address, and document details.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="driver-form-label">Select Driver User</label>
                <select
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  className="driver-form-select"
                  required
                  disabled={loadingUsers}
                >
                  <option value="">
                    {loadingUsers
                      ? "Loading driver users..."
                      : "Select driver user"}
                  </option>

                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} {user.email ? `- ${user.email}` : ""}
                    </option>
                  ))}
                </select>

                <small className="driver-form-help">
                  Only driver users who are not already linked to a driver
                  profile are shown.
                </small>

                {!loadingUsers && availableUsers.length === 0 && (
                  <div className="driver-form-error">
                    No available driver users found. Create a Driver user first
                    in User Management.
                  </div>
                )}
              </div>

              <FormField
                label="CNIC"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                placeholder="XXXXX-XXXXXXX-X"
                required
              />

              <FormField
                label="License Number"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                placeholder="License number"
                required
              />

              <FileField
                label="Profile Photo"
                name="profile_photo"
                onChange={handleChange}
                accept="image/*"
                help="Upload driver profile photo."
              />

              <FileField
                label="License Copy"
                name="license_copy"
                onChange={handleChange}
                accept="image/*,.pdf"
                help="Upload license image or PDF."
              />

              <div className="col-md-12 mb-3">
                <label className="driver-form-label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="driver-form-textarea"
                  rows="3"
                  placeholder="Enter driver address"
                  required
                />
              </div>

              <div className="col-md-12">
                <div className="driver-form-actions">
                  <Link to="/drivers" className="driver-form-cancel-btn">
                    Cancel
                  </Link>

                  <Link to="/add-user" className="driver-form-secondary-btn">
                    Create Driver User
                  </Link>

                  <button
                    type="submit"
                    className="driver-form-save-btn"
                    disabled={
                      loadingUsers || availableUsers.length === 0 || saving
                    }
                  >
                    {saving ? "Saving..." : "Save Driver"}
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
    <label className="driver-form-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="driver-form-input"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const FileField = ({ label, name, onChange, accept, help }) => (
  <div className="col-md-6 mb-3">
    <label className="driver-form-label">{label}</label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      className="driver-form-file"
      accept={accept}
    />
    <small className="driver-form-help">{help}</small>
  </div>
);

export default AddDriver;