import React from "react";

const AssignDriver = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Assign Driver to Car</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Select Driver</label>
                <select className="form-select">
                  <option>Ali Khan</option>
                  <option>Usman Ali</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Select Car</label>
                <select className="form-select">
                  <option>Toyota Corolla</option>
                  <option>Honda City</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Start Date</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select className="form-select">
                  <option>Active</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="col-md-12">
                <button className="btn btn-success">
                  Assign Driver
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDriver;