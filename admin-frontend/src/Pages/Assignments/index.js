import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/assignments/");
      setAssignments(response);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAssignments([]);
    }
  };

  const deleteAssignment = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this assignment?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/assignments/${id}/`);
      alert("Assignment removed successfully");
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to remove assignment");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Car Assignments</h4>

          <Link to="/assign-driver" className="btn btn-primary">
            Assign Car
          </Link>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Driver ID</th>
                    <th>Car ID</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(assignments) && assignments.length > 0 ? (
                    assignments.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.driver}</td>
                        <td>{item.car}</td>
                        <td>{item.start_date}</td>
                        <td>{item.end_date || "-"}</td>
                        <td>
                          <span className={`badge ${item.status === "active" ? "bg-success" : "bg-secondary"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteAssignment(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No assignments found
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

export default Assignments;