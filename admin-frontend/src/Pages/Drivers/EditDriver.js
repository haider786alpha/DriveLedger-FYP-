import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Drivers.css";

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [linkedUser, setLinkedUser] = useState(null);
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

  const [existingFiles, setExistingFiles] = useState({
    profile_photo_url: "",
    license_copy_url: "",
  });

  useEffect(() => {
    fetchDriver();
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

  const fetchDriver = async () => {
    try {
      const driverResponse = await axios.get(API_URL(`/api/drivers/${id}/`));
      const driverData = driverResponse.data || driverResponse;

      setFormData({
        user: driverData.user || "",
        cnic: driverData.cnic || "",
        license_number: driverData.license_number || "",
        address: driverData.address || "",
        profile_photo: null,
        license_copy: null,
      });

      setExistingFiles({
        profile_photo_url: driverData.profile_photo_url || "",
        license_copy_url: driverData.license_copy_url || "",
      });

      if (driverData.user) {
        const userResponse = await axios.get(
          API_URL(`/api/users/${driverData.user}/`)
        );
        const userData = userResponse.data || userResponse;
        setLinkedUser(userData);
      }
    } catch (error) {
      console.error("Error fetching driver:", error);

      showToast(
        "error",
        "Driver Load Failed",
        "Could not load this driver record. Please go back and try again."
      );
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
    setSaving(true);
    setToast(null);

    try {
      const payload = new FormData();

      payload.append("cnic", formData.cnic);
      payload.append("license_number", formData.license_number);
      payload.append("address", formData.address);

      if (formData.profile_photo) {
        payload.append("profile_photo", formData.profile_photo);
      }

      if (formData.license_copy) {
        payload.append("license_copy", formData.license_copy);
      }

      await axios.patch(API_URL(`/api/drivers/${id}/`), payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(
        "success",
        "Driver Updated Successfully",
        "Driver profile has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/drivers");
      }, 1000);
    } catch (error) {
      console.error("Error updating driver:", error.response?.data || error);

      showToast(
        "error",
        "Update Failed",
        "Driver could not be updated. Please check the form and try again."
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
              Update Driver Profile
            </div>

            <h4>Edit Driver</h4>
            <p>
              Update CNIC, license details, address, profile photo, and license
              copy for this driver.
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
              <strong>Note:</strong> The linked login user cannot be changed
              here. To use another login account, create a new driver profile
              with a valid Driver user.
            </div>
          </div>
        </div>

        <div className="driver-form-card drivers-reveal drivers-delay-3">
          <div className="driver-form-section-title">
            <h5>Driver Information</h5>
            <p>Review and update this driver profile before saving changes.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="driver-form-label">Linked User</label>
                <input
                  type="text"
                  value={
                    linkedUser
                      ? `${linkedUser.username} (${
                          linkedUser.is_staff ? "Admin" : "Driver"
                        })`
                      : formData.user
                      ? `User ID: ${formData.user}`
                      : "-"
                  }
                  className="driver-form-input"
                  disabled
                />
                <small className="driver-form-help">
                  This account is used by the driver to login to the driver
                  panel.
                </small>
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

              <div className="col-md-6 mb-3">
                <label className="driver-form-label">Profile Photo</label>
                <input
                  type="file"
                  name="profile_photo"
                  onChange={handleChange}
                  className="driver-form-file"
                  accept="image/*"
                />

                {existingFiles.profile_photo_url ? (
                  <div className="driver-existing-preview">
                    <img
                      src={existingFiles.profile_photo_url}
                      alt="Driver profile"
                      className="driver-existing-image"
                    />
                  </div>
                ) : (
                  <small className="driver-form-help">
                    No profile photo uploaded.
                  </small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="driver-form-label">License Copy</label>
                <input
                  type="file"
                  name="license_copy"
                  onChange={handleChange}
                  className="driver-form-file"
                  accept="image/*,.pdf"
                />

                {existingFiles.license_copy_url ? (
                  <div className="driver-existing-preview">
                    <a
                      href={existingFiles.license_copy_url}
                      target="_blank"
                      rel="noreferrer"
                      className="driver-license-link"
                    >
                      View Current License Copy
                    </a>
                  </div>
                ) : (
                  <small className="driver-form-help">
                    No license copy uploaded.
                  </small>
                )}
              </div>

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

                  <button
                    type="submit"
                    className="driver-form-save-btn"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Driver"}
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

export default EditDriver;