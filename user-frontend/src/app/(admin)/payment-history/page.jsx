import React, { useEffect, useState } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  const driverId = 6;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const assignmentsRes = await fetch("http://localhost:8000/api/assignments/");
      const assignments = await assignmentsRes.json();

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(driverId) &&
          String(item.status).toLowerCase() === "active"
      );

      if (!activeAssignment) return;

      const paymentsRes = await fetch("http://localhost:8000/api/payments/");
      const allPayments = await paymentsRes.json();

      const driverPayments = allPayments.filter(
        (payment) => Number(payment.assignment) === Number(activeAssignment.id)
      );

      setPayments(driverPayments);
    } catch (error) {
      console.error("Payment history error:", error);
    }
  };

  return (
    <div>
      <h2>Payment History</h2>
      <p>View your payment records and status.</p>

      <div style={{ marginTop: "20px", border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>#</th>
              <th style={{ padding: "12px" }}>Amount</th>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} style={{ borderTop: "1px solid #ddd" }}>
                  <td style={{ padding: "12px" }}>{payment.id}</td>
                  <td style={{ padding: "12px" }}>Rs. {payment.amount}</td>
                  <td style={{ padding: "12px" }}>{payment.payment_date}</td>
                  <td style={{ padding: "12px" }}>{payment.status}</td>
                  <td style={{ padding: "12px" }}>{payment.remarks || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: "12px", textAlign: "center" }}>
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;