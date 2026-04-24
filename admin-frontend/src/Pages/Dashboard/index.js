import React from "react";

const Dashboard = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">DriveLedger Dashboard</h4>

        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>Total Drivers</h5>
                <h3>0</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>Total Cars</h5>
                <h3>0</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>Total Payments</h5>
                <h3>0</h3>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;