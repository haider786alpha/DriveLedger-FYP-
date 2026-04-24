import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Cars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cars/");
      setCars(response);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    }
  };

  const deleteCar = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this car?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/cars/${id}/`);
      alert("Car deleted successfully");
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car");
    }
  };

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
                <input className="form-control" placeholder="Search car" />
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
                    <th>Condition</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(cars) && cars.length > 0 ? (
                    cars.map((car) => (
                      <tr key={car.id}>
                        <td>{car.id}</td>
                        <td>{car.make}</td>
                        <td>{car.model}</td>
                        <td>{car.year}</td>
                        <td>{car.registration_number}</td>
                        <td>{car.mileage}</td>
                        <td>{car.condition}</td>

                        <td>
                          <button className="btn btn-sm btn-info me-2">
                            View
                          </button>

                          <Link
                            to={`/edit-car/${car.id}`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteCar(car.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No cars found
                      </td>
                    </tr>
                  )}
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