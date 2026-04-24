import React from "react";

const AddPayment = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add Payment Entry</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Driver</label>
                <select className="form-select">
                  <option>Ali Khan</option>
                  <option>Usman Tariq</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Car</label>
                <select className="form-select">
                  <option>Toyota Corolla</option>
                  <option>Honda City</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Payment Date</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Amount</label>
                <input className="form-control" placeholder="Enter amount" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Payment Type</label>
                <select className="form-select">
                  <option>Daily Payment</option>
                  <option>Bonus</option>
                  <option>Advance</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select className="form-select">
                  <option>Paid</option>
                  <option>Unpaid</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label>Remarks</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>

              <div className="col-md-12">
                <button className="btn btn-success">Save Payment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;