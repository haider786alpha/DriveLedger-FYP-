import React from "react";
import { useParams } from "react-router-dom";

const EditDriver = () => {
  const { id } = useParams();

  // Dummy data (later will come from backend)
  const driver = {
    name: "Ali Khan",
    cnic: "35202-1234567-1",
    phone: "0300-1234567",
    email: "ali@gmail.com",
    license: "LHR-12345",
    status: "Active",
    address: "Rawalpindi",
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Driver (ID: {id})</h4>

        <div className="card">
          <div className="card-body">

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Name</label>
                <input defaultValue={driver.name} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>CNIC</label>
                <input defaultValue={driver.cnic} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input defaultValue={driver.phone} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input defaultValue={driver.email} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>License Number</label>
                <input defaultValue={driver.license} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select defaultValue={driver.status} className="form-select">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label>Address</label>
                <textarea defaultValue={driver.address} className="form-control" rows="3"></textarea>
              </div>

              <div className="col-md-12">
                <button className="btn btn-primary">
                  Update Driver
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDriver;