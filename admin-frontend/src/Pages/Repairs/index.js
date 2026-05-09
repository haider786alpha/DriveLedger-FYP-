import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchData = async () => {
    try {
      const [repairsRes, carsRes] = await Promise.all([
        axios.get(API_URL("/api/repairs/")),
        axios.get(API_URL("/api/cars/")),
      ]);

      setRepairs(normalizeResponse(repairsRes));
      setCars(normalizeResponse(carsRes));
    } catch (error) {
      console.error("Error fetching repairs:", error);
      setRepairs([]);
      setCars([]);
    }
  };

  const getCarName = (carId) => {
    const car = cars.find((c) => Number(c.id) === Number(carId));

    return car
      ? `${car.make} ${car.model} - ${car.registration_number}`
      : `Car ${carId}`;
  };

  const deleteRepair = async (id) => {
    if (!window.confirm("Delete this repair record?")) return;

    try {
      await axios.delete(API_URL(`/api/repairs/${id}/`));
      alert("Repair deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting repair:", error);
      alert("Failed to delete repair");
    }
  };

  const filteredRepairs = repairs.filter((item) =>
    `${getCarName(item.car)} ${item.issue} ${item.priority} ${item.status} ${
      item.reported_date
    } ${item.estimated_cost} ${item.actual_cost || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusBadge = (status) => {
    if (status === "completed") return "bg-success";
    if (status === "in_progress") return "bg-warning text-dark";
    return "bg-danger";
  };

  const priorityBadge = (priority) => {
    if (priority === "high") return "bg-danger";
    if (priority === "medium") return "bg-warning text-dark";
    return "bg-info";
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Repairs</h4>
            <p className="text-muted mb-0">
              Manage vehicle repair requests, priority, status, costs, and repair bills/receipts.
            </p>
          </div>

          <Link to="/add-repair" className="btn btn-primary">
            Create Repair Request
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <input
              className="form-control"
              placeholder="Search by car, issue, priority, status, date, or cost"
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
                    <th>Car</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reported Date</th>
                    <th>Estimated Cost</th>
                    <th>Actual Cost</th>
                    <th>Bill / Receipt</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRepairs.length > 0 ? (
                    filteredRepairs.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td>{getCarName(item.car)}</td>

                        <td>
                          <strong>{item.issue}</strong>
                          {item.notes && (
                            <div className="text-muted small mt-1">
                              {item.notes.length > 50
                                ? item.notes.slice(0, 50) + "..."
                                : item.notes}
                            </div>
                          )}
                        </td>

                        <td>
                          <span className={`badge ${priorityBadge(item.priority)}`}>
                            {item.priority}
                          </span>
                        </td>

                        <td>
                          <span className={`badge ${statusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>

                        <td>{item.reported_date}</td>

                        <td>
                          <strong>Rs. {item.estimated_cost}</strong>
                        </td>

                        <td>
                          <strong>Rs. {item.actual_cost || 0}</strong>
                        </td>

                        <td>
                          {item.bill_receipt_url ? (
                            <a
                              href={item.bill_receipt_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              View Bill
                            </a>
                          ) : (
                            <span className="badge bg-secondary">
                              Not Uploaded
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <Link
                              to={`/edit-repair/${item.id}`}
                              className="btn btn-sm btn-warning"
                            >
                              Edit
                            </Link>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteRepair(item.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
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