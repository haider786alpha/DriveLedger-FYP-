// const RepairStatus = () => {
//   const repairs = [
//     {
//       id: 1,
//       issue: "Brake pads replacement",
//       car: "Toyota Corolla",
//       priority: "High",
//       status: "In Progress",
//       date: "20 April 2026",
//       estimatedCost: "Rs. 5,000",
//     },
//     {
//       id: 2,
//       issue: "Engine oil leakage",
//       car: "Toyota Corolla",
//       priority: "Medium",
//       status: "Pending",
//       date: "18 April 2026",
//       estimatedCost: "Rs. 3,500",
//     },
//   ];

//   const getPriorityColor = (priority) => {
//     if (priority === "High") return "#ef4444";
//     if (priority === "Medium") return "#f59e0b";
//     return "#3b82f6";
//   };

//   const getStatusColor = (status) => {
//     if (status === "Completed") return "#10b981";
//     if (status === "In Progress") return "#3b82f6";
//     return "#f59e0b";
//   };

//   return (
//     <div>
//       <h2>Repair Status</h2>
//       <p>Track repair requests and maintenance issues for your assigned car.</p>

//       <div style={{ marginTop: "20px" }}>
//         {repairs.map((item) => (
//           <div
//             key={item.id}
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: "10px",
//               padding: "18px",
//               marginBottom: "16px",
//               background: "#fff",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "10px",
//               }}
//             >
//               <h4 style={{ margin: 0 }}>{item.issue}</h4>
//               <span
//                 style={{
//                   padding: "6px 12px",
//                   borderRadius: "20px",
//                   background: getStatusColor(item.status),
//                   color: "white",
//                   fontSize: "12px",
//                 }}
//               >
//                 {item.status}
//               </span>
//             </div>

//             <p><strong>Car:</strong> {item.car}</p>
//             <p>
//               <strong>Priority:</strong>{" "}
//               <span
//                 style={{
//                   color: getPriorityColor(item.priority),
//                   fontWeight: "bold",
//                 }}
//               >
//                 {item.priority}
//               </span>
//             </p>
//             <p><strong>Reported Date:</strong> {item.date}</p>
//             <p><strong>Estimated Cost:</strong> {item.estimatedCost}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RepairStatus;

const RepairStatus = () => {
  const repairs = [
    {
      id: 1,
      issue: "Brake pads replacement",
      car: "Toyota Corolla",
      priority: "High",
      status: "In Progress",
      date: "20 April 2026",
      estimatedCost: "Rs. 5,000",
    },
    {
      id: 2,
      issue: "Engine oil leakage",
      car: "Toyota Corolla",
      priority: "Medium",
      status: "Pending",
      date: "18 April 2026",
      estimatedCost: "Rs. 3,500",
    },
  ];

  const getPriorityColor = (priority) => {
    if (priority === "High") return "#ef4444";
    if (priority === "Medium") return "#f59e0b";
    return "#3b82f6";
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "#10b981";
    if (status === "In Progress") return "#3b82f6";
    return "#f59e0b";
  };

  return (
    <div>
      <h2>Repair Status</h2>
      <p>Track repair requests and maintenance issues for your assigned car.</p>

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
          <h4>Total Requests</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>2</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>In Progress</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>1</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Pending</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>1</p>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        {repairs.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "18px",
              marginBottom: "16px",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h4 style={{ margin: 0 }}>{item.issue}</h4>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: getStatusColor(item.status),
                  color: "white",
                  fontSize: "12px",
                }}
              >
                {item.status}
              </span>
            </div>

            <p><strong>Car:</strong> {item.car}</p>
            <p>
              <strong>Priority:</strong>{" "}
              <span
                style={{
                  color: getPriorityColor(item.priority),
                  fontWeight: "bold",
                }}
              >
                {item.priority}
              </span>
            </p>
            <p><strong>Reported Date:</strong> {item.date}</p>
            <p><strong>Estimated Cost:</strong> {item.estimatedCost}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepairStatus;