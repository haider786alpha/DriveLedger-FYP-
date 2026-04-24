import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

const fetchDrivers = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/drivers/");

    console.log("Full response:", response);
    console.log("Actual data:", response.data);

    setDrivers(response);

  } catch (error) {
    console.error("Error fetching drivers:", error);
    setDrivers([]);
  }
};
const deleteDriver = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this driver?");

  if (!confirmDelete) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/api/drivers/${id}/`);
    alert("Driver deleted successfully");
    fetchDrivers();
  } catch (error) {
    console.error("Error deleting driver:", error);
    alert("Failed to delete driver");
  }
};


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
                  placeholder="Search driver"
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
                    <th>Driver Name</th>
                    <th>CNIC</th>
                    <th>License Number</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(drivers) && drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <tr key={driver.id}>
                        <td>{driver.id}</td>
                        <td>{driver.user_name}</td>
                        <td>{driver.cnic}</td>
                        <td>{driver.license_number}</td>
                        <td>{driver.address}</td>

                        <td>
                          <button className="btn btn-sm btn-info me-2">
                            View
                          </button>

                          <Link
                            to={`/edit-driver/${driver.id}`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>

                          <button
                           className="btn btn-sm btn-danger"
                           onClick={() => deleteDriver(driver.id)}
                          >
                           Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No drivers found
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

export default Drivers;