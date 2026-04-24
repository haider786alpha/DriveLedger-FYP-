import React from "react";

const AddCar = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add New Car</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Make</label>
                <input className="form-control" placeholder="e.g. Toyota" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Model</label>
                <input className="form-control" placeholder="e.g. Corolla" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Year</label>
                <input className="form-control" placeholder="e.g. 2020" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Registration Number</label>
                <input className="form-control" placeholder="ABC-123" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Mileage</label>
                <input className="form-control" placeholder="45000" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Condition</label>
                <select className="form-select">
                  <option>Good</option>
                  <option>Average</option>
                  <option>Needs Maintenance</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Last Service Date</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Next Maintenance Date</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Insurance Expiry</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Registration Expiry</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-md-12 mb-3">
                <label>Notes</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>

              <div className="col-md-12">
                <button className="btn btn-success">Save Car</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;