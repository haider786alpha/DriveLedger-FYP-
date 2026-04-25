import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/repairs/");
      setRepairs(response);
    } catch (error) {
      console.error("Error fetching repairs:", error);
      setRepairs([]);
    }
  };

  const deleteRepair = async (id) => {
    const confirmDelete = window.confirm("Delete this repair record?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/repairs/${id}/`);
      alert("Repair deleted successfully");
      fetchRepairs();
    } catch (error) {
      console.error("Error deleting repair:", error);
      alert("Failed to delete repair");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Repairs</h4>
          <Link to="/add-repair" className="btn btn-primary">
            Create Repair Request
          </Link>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Car ID</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reported Date</th>
                    <th>Estimated Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(repairs) && repairs.length > 0 ? (
                    repairs.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.car}</td>
                        <td>{item.issue}</td>
                        <td>{item.priority}</td>
                        <td>{item.status}</td>
                        <td>{item.reported_date}</td>
                        <td>Rs. {item.estimated_cost}</td>
                        <td>
                          <Link to={`/edit-repair/${item.id}`} className="btn btn-sm btn-warning me-2">
                            Edit
                          </Link>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteRepair(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No repairs found
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

export default Repairs;