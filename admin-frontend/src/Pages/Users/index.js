import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    user: null,
    deleting: false,
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetPasswordData, setResetPasswordData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL("/api/users/"));
      setUsers(normalizeResponse(res));
    } catch (error) {
      console.error("Users error:", error);
      setUsers([]);
      showToast(
        "error",
        "Users Load Failed",
        "Could not load user records. Please refresh and try again."
      );
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModal({
      open: true,
      user,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      user: null,
      deleting: false,
    });
  };

  const confirmDeleteUser = async () => {
    if (!deleteModal.user?.id) return;

    setDeleteModal((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await axios.delete(API_URL(`/api/users/${deleteModal.user.id}/`));

      closeDeleteModal();

      showToast(
        "success",
        "User Deleted Successfully",
        "User account has been removed from DriveLedger."
      );

      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);

      setDeleteModal((prev) => ({
        ...prev,
        deleting: false,
      }));

      showToast(
        "error",
        "Delete Failed",
        "User could not be deleted. Please try again."
      );
    }
  };

  const openResetModal = (user) => {
    setSelectedUser(user);
    setResetPasswordData({
      new_password: "",
      confirm_password: "",
    });
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setSelectedUser(null);
    setResetPasswordData({
      new_password: "",
      confirm_password: "",
    });
  };

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;

    setResetPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async () => {
    if (!selectedUser) {
      showToast("error", "No User Selected", "Please select a user first.");
      return;
    }

    if (!resetPasswordData.new_password.trim()) {
      showToast("error", "Password Required", "Please enter a new password.");
      return;
    }

    if (resetPasswordData.new_password.length < 6) {
      showToast(
        "error",
        "Password Too Short",
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (resetPasswordData.new_password !== resetPasswordData.confirm_password) {
      showToast(
        "error",
        "Password Mismatch",
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setResettingPassword(true);

      await axios.post(
        API_URL(`/api/users/${selectedUser.id}/reset-password/`),
        {
          new_password: resetPasswordData.new_password,
          confirm_password: resetPasswordData.confirm_password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      showToast(
        "success",
        "Password Reset Successfully",
        `Password has been reset for ${selectedUser.username}.`
      );

      closeResetModal();
    } catch (error) {
      console.error("Reset password error:", error);

      showToast(
        "error",
        "Reset Failed",
        error?.response?.data?.error || "Failed to reset password."
      );
    } finally {
      setResettingPassword(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.username || ""} ${user.email || ""} ${
      user.is_staff ? "admin staff" : "driver"
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalAdmins = users.filter((user) => user.is_staff).length;
  const totalDrivers = users.filter((user) => !user.is_staff).length;

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

      {deleteModal.open && (
        <div className="user-modal-backdrop">
          <div className="user-modal-card">
            <div className="user-modal-icon">!</div>

            <h5>Delete User Account?</h5>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteModal.user?.username}</strong>? This action cannot
              be undone.
            </p>

            <div className="user-modal-actions">
              <button
                type="button"
                className="user-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="user-modal-delete"
                onClick={confirmDeleteUser}
                disabled={deleteModal.deleting}
              >
                {deleteModal.deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && selectedUser && (
        <div className="user-modal-backdrop">
          <div className="user-modal-card">
            <div className="user-modal-icon user-modal-icon-info">🔐</div>

            <h5>Reset Password</h5>
            <p>
              User: <strong>{selectedUser.username}</strong>
              <br />
              Type:{" "}
              <strong>{selectedUser.is_staff ? "Admin" : "Driver"}</strong>
            </p>

            <div className="mt-3">
              <label className="user-modal-label">New Password</label>
              <input
                type="password"
                name="new_password"
                className="user-modal-input"
                placeholder="Enter new password"
                value={resetPasswordData.new_password}
                onChange={handleResetPasswordChange}
              />
            </div>

            <div className="mt-3">
              <label className="user-modal-label">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                className="user-modal-input"
                placeholder="Confirm new password"
                value={resetPasswordData.confirm_password}
                onChange={handleResetPasswordChange}
              />
            </div>

            <div className="user-modal-warning mt-3">
              The old password will not be shown. Admin can only set a new
              password.
            </div>

            <div className="user-modal-actions">
              <button
                type="button"
                className="user-modal-cancel"
                onClick={closeResetModal}
                disabled={resettingPassword}
              >
                Cancel
              </button>

              <button
                type="button"
                className="user-modal-primary"
                onClick={handleResetPassword}
                disabled={resettingPassword}
              >
                {resettingPassword ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="users-hero users-reveal users-delay-1">
          <div>
            <div className="users-hero-pill">
              <span className="dl-status-dot"></span>
              Account Access Control
            </div>

            <h4>User Management</h4>
            <p>
              Manage admin users and driver login accounts with secure role-based
              access.
            </p>
          </div>

          <Link to="/add-user" className="users-add-btn">
            + Add User
          </Link>
        </div>

        <div className="users-alert users-reveal users-delay-2">
          <div className="users-alert-icon">i</div>
          <div>
            <strong>Access Rule:</strong> Admin users can access the admin
            panel. Driver users can access the driver panel only after a driver
            profile is created.
          </div>
        </div>

        <div className="users-search-card users-reveal users-delay-2">
          <input
            className="users-search-input"
            placeholder="Search by username, email, or user type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="users-table-card users-reveal users-delay-3">
          <div className="users-table-header">
            <div>
              <h5>User List</h5>
              <p className="text-muted mb-0">
                Showing {filteredUsers.length} of {users.length} user accounts
              </p>
            </div>

            <span className="users-count">
              {totalAdmins} Admins · {totalDrivers} Drivers
            </span>
          </div>

          <div className="users-table-wrap">
            <table className="table table-hover align-middle users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="user-name">{user.username}</div>
                        <div className="user-sub">DriveLedger account</div>
                      </td>

                      <td>{user.email || "-"}</td>

                      <td>
                        <UserTypeBadge isStaff={user.is_staff} />
                      </td>

                      <td>
                        <span className="user-badge user-badge-active">
                          Active
                        </span>
                      </td>

                      <td>
                        <div className="users-actions">
                          <Link
                            to={`/edit-user/${user.id}`}
                            className="users-edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="users-reset-btn"
                            onClick={() => openResetModal(user)}
                          >
                            Reset Password
                          </button>

                          <button
                            type="button"
                            className="users-delete-btn"
                            onClick={() => openDeleteModal(user)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="users-empty">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="users-mobile-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div className="users-mobile-card" key={user.id}>
                  <div className="users-mobile-top">
                    <div>
                      <div className="user-name">
                        {index + 1}. {user.username}
                      </div>
                      <div className="user-sub">{user.email || "-"}</div>
                    </div>

                    <UserTypeBadge isStaff={user.is_staff} />
                  </div>

                  <div className="users-mobile-row">
                    <span>Status</span>
                    <strong>Active</strong>
                  </div>

                  <div className="users-mobile-row">
                    <span>Account Type</span>
                    <strong>{user.is_staff ? "Admin" : "Driver"}</strong>
                  </div>

                  <div className="users-actions">
                    <Link
                      to={`/edit-user/${user.id}`}
                      className="users-edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="users-reset-btn"
                      onClick={() => openResetModal(user)}
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      className="users-delete-btn"
                      onClick={() => openDeleteModal(user)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="users-empty">No users found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserTypeBadge = ({ isStaff }) =>
  isStaff ? (
    <span className="user-badge user-badge-admin">Admin</span>
  ) : (
    <span className="user-badge user-badge-driver">Driver</span>
  );

export default Users;