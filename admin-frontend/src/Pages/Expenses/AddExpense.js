import React from "react";

const AddExpense = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add Expense</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Car</label>
                <select className="form-select">
                  <option>Toyota Corolla</option>
                  <option>Honda City</option>
                  <option>Suzuki WagonR</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Expense Date</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Amount</label>
                <input className="form-control" placeholder="Enter amount" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Category</label>
                <select className="form-select">
                  <option>Fuel</option>
                  <option>Maintenance</option>
                  <option>Toll Tax</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label>Notes</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>

              <div className="col-md-12">
                <button className="btn btn-success">Save Expense</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;