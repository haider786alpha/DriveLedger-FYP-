import React from "react";
import { Link } from "react-router-dom";

const Payments = () => {
  const payments = [
    {
      id: 1,
      driver: "Ali Khan",
      car: "Toyota Corolla",
      date: "2026-04-20",
      amount: 5000,
      type: "Daily Payment",
      status: "Paid",
    },
    {
      id: 2,
      driver: "Usman Tariq",
      car: "Honda City",
      date: "2026-04-19",
      amount: 4500,
      type: "Daily Payment",
      status: "Unpaid",
    },
    {
      id: 3,
      driver: "Bilal Ahmed",
      car: "Suzuki WagonR",
      date: "2026-04-18",
      amount: 6000,
      type: "Bonus",
      status: "Paid",
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Payments</h4>
          <Link to="/add-payment" className="btn btn-primary">
           Add Payment Entry
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by driver name"
                />
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Status</option>
                  <option>Paid</option>
                  <option>Unpaid</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Type</option>
                  <option>Daily Payment</option>
                  <option>Bonus</option>
                  <option>Advance</option>
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
                    <th>Driver</th>
                    <th>Car</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.driver}</td>
                      <td>{item.car}</td>
                      <td>{item.date}</td>
                      <td>Rs. {item.amount}</td>
                      <td>{item.type}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Paid"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                       <button className="btn btn-sm btn-info me-2">View</button>

                        <Link to={`/edit-payment/${item.id}`} className="btn btn-sm btn-warning me-2">
                          Edit
                        </Link>

                       <button className="btn btn-sm btn-secondary">
                          Update Status
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

export default Payments;