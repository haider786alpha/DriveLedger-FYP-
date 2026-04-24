// const PaymentHistory = () => {
//   const payments = [
//     {
//       id: 1,
//       date: "20 April 2026",
//       amount: "Rs. 5,000",
//       type: "Daily Payment",
//       status: "Paid",
//     },
//     {
//       id: 2,
//       date: "19 April 2026",
//       amount: "Rs. 4,500",
//       type: "Daily Payment",
//       status: "Pending",
//     },
//     {
//       id: 3,
//       date: "18 April 2026",
//       amount: "Rs. 6,000",
//       type: "Bonus",
//       status: "Paid",
//     },
//   ];

//   return (
//     <div>
//       <h2>Payment History</h2>
//       <p>View your payment records and status.</p>

//       <div
//         style={{
//           marginTop: "20px",
//           border: "1px solid #ddd",
//           borderRadius: "10px",
//           overflow: "hidden",
//         }}
//       >
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
//               <th style={{ padding: "12px" }}>#</th>
//               <th style={{ padding: "12px" }}>Date</th>
//               <th style={{ padding: "12px" }}>Amount</th>
//               <th style={{ padding: "12px" }}>Type</th>
//               <th style={{ padding: "12px" }}>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map((payment) => (
//               <tr key={payment.id} style={{ borderTop: "1px solid #ddd" }}>
//                 <td style={{ padding: "12px" }}>{payment.id}</td>
//                 <td style={{ padding: "12px" }}>{payment.date}</td>
//                 <td style={{ padding: "12px" }}>{payment.amount}</td>
//                 <td style={{ padding: "12px" }}>{payment.type}</td>
//                 <td style={{ padding: "12px" }}>
//                   <span
//                     style={{
//                       padding: "6px 12px",
//                       borderRadius: "20px",
//                       background:
//                         payment.status === "Paid" ? "#10b981" : "#f59e0b",
//                       color: "white",
//                       fontSize: "12px",
//                     }}
//                   >
//                     {payment.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PaymentHistory;

const PaymentHistory = () => {
  const payments = [
    {
      id: 1,
      date: "20 April 2026",
      amount: "Rs. 5,000",
      type: "Daily Payment",
      status: "Paid",
    },
    {
      id: 2,
      date: "19 April 2026",
      amount: "Rs. 4,500",
      type: "Daily Payment",
      status: "Pending",
    },
    {
      id: 3,
      date: "18 April 2026",
      amount: "Rs. 6,000",
      type: "Bonus",
      status: "Paid",
    },
  ];

  return (
    <div>
      <h2>Payment History</h2>
      <p>View your payment records and status.</p>

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
          <h4>Total Records</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>3</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Total Paid</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>Rs. 11,000</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Pending Amount</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>Rs. 4,500</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "10px",
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
              <th style={{ padding: "12px" }}>Type</th>
              <th style={{ padding: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>{payment.id}</td>
                <td style={{ padding: "12px" }}>{payment.date}</td>
                <td style={{ padding: "12px" }}>{payment.amount}</td>
                <td style={{ padding: "12px" }}>{payment.type}</td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background:
                        payment.status === "Paid" ? "#10b981" : "#f59e0b",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {payment.status}
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

export default PaymentHistory;