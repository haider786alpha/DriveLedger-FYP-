import React from "react";

const Reports = () => {
  const summary = {
    totalDrivers: 12,
    totalCars: 8,
    totalPayments: 125000,
    totalExpenses: 42000,
    profit: 83000,
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Reports</h4>
          <button className="btn btn-primary">Download Summary</button>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>Total Drivers</h5>
                <h3>{summary.totalDrivers}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>Total Cars</h5>
                <h3>{summary.totalCars}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>Total Payments</h5>
                <h3>Rs. {summary.totalPayments}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5>Total Expenses</h5>
                <h3>Rs. {summary.totalExpenses}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5>Profit</h5>
                <h3 className="text-success">Rs. {summary.profit}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h5 className="mb-3">Report Notes</h5>
            <p className="mb-1">This page will show daily, monthly, and yearly financial summaries.</p>
            <p className="mb-1">It will also include earnings, expenses, and profit analysis.</p>
            <p className="mb-0">Charts and export options will be connected after backend integration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;