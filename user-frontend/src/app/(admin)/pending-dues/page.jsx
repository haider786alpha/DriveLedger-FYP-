const PendingDues = () => {
  const dues = [
    {
      id: 1,
      date: "19 April 2026",
      amount: "Rs. 4,500",
      reason: "Daily Payment Not Submitted",
      status: "Pending",
    },
    {
      id: 2,
      date: "15 April 2026",
      amount: "Rs. 3,000",
      reason: "Late Deposit",
      status: "Pending",
    },
  ];

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
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>Rs. 7,500</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Total Pending Records</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>2</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Status</h4>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>Attention Needed</p>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>#</th>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Amount</th>
              <th style={{ padding: "12px" }}>Reason</th>
              <th style={{ padding: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((due) => (
              <tr key={due.id} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>{due.id}</td>
                <td style={{ padding: "12px" }}>{due.date}</td>
                <td style={{ padding: "12px" }}>{due.amount}</td>
                <td style={{ padding: "12px" }}>{due.reason}</td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background: "#ef4444",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {due.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDues;