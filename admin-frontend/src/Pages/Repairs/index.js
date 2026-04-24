import React from "react";

const Repairs = () => {
  const repairs = [
    {
      id: 1,
      car: "Toyota Corolla",
      driver: "Ali Khan",
      issue: "Brake pads need replacement",
      priority: "High",
      status: "Pending",
      estimatedCost: 5000,
    },
    {
      id: 2,
      car: "Honda City",
      driver: "Usman Tariq",
      issue: "Engine oil leakage",
      priority: "Medium",
      status: "In Progress",
      estimatedCost: 3500,
    },
    {
      id: 3,
      car: "Suzuki WagonR",
      driver: "Bilal Ahmed",
      issue: "Tyre replacement",
      priority: "Low",
      status: "Completed",
      estimatedCost: 8000,
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Repairs</h4>
          <button className="btn btn-primary">Create Repair Request</button>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by car or driver"
                />
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Priority</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
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
                    <th>Car</th>
                    <th>Driver</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Estimated Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {repairs.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.car}</td>
                      <td>{item.driver}</td>
                      <td>{item.issue}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.priority === "High"
                              ? "bg-danger"
                              : item.priority === "Medium"
                              ? "bg-warning text-dark"
                              : "bg-info"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Completed"
                              ? "bg-success"
                              : item.status === "In Progress"
                              ? "bg-primary"
                              : "bg-secondary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>Rs. {item.estimatedCost}</td>
                      <td>
                        <button className="btn btn-sm btn-info me-2">
                          View
                        </button>
                        <button className="btn btn-sm btn-warning me-2">
                          Update
                        </button>
                        <button className="btn btn-sm btn-secondary">
                          Upload Bill
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

export default Repairs;