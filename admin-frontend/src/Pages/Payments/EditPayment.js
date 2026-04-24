import React from "react";
import { useParams } from "react-router-dom";

const EditPayment = () => {
  const { id } = useParams();

  const payment = {
    driver: "Ali Khan",
    car: "Toyota Corolla",
    date: "2026-04-20",
    amount: "5000",
    type: "Daily Payment",
    status: "Paid",
    remarks: "Submitted on time",
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Payment (ID: {id})</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Driver</label>
                <select defaultValue={payment.driver} className="form-select">
                  <option>Ali Khan</option>
                  <option>Usman Tariq</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Car</label>
                <select defaultValue={payment.car} className="form-select">
                  <option>Toyota Corolla</option>
                  <option>Honda City</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Payment Date</label>
                <input type="date" defaultValue={payment.date} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Amount</label>
                <input defaultValue={payment.amount} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Payment Type</label>
                <select defaultValue={payment.type} className="form-select">
                  <option>Daily Payment</option>
                  <option>Bonus</option>
                  <option>Advance</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select defaultValue={payment.status} className="form-select">
                  <option>Paid</option>
                  <option>Unpaid</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label>Remarks</label>
                <textarea defaultValue={payment.remarks} className="form-control" rows="3"></textarea>
              </div>

              <div className="col-md-12">
                <button className="btn btn-primary">Update Payment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPayment;