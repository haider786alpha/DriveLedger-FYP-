// const Dashboard = () => {
//   return (
//     <div>
//       <h2>Driver Dashboard</h2>
//       <p>Welcome to DriveLedger Driver Panel.</p>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//           <h4>Assigned Car</h4>
//           <p>Toyota Corolla</p>
//         </div>

//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//           <h4>Pending Dues</h4>
//           <p>Rs. 5,000</p>
//         </div>

//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//           <h4>Repair Status</h4>
//           <p>No active repair request</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

const Dashboard = () => {
  const summary = {
    assignedCar: "Toyota Corolla",
    pendingDues: "Rs. 5,000",
    repairStatus: "In Progress",
    totalPayments: "Rs. 15,500",
    alerts: 3,
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
          <p>{summary.assignedCar}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Pending Dues</h4>
          <p>{summary.pendingDues}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Repair Status</h4>
          <p>{summary.repairStatus}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Total Payments Received</h4>
          <p>{summary.totalPayments}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Active Alerts</h4>
          <p>{summary.alerts}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;