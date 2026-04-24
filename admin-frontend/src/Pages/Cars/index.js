import React from "react";
import { Link } from "react-router-dom";

const Cars = () => {
  const cars = [
    {
      id: 1,
      make: "Toyota",
      model: "Corolla",
      year: 2020,
      registration: "ABC-123",
      mileage: 45000,
      status: "Available",
    },
    {
      id: 2,
      make: "Honda",
      model: "City",
      year: 2019,
      registration: "ICT-456",
      mileage: 52000,
      status: "Assigned",
    },
    {
      id: 3,
      make: "Suzuki",
      model: "WagonR",
      year: 2021,
      registration: "RWP-789",
      mileage: 28000,
      status: "Maintenance",
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Car Management</h4>
          <Link to="/add-car" className="btn btn-primary">
            Add Car
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by make or model"
                />
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Status</option>
                  <option>Available</option>
                  <option>Assigned</option>
                  <option>Maintenance</option>
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
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Registration No</th>
                    <th>Mileage</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id}>
                      <td>{car.id}</td>
                      <td>{car.make}</td>
                      <td>{car.model}</td>
                      <td>{car.year}</td>
                      <td>{car.registration}</td>
                      <td>{car.mileage} km</td>
                      <td>
                        <span
                          className={`badge ${
                            car.status === "Available"
                              ? "bg-success"
                              : car.status === "Assigned"
                              ? "bg-primary"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {car.status}
                        </span>
                      </td>
                      <td>
                       <button className="btn btn-sm btn-info me-2">
                         View
                       </button>

                       <Link to={`/edit-car/${car.id}`} className="btn btn-sm btn-warning me-2">
                         Edit
                       </Link>

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

export default Cars;