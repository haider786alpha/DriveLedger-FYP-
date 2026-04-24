import React from "react";
import { useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();

  const user = {
    name: "Ali Khan",
    username: "alikhan",
    email: "ali@driveledger.com",
    phone: "0300-1234567",
    role: "Driver",
    status: "Active",
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit User (ID: {id})</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Name</label>
                <input defaultValue={user.name} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Username</label>
                <input defaultValue={user.username} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input defaultValue={user.email} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input defaultValue={user.phone} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Role</label>
                <select defaultValue={user.role} className="form-select">
                  <option>Admin</option>
                  <option>Driver</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select defaultValue={user.status} className="form-select">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="col-md-12">
                <button className="btn btn-primary">Update User</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;