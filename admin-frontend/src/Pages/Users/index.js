import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/");
      setUsers(res);
    } catch (error) {
      console.error("Users error:", error);
      setUsers([]);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`);
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* ✅ STEP 3 ADDED HERE */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">User Management</h4>
          <a href="/add-user" className="btn btn-primary">
            Add User
          </a>
        </div>

        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email || "-"}</td>
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
                    <td colSpan="5" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Users;