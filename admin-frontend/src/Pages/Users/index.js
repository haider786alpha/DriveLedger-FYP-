import React from "react";
import { Link } from "react-router-dom";

const Users = () => {
  const users = [
    {
      id: 1,
      name: "Admin One",
      username: "admin1",
      email: "admin1@driveledger.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Ali Khan",
      username: "alikhan",
      email: "ali@driveledger.com",
      role: "Driver",
      status: "Active",
    },
    {
      id: 3,
      name: "Usman Tariq",
      username: "usmant",
      email: "usman@driveledger.com",
      role: "Driver",
      status: "Inactive",
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">User Management</h4>
          <Link to="/add-user" className="btn btn-primary">
            Add User
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or username"
                />
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Role</option>
                  <option>Admin</option>
                  <option>Driver</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.username}</td>
                      <td>{item.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.role === "Admin" ? "bg-dark" : "bg-primary"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                       <button className="btn btn-sm btn-info me-2">View</button>

                        <Link to={`/edit-user/${item.id}`} className="btn btn-sm btn-warning me-2">
                          Edit
                        </Link>

                       <button className="btn btn-sm btn-secondary">
                          Reset Password
                       </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;