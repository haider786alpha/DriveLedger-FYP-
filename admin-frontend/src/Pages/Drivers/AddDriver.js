import React from "react";

const AddDriver = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add New Driver</h4>

        <div className="card">
          <div className="card-body">

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Name</label>
                <input className="form-control" placeholder="Enter full name" />
              </div>

              <div className="col-md-6 mb-3">
                <label>CNIC</label>
                <input className="form-control" placeholder="XXXXX-XXXXXXX-X" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input className="form-control" placeholder="03XX-XXXXXXX" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input className="form-control" placeholder="Enter email" />
              </div>

              <div className="col-md-6 mb-3">
                <label>License Number</label>
                <input className="form-control" placeholder="License number" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select className="form-select">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label>Address</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>

              <div className="col-md-12">
                <button className="btn btn-success">
                  Save Driver
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDriver;