import React from "react";

const AddUser = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add New User</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Name</label>
                <input className="form-control" placeholder="Enter full name" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Username</label>
                <input className="form-control" placeholder="Enter username" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input className="form-control" placeholder="Enter email" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input className="form-control" placeholder="03XX-XXXXXXX" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Role</label>
                <select className="form-select">
                  <option>Admin</option>
                  <option>Driver</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select className="form-select">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="col-md-12">
                <button className="btn btn-success">Save User</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;