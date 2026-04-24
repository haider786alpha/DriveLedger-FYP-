import React from "react";
import { Link } from "react-router-dom";



const Drivers = () => {
  const drivers = [
    {
      id: 1,
      name: "Ali Khan",
      cnic: "35202-1234567-1",
      phone: "0300-1234567",
      assignedCar: "Toyota Corolla",
      status: "Active",
    },
    {
      id: 2,
      name: "Usman Tariq",
      cnic: "37405-7654321-2",
      phone: "0312-9876543",
      assignedCar: "Honda City",
      status: "Active",
    },
    {
      id: 3,
      name: "Bilal Ahmed",
      cnic: "61101-4567890-3",
      phone: "0333-4567890",
      assignedCar: "Suzuki WagonR",
      status: "Inactive",
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Driver Management</h4>
          <Link to="/add-driver" className="btn btn-primary">
            Add Driver
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search driver by name"
                />
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
                    <th>CNIC</th>
                    <th>Phone</th>
                    <th>Assigned Car</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.id}</td>
                      <td>{driver.name}</td>
                      <td>{driver.cnic}</td>
                      <td>{driver.phone}</td>
                      <td>
                       <Link to={`/edit-driver/${driver.id}`} className="btn btn-sm btn-warning me-2">
                         Edit
                       </Link>

                       <button className="btn btn-sm btn-danger">
                         Delete
                       </button>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            driver.status === "Active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {driver.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-info me-2">
                          View
                        </button>
                        <button className="btn btn-sm btn-warning me-2">
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger">
                          Delete
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

export default Drivers;