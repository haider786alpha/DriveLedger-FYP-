import React from "react";
import { Link } from "react-router-dom";

const Expenses = () => {
  const expenses = [
    {
      id: 1,
      car: "Toyota Corolla",
      date: "2026-04-20",
      amount: 2500,
      category: "Fuel",
      notes: "Petrol refill",
    },
    {
      id: 2,
      car: "Honda City",
      date: "2026-04-19",
      amount: 4000,
      category: "Maintenance",
      notes: "Oil change",
    },
    {
      id: 3,
      car: "Suzuki WagonR",
      date: "2026-04-18",
      amount: 800,
      category: "Toll Tax",
      notes: "Motorway toll",
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Expenses</h4>
          <Link to="/add-expense" className="btn btn-primary">
           Add Expense
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by car"
                />
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Category</option>
                  <option>Fuel</option>
                  <option>Maintenance</option>
                  <option>Toll Tax</option>
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
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.car}</td>
                      <td>{item.date}</td>
                      <td>Rs. {item.amount}</td>
                      <td>{item.category}</td>
                      <td>{item.notes}</td>
                      <td>
                       <button className="btn btn-sm btn-info me-2">View</button>

                        <Link to={`/edit-expense/${item.id}`} className="btn btn-sm btn-warning me-2">
                          Edit
                        </Link>

                       <button className="btn btn-sm btn-secondary">
                          Attach Note
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

export default Expenses;