import React, { useEffect, useState } from "react";

const PendingDues = () => {
  const [dues, setDues] = useState([]);

  const driverId = 2;

  useEffect(() => {
    fetchPendingDues();
  }, []);

  const fetchPendingDues = async () => {
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

      const unpaidPayments = allPayments.filter(
        (payment) =>
          Number(payment.assignment) === Number(activeAssignment.id) &&
          String(payment.status).toLowerCase() === "unpaid"
      );

      setDues(unpaidPayments);
    } catch (error) {
      console.error("Pending dues error:", error);
    }
  };

  const totalPending = dues.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div>
      <h2>Pending Dues</h2>
      <p>View your unpaid dues and pending payment records.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Total Pending Amount</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
            Rs. {totalPending}
          </p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Total Pending Records</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{dues.length}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Status</h4>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: dues.length > 0 ? "#f59e0b" : "#10b981" }}>
            {dues.length > 0 ? "Attention Needed" : "Clear"}
          </p>
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden" }}>
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
            {dues.length > 0 ? (
              dues.map((due) => (
                <tr key={due.id} style={{ borderTop: "1px solid #ddd" }}>
                  <td style={{ padding: "12px" }}>{due.id}</td>
                  <td style={{ padding: "12px" }}>Rs. {due.amount}</td>
                  <td style={{ padding: "12px" }}>{due.payment_date}</td>
                  <td style={{ padding: "12px" }}>{due.status}</td>
                  <td style={{ padding: "12px" }}>{due.remarks || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: "12px", textAlign: "center" }}>
                  No pending dues found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDues;