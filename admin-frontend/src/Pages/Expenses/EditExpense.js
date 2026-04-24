import React from "react";
import { useParams } from "react-router-dom";

const EditExpense = () => {
  const { id } = useParams();

  const expense = {
    car: "Toyota Corolla",
    date: "2026-04-20",
    amount: "2500",
    category: "Fuel",
    notes: "Petrol refill",
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Expense (ID: {id})</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Car</label>
                <select defaultValue={expense.car} className="form-select">
                  <option>Toyota Corolla</option>
                  <option>Honda City</option>
                  <option>Suzuki WagonR</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Expense Date</label>
                <input type="date" defaultValue={expense.date} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Amount</label>
                <input defaultValue={expense.amount} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Category</label>
                <select defaultValue={expense.category} className="form-select">
                  <option>Fuel</option>
                  <option>Maintenance</option>
                  <option>Toll Tax</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label>Notes</label>
                <textarea defaultValue={expense.notes} className="form-control" rows="3"></textarea>
              </div>

              <div className="col-md-12">
                <button className="btn btn-primary">Update Expense</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExpense;