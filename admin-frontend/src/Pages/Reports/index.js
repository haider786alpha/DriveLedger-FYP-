import React, { useEffect, useState } from "react";
import axios from "axios";

const Reports = () => {
  const [summary, setSummary] = useState({
    totalDrivers: 0,
    totalCars: 0,
    totalAssignments: 0,
    totalPayments: 0,
    totalExpenses: 0,
    totalRepairs: 0,
    profit: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const drivers = await axios.get("http://127.0.0.1:8000/api/drivers/");
      const cars = await axios.get("http://127.0.0.1:8000/api/cars/");
      const assignments = await axios.get("http://127.0.0.1:8000/api/assignments/");
      const payments = await axios.get("http://127.0.0.1:8000/api/payments/");
      const expenses = await axios.get("http://127.0.0.1:8000/api/expenses/");
      const repairs = await axios.get("http://127.0.0.1:8000/api/repairs/");

      const totalPayments = payments.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      const totalExpenses = expenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      setSummary({
        totalDrivers: drivers.length,
        totalCars: cars.length,
        totalAssignments: assignments.length,
        totalPayments,
        totalExpenses,
        totalRepairs: repairs.length,
        profit: totalPayments - totalExpenses,
      });
    } catch (error) {
      console.error("Reports summary error:", error);
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Reports</h4>
          <button className="btn btn-primary" onClick={window.print}>
            Print / Download Summary
          </button>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="card"><div className="card-body">
              <h5>Total Drivers</h5>
              <h3>{summary.totalDrivers}</h3>
            </div></div>
          </div>

          <div className="col-md-4">
            <div className="card"><div className="card-body">
              <h5>Total Cars</h5>
              <h3>{summary.totalCars}</h3>
            </div></div>
          </div>

          <div className="col-md-4">
            <div className="card"><div className="card-body">
              <h5>Total Assignments</h5>
              <h3>{summary.totalAssignments}</h3>
            </div></div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-4">
            <div className="card"><div className="card-body">
              <h5>Total Payments</h5>
              <h3>Rs. {summary.totalPayments}</h3>
            </div></div>
          </div>

          <div className="col-md-4">
            <div className="card"><div className="card-body">
              <h5>Total Expenses</h5>
              <h3>Rs. {summary.totalExpenses}</h3>
            </div></div>
          </div>

          <div className="col-md-4">
            <div className="card"><div className="card-body">
              <h5>Total Repairs</h5>
              <h3>{summary.totalRepairs}</h3>
            </div></div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-12">
            <div className="card"><div className="card-body">
              <h5>Net Profit</h5>
              <h3 className={summary.profit >= 0 ? "text-success" : "text-danger"}>
                Rs. {summary.profit}
              </h3>
            </div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;