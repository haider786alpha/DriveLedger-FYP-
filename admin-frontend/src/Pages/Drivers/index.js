import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/drivers/");
      setDrivers(response);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers([]);
    }
  };

  const deleteDriver = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/drivers/${id}/`);
      alert("Driver deleted successfully");
      fetchDrivers();
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("Failed to delete driver");
    }
  };

  const filteredDrivers = drivers.filter((driver) =>
    `${driver.user_name} ${driver.cnic} ${driver.license_number} ${driver.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Driver Management</h4>
            <p className="text-muted mb-0">Manage driver records, CNIC, license and address details.</p>
          </div>

          <Link to="/add-driver" className="btn btn-primary">
            Add Driver
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <input
              type="text"
              className="form-control"
              placeholder="Search by driver name, CNIC, license number, or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Driver</th>
                    <th>CNIC</th>
                    <th>License Number</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDrivers.length > 0 ? (
                    filteredDrivers.map((driver, index) => (
                      <tr key={driver.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{driver.user_name || `Driver ${driver.id}`}</strong>
                        </td>
                        <td>{driver.cnic}</td>
                        <td>{driver.license_number}</td>
                        <td>{driver.address}</td>
                        <td>
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