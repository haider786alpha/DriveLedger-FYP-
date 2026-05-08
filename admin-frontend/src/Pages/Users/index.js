// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../../helpers/apiConfig";

// const Users = () => {
//   const [users, setUsers] = useState([]);

//   const [showResetModal, setShowResetModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [resetPasswordData, setResetPasswordData] = useState({
//     new_password: "",
//     confirm_password: "",
//   });
//   const [resettingPassword, setResettingPassword] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const normalizeResponse = (res) => {
//     if (Array.isArray(res)) return res;
//     if (Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.results)) return res.results;
//     if (Array.isArray(res?.data?.results)) return res.data.results;
//     return [];
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(API_URL("/api/users/"));
//       setUsers(normalizeResponse(res));
//     } catch (error) {
//       console.error("Users error:", error);
//       setUsers([]);
//     }
//   };

//   const deleteUser = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this user?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(API_URL(`/api/users/${id}/`));
//       alert("User deleted successfully");
//       fetchUsers();
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Failed to delete user");
//     }
//   };

//   const openResetModal = (user) => {
//     setSelectedUser(user);
//     setResetPasswordData({
//       new_password: "",
//       confirm_password: "",
//     });
//     setShowResetModal(true);
//   };

//   const closeResetModal = () => {
//     setShowResetModal(false);
//     setSelectedUser(null);
//     setResetPasswordData({
//       new_password: "",
//       confirm_password: "",
//     });
//   };

//   const handleResetPasswordChange = (e) => {
//     const { name, value } = e.target;

//     setResetPasswordData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleResetPassword = async () => {
//     if (!selectedUser) {
//       alert("No user selected.");
//       return;
//     }

//     if (!resetPasswordData.new_password.trim()) {
//       alert("Please enter a new password.");
//       return;
//     }

//     if (resetPasswordData.new_password.length < 6) {
//       alert("Password must be at least 6 characters long.");
//       return;
//     }

//     if (resetPasswordData.new_password !== resetPasswordData.confirm_password) {
//       alert("New password and confirm password do not match.");
//       return;
//     }

//     try {
//       setResettingPassword(true);

//       await axios.post(
//         API_URL(`/api/users/${selectedUser.id}/reset-password/`),
//         {
//           new_password: resetPasswordData.new_password,
//           confirm_password: resetPasswordData.confirm_password,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       alert(`Password reset successfully for ${selectedUser.username}.`);
//       closeResetModal();
//     } catch (error) {
//       console.error("Reset password error:", error);
//       alert(error?.response?.data?.error || "Failed to reset password.");
//     } finally {
//       setResettingPassword(false);
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 className="mb-0">User Management</h4>
//           <a href="/add-user" className="btn btn-primary">
//             Add User
//           </a>
//         </div>

//         <div className="card">
//           <div className="card-body">
//             <table className="table table-bordered table-hover align-middle">
//               <thead className="table-light">
//                 <tr>
//                   <th>#</th>
//                   <th>Username</th>
//                   <th>Email</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {Array.isArray(users) && users.length > 0 ? (
//                   users.map((user, index) => (
//                     <tr key={user.id}>
//                       <td>{index + 1}</td>
//                       <td>{user.username}</td>
//                       <td>{user.email || "-"}</td>
//                       <td>
//                         <span className="badge bg-success">Active</span>
//                       </td>
//                       <td>
//                         <a
//                           href={`/edit-user/${user.id}`}
//                           className="btn btn-sm btn-warning me-2"
//                         >
//                           Edit
//                         </a>

//                         <button
//                           className="btn btn-sm btn-info text-white me-2"
//                           onClick={() => openResetModal(user)}
//                         >
//                           Reset Password
//                         </button>

//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => deleteUser(user.id)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center">
//                       No users found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {showResetModal && selectedUser && (
//           <div
//             style={{
//               position: "fixed",
//               inset: 0,
//               background: "rgba(15, 23, 42, 0.45)",
//               zIndex: 9999,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "20px",
//             }}
//           >
//             <div
//               style={{
//                 background: "#ffffff",
//                 borderRadius: "14px",
//                 width: "100%",
//                 maxWidth: "460px",
//                 boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "18px 20px",
//                   borderBottom: "1px solid #e5e7eb",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   gap: "12px",
//                 }}
//               >
//                 <div>
//                   <h5 className="mb-1">Reset Password</h5>
//                   <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
//                     User: <strong>{selectedUser.username}</strong>
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   className="btn btn-sm btn-light"
//                   onClick={closeResetModal}
//                 >
//                   X
//                 </button>
//               </div>

//               <div style={{ padding: "20px" }}>
//                 <div className="mb-3">
//                   <label className="form-label">New Password</label>
//                   <input
//                     type="password"
//                     name="new_password"
//                     className="form-control"
//                     placeholder="Enter new password"
//                     value={resetPasswordData.new_password}
//                     onChange={handleResetPasswordChange}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Confirm Password</label>
//                   <input
//                     type="password"
//                     name="confirm_password"
//                     className="form-control"
//                     placeholder="Confirm new password"
//                     value={resetPasswordData.confirm_password}
//                     onChange={handleResetPasswordChange}
//                   />
//                 </div>

//                 <div className="alert alert-warning mb-3">
//                   The old password will not be shown. Admin can only set a new password.
//                 </div>

//                 <div className="d-flex justify-content-end gap-2">
//                   <button
//                     type="button"
//                     className="btn btn-light"
//                     onClick={closeResetModal}
//                     disabled={resettingPassword}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleResetPassword}
//                     disabled={resettingPassword}
//                   >
//                     {resettingPassword ? "Resetting..." : "Reset Password"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Users;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

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
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(API_URL(`/api/users/${id}/`));
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user");
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
      alert("No user selected.");
      return;
    }

    if (!resetPasswordData.new_password.trim()) {
      alert("Please enter a new password.");
      return;
    }

    if (resetPasswordData.new_password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (resetPasswordData.new_password !== resetPasswordData.confirm_password) {
      alert("New password and confirm password do not match.");
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

      alert(`Password reset successfully for ${selectedUser.username}.`);
      closeResetModal();
    } catch (error) {
      console.error("Reset password error:", error);
      alert(error?.response?.data?.error || "Failed to reset password.");
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

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">User Management</h4>
            <p className="text-muted mb-0">
              Create admin users and driver login users with correct access roles.
            </p>
          </div>

          <a href="/add-user" className="btn btn-primary">
            Add User
          </a>
        </div>

        <div className="alert alert-info">
          <strong>Access Rule:</strong> Admin users can access the admin panel.
          Driver users can access the driver panel only after a driver profile is created.
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <input
              className="form-control"
              placeholder="Search by username, email, or user type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
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
                {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{user.username}</strong>
                      </td>

                      <td>{user.email || "-"}</td>

                      <td>
                        {user.is_staff ? (
                          <span className="badge bg-primary">Admin</span>
                        ) : (
                          <span className="badge bg-success">Driver</span>
                        )}
                      </td>

                      <td>
                        <span className="badge bg-success">Active</span>
                      </td>

                      <td>
                        <a
                          href={`/edit-user/${user.id}`}
                          className="btn btn-sm btn-warning me-2"
                        >
                          Edit
                        </a>

                        <button
                          className="btn btn-sm btn-info text-white me-2"
                          onClick={() => openResetModal(user)}
                        >
                          Reset Password
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showResetModal && selectedUser && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.45)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                width: "100%",
                maxWidth: "460px",
                boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 20px",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div>
                  <h5 className="mb-1">Reset Password</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                    User: <strong>{selectedUser.username}</strong>
                  </p>
                  <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                    Type:{" "}
                    <strong>
                      {selectedUser.is_staff ? "Admin" : "Driver"}
                    </strong>
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={closeResetModal}
                >
                  X
                </button>
              </div>

              <div style={{ padding: "20px" }}>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="new_password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={resetPasswordData.new_password}
                    onChange={handleResetPasswordChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={resetPasswordData.confirm_password}
                    onChange={handleResetPasswordChange}
                  />
                </div>

                <div className="alert alert-warning mb-3">
                  The old password will not be shown. Admin can only set a new password.
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={closeResetModal}
                    disabled={resettingPassword}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleResetPassword}
                    disabled={resettingPassword}
                  >
                    {resettingPassword ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;