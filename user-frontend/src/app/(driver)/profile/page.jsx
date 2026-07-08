import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import DriverToast from "@/components/DriverToast";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./Profile.css";

const Profile = () => {
  const [driver, setDriver] = useState(null);
  const [user, setUser] = useState(null);
  const [assignedCar, setAssignedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const toastTimerRef = useRef(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    cnic: "",
    address: "",
    license_number: "",
  });

  const safeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const fetchJson = async (url, signal) => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  };

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3500);
  }, []);

  const buildFormData = (loggedInDriver, matchedUser) => ({
    username: matchedUser?.username || loggedInDriver?.user_name || "",
    email: matchedUser?.email || loggedInDriver?.email || "",
    cnic: loggedInDriver?.cnic || "",
    address: loggedInDriver?.address || "",
    license_number: loggedInDriver?.license_number || "",
  });

  const fetchProfileData = useCallback(
    async (signal) => {
      try {
        setLoading(true);

        const loggedInDriver = await getLoggedInDriver();

        if (signal?.aborted) return;

        setDriver(loggedInDriver);

        if (!loggedInDriver?.id) {
          setUser(null);
          setAssignedCar(null);
          return;
        }

        const [usersData, assignmentsData] = await Promise.all([
          fetchJson(API_URL("/api/users/"), signal),
          fetchJson(API_URL("/api/assignments/"), signal),
        ]);

        if (signal?.aborted) return;

        const users = safeArray(usersData);
        const assignments = safeArray(assignmentsData);

        const matchedUser = users.find(
          (item) => Number(item.id) === Number(loggedInDriver.user)
        );

        const activeAssignment = assignments.find(
          (item) =>
            Number(item.driver) === Number(loggedInDriver.id) &&
            String(item.status || "").toLowerCase() === "active"
        );

        setUser(matchedUser || null);
        setFormData(buildFormData(loggedInDriver, matchedUser));

        if (!activeAssignment?.car) {
          setAssignedCar(null);
          return;
        }

        const carData = await fetchJson(
          API_URL(`/api/cars/${activeAssignment.car}/`),
          signal
        );

        if (signal?.aborted) return;

        setAssignedCar(carData || null);
      } catch (error) {
        if (error?.name === "AbortError") return;

        console.error("Profile error:", error);
        showToast("Failed to load profile data.", "error");
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [showToast]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchProfileData(controller.signal);

    return () => {
      controller.abort();

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [fetchProfileData]);

  const handleOpenEdit = () => {
    setFormData(buildFormData(driver, user));
    setShowEditForm(true);
  };

  const handleCloseEdit = () => {
    setShowEditForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const refreshAfterProfileUpdate = async () => {
    const controller = new AbortController();
    await fetchProfileData(controller.signal);
  };

  const handleSaveChanges = async () => {
    if (!driver?.id) {
      showToast("Driver profile not found.", "error");
      return;
    }

    if (!formData.email.trim()) {
      showToast("Please enter your email address.", "warning");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        email: formData.email.trim(),
        address: formData.address.trim(),
      };

      const res = await fetch(API_URL(`/api/drivers/${driver.id}/`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.detail ||
            data?.message ||
            "Failed to update profile"
        );
      }

      showToast("Profile updated successfully.", "success");
      setShowEditForm(false);
      await refreshAfterProfileUpdate();
    } catch (error) {
      console.error("Save profile error:", error);
      showToast(error.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.old_password.trim()) {
      showToast("Please enter your old password.", "warning");
      return;
    }

    if (!passwordData.new_password.trim()) {
      showToast("Please enter your new password.", "warning");
      return;
    }

    if (passwordData.new_password.length < 8) {
     showToast("New password must be at least 8 characters long.", "warning");
      return;
}

   if (passwordData.old_password === passwordData.new_password) {
    showToast("New password cannot be the same as old password.", "warning");
     return;
}  

    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast("New password and confirm password do not match.", "warning");
      return;
    }

    try {
      setChangingPassword(true);

      const token = localStorage.getItem("access");

      const res = await fetch(API_URL("/api/change-password/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
}),
      });

      let data = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.detail ||
            data?.message ||
            "Failed to change password"
        );
      }

      showToast("Password changed successfully.", "success");

      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Change password error:", error);
      showToast(error.message || "Failed to change password.", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  const hasProfilePhoto = Boolean(driver?.profile_photo_url);
  const hasLicenseCopy = Boolean(driver?.license_copy_url);
  const documentsComplete = hasProfilePhoto && hasLicenseCopy;

  const assignedCarName = useMemo(() => {
    if (!assignedCar) return "No Car";

    return `${assignedCar.make || ""} ${assignedCar.model || ""}`.trim() || "Assigned Car";
  }, [assignedCar]);

  const InfoBox = ({ label, value, full = false }) => (
    <div className={`profile-info-box ${full ? "profile-info-box-full" : ""}`}>
      <p className="profile-label">{label}</p>
      <strong className="profile-value">{value || "-"}</strong>
    </div>
  );

  if (loading) {
    return (
      <div className="profile-loading-card profile-reveal">
        <DriverToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />

        <h4>Loading profile...</h4>
        <p>Please wait while we fetch your profile data.</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="profile-empty-card profile-reveal">
        <DriverToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />

        No driver profile found.
      </div>
    );
  }

  return (
    <div className="profile-page">
      <DriverToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <div className="profile-hero profile-reveal">
        <div className="profile-hero-inner">
          <div>
            <div className="profile-kicker">
              <span className="profile-status-dot" />
              Driver Panel Overview
            </div>

            <h2 className="profile-hero-title">My Profile</h2>

            <p className="profile-hero-subtitle">
              Manage your personal details, driver records, uploaded documents,
              assigned vehicle information, and account security in one clean place.
            </p>
          </div>

          <button onClick={handleOpenEdit} className="profile-primary-btn">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-stats-grid profile-reveal profile-delay-1">
        <div className="profile-stat-card profile-stat-blue">
          <div className="profile-stat-icon-bg" />
          <div className="profile-stat-icon">
            <IconifyIcon icon="mdi:card-account-details-outline" />
          </div>
          <p className="profile-stat-label">Driver ID</p>
          <strong className="profile-stat-value">#{driver.id}</strong>
          <span className="profile-stat-note">Registered account</span>
        </div>

        <div className="profile-stat-card profile-stat-indigo">
          <div className="profile-stat-icon-bg" />
          <div className="profile-stat-icon">
            <IconifyIcon icon="mdi:account-check-outline" />
          </div>
          <p className="profile-stat-label">Profile Status</p>
          <strong className="profile-stat-value">Active</strong>
          <span className="profile-stat-note">Driver account access</span>
        </div>

        <div className="profile-stat-card profile-stat-purple">
          <div className="profile-stat-icon-bg" />
          <div className="profile-stat-icon">
            <IconifyIcon icon="mdi:car-outline" />
          </div>
          <p className="profile-stat-label">Assigned Vehicle</p>
          <strong className="profile-stat-value">{assignedCarName}</strong>
          <span className="profile-stat-note">Current vehicle</span>
        </div>

        <div className="profile-stat-card profile-stat-slate">
          <div className="profile-stat-icon-bg" />
          <div className="profile-stat-icon">
            <IconifyIcon icon="mdi:file-document-check-outline" />
          </div>
          <p className="profile-stat-label">Documents</p>
          <strong className="profile-stat-value">
            {documentsComplete ? "Complete" : "Incomplete"}
          </strong>
          <span className="profile-stat-note">Profile + license copy</span>
        </div>
      </div>

      {showEditForm && (
        <div className="profile-card profile-edit-card profile-reveal">
          <div className="profile-card-head">
            <div>
              <h4 className="profile-section-title">Edit Profile</h4>
              <p className="profile-section-subtitle">
                You can update your email and address here.
              </p>
            </div>

            <button onClick={handleCloseEdit} className="profile-secondary-btn">
              Cancel
            </button>
          </div>

          <div className="profile-form-grid">
            <div className="profile-info-box">
              <label className="profile-label">Username</label>
              <input
                type="text"
                value={formData.username}
                disabled
                className="profile-input"
              />
            </div>

            <div className="profile-info-box">
              <label className="profile-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="profile-input"
              />
            </div>

            <div className="profile-info-box">
              <label className="profile-label">CNIC</label>
              <input
                type="text"
                value={formData.cnic}
                disabled
                className="profile-input"
              />
            </div>

            <div className="profile-info-box">
              <label className="profile-label">License Number</label>
              <input
                type="text"
                value={formData.license_number}
                disabled
                className="profile-input"
              />
            </div>

            <div className="profile-info-box profile-info-box-full">
              <label className="profile-label">Address</label>
              <textarea
                name="address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                className="profile-textarea"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="profile-primary-btn"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      <div className="profile-shell profile-reveal profile-delay-2">
        <div className="profile-card">
          <div className="profile-driver-head">
            {hasProfilePhoto ? (
              <img
                src={driver.profile_photo_url}
                alt={driver.user_name || "Driver"}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-fallback">
                {String(driver.user_name || "D").charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h4 className="profile-driver-name">{driver.user_name || "-"}</h4>
              <p className="profile-section-subtitle">Registered Driver Account</p>
              <span
                className={`profile-badge ${
                  documentsComplete ? "profile-badge-success" : "profile-badge-warning"
                }`}
              >
                Documents {documentsComplete ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>

          <h4 className="profile-section-title">Personal Information</h4>

          <div className="profile-info-grid" style={{ marginTop: "18px" }}>
            <InfoBox label="Name" value={driver.user_name} />
            <InfoBox label="Username" value={user?.username || driver.user_name} />
            <InfoBox label="Email" value={user?.email || driver?.email} />
            <InfoBox label="Phone" value="-" />
            <InfoBox label="CNIC" value={driver.cnic} />
            <InfoBox label="License Number" value={driver.license_number} />
            <InfoBox label="Address" value={driver.address} full />
          </div>
        </div>

        <div className="profile-side-stack">
          <div className="profile-card">
            <h4 className="profile-section-title">Uploaded Documents</h4>

            <div className="profile-info-grid" style={{ marginTop: "18px" }}>
              <div className="profile-info-box profile-info-box-full">
                <p className="profile-label">Profile Photo</p>
                <strong className="profile-value">
                  {hasProfilePhoto ? "Uploaded" : "Not uploaded"}
                </strong>
              </div>

              <div className="profile-info-box profile-info-box-full">
                <p className="profile-label">License Copy</p>

                {hasLicenseCopy ? (
                  <a
                    href={driver.license_copy_url}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link-btn"
                  >
                    View License Copy
                  </a>
                ) : (
                  <strong className="profile-value">Not uploaded</strong>
                )}
              </div>

              <div className="profile-info-box profile-info-box-full">
                <p className="profile-label">Document Status</p>
                <span
                  className={`profile-badge ${
                    documentsComplete ? "profile-badge-success" : "profile-badge-warning"
                  }`}
                >
                  {documentsComplete ? "Complete" : "Incomplete"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h4 className="profile-section-title">Work Information</h4>

            <div className="profile-info-grid" style={{ marginTop: "18px" }}>
              <InfoBox
                label="Assigned Car"
                value={assignedCar ? assignedCarName : "No active car assigned"}
                full
              />

              <div className="profile-info-box profile-info-box-full">
                <p className="profile-label">Status</p>
                <span className="profile-badge profile-badge-success">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-card profile-security-card profile-reveal profile-delay-3">
        <div className="profile-card-head">
          <div>
            <h4 className="profile-section-title">Account Security</h4>
            <p className="profile-section-subtitle">
              Change your password regularly to keep your driver account safe.
            </p>
          </div>
        </div>

        <div className="profile-password-grid">
          <div className="profile-info-box">
            <label className="profile-label">Old Password</label>
            <input
              type="password"
              name="old_password"
              value={passwordData.old_password}
              onChange={handlePasswordChange}
              placeholder="Enter old password"
              className="profile-input"
            />
          </div>

          <div className="profile-info-box">
            <label className="profile-label">New Password</label>
            <input
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="profile-input"
            />
          </div>

          <div className="profile-info-box">
            <label className="profile-label">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className="profile-input"
            />
          </div>
        </div>

        <div className="profile-actions">
          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="profile-primary-btn"
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;