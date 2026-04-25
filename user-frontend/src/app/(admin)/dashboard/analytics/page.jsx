import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [assignment, setAssignment] = useState(null);
  const [car, setCar] = useState(null);
  const [payments, setPayments] = useState([]);

  const driverId = 6;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getData = (response) => {
    return response?.data ? response.data : response;
  };

const fetchDashboardData = async () => {
  try {
    const assignmentsRes = await fetch("http://localhost:8000/api/assignments/");
    const assignments = await assignmentsRes.json();

    console.log("Assignments:", assignments);

    const activeAssignment = assignments.find(
      (item) =>
        Number(item.driver) === Number(driverId) &&
        String(item.status).toLowerCase() === "active"
    );

    console.log("Active Assignment:", activeAssignment);

    setAssignment(activeAssignment || null);

    if (!activeAssignment) return;

    const carRes = await fetch(`http://localhost:8000/api/cars/${activeAssignment.car}/`);
    const carData = await carRes.json();
    setCar(carData);

    const paymentsRes = await fetch("http://localhost:8000/api/payments/");
    const allPayments = await paymentsRes.json();

    const relatedPayments = allPayments.filter(
      (payment) => Number(payment.assignment) === Number(activeAssignment.id)
    );

    setPayments(relatedPayments);
  } catch (error) {
    console.error("Dashboard error:", error);
  }
};

  return (
    <div>
      <h2>Driver Dashboard</h2>
      <p>Welcome to DriveLedger Driver Panel.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Assigned Car</h4>
          <p>{car ? `${car.make} ${car.model}` : "No car assigned"}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Assignment Status</h4>
          <p>{assignment ? assignment.status : "No active assignment"}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Total Payments</h4>
          <p>{payments.length}</p>
        </div>
      </div>

      <div style={{ marginTop: "25px", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
        <h4>Recent Payments</h4>

        {payments.length > 0 ? (
          <table style={{ width: "100%", marginTop: "15px" }}>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>Rs. {payment.amount}</td>
                  <td>{payment.payment_date}</td>
                  <td>{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payments found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;