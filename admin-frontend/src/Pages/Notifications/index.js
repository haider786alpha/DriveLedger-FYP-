import React from "react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: "Late Payment Alert",
      message: "Ali Khan has not submitted payment for today.",
      type: "Warning",
      date: "2026-04-21",
    },
    {
      id: 2,
      title: "Maintenance Required",
      message: "Honda City requires servicing.",
      type: "Info",
      date: "2026-04-20",
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment received from Usman Tariq.",
      type: "Success",
      date: "2026-04-19",
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Notifications</h4>
          <button className="btn btn-primary">Create Notification</button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>{item.message}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.type === "Success"
                              ? "bg-success"
                              : item.type === "Warning"
                              ? "bg-warning text-dark"
                              : "bg-info"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td>{item.date}</td>
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

export default Notifications;