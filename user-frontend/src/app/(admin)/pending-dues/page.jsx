// import React, { useEffect, useState } from "react";
// import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
// import { API_URL } from "@/helpers/apiConfig";

// const PendingDues = () => {
//   const [driver, setDriver] = useState(null);
//   const [dues, setDues] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPendingDues();
//   }, []);

//   const fetchPendingDues = async () => {
//     try {
//       setLoading(true);

//       const loggedInDriver = await getLoggedInDriver();
//       setDriver(loggedInDriver);

//       if (!loggedInDriver) {
//         setLoading(false);
//         return;
//       }

//       const assignmentsRes = await fetch(API_URL("/api/assignments/"));
//       const assignments = await assignmentsRes.json();

//       const driverAssignments = assignments.filter(
//         (item) => Number(item.driver) === Number(loggedInDriver.id)
//       );

//       if (driverAssignments.length === 0) {
//         setDues([]);
//         setLoading(false);
//         return;
//       }

//       const assignmentIds = driverAssignments.map((item) => Number(item.id));

//       const paymentsRes = await fetch(API_URL("/api/payments/"));
//       const allPayments = await paymentsRes.json();

//       const unpaidPayments = allPayments.filter(
//         (payment) =>
//           assignmentIds.includes(Number(payment.assignment)) &&
//           String(payment.status).toLowerCase() === "unpaid"
//       );

//       setDues(unpaidPayments);
//     } catch (error) {
//       console.error("Pending dues error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPending = dues.reduce(
//     (sum, item) => sum + Number(item.amount || 0),
//     0
//   );

//   if (loading) {
//     return <div>Loading pending dues...</div>;
//   }

//   return (
//     <div>
//       <h2>Pending Dues</h2>
//       <p>View your unpaid dues and pending payment records.</p>

//       {driver && (
//         <p style={{ marginTop: "10px", fontWeight: "bold" }}>
//           Logged in as: {driver.user_name}
//         </p>
//       )}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 1fr)",
//           gap: "20px",
//           marginTop: "20px",
//           marginBottom: "20px",
//         }}
//       >
//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//           <h4>Total Pending Amount</h4>
//           <p style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
//             Rs. {totalPending}
//           </p>
//         </div>

//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//           <h4>Total Pending Records</h4>
//           <p style={{ fontSize: "24px", fontWeight: "bold" }}>{dues.length}</p>
//         </div>

//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//           <h4>Status</h4>
//           <p
//             style={{
//               fontSize: "20px",
//               fontWeight: "bold",
//               color: dues.length > 0 ? "#f59e0b" : "#10b981",
//             }}
//           >
//             {dues.length > 0 ? "Attention Needed" : "Clear"}
//           </p>
//         </div>
//       </div>

//       <div style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
//               <th style={{ padding: "12px" }}>#</th>
//               <th style={{ padding: "12px" }}>Amount</th>
//               <th style={{ padding: "12px" }}>Date</th>
//               <th style={{ padding: "12px" }}>Status</th>
//               <th style={{ padding: "12px" }}>Remarks</th>
//             </tr>
//           </thead>

//           <tbody>
//             {dues.length > 0 ? (
//               dues.map((due) => (
//                 <tr key={due.id} style={{ borderTop: "1px solid #ddd" }}>
//                   <td style={{ padding: "12px" }}>{due.id}</td>
//                   <td style={{ padding: "12px" }}>Rs. {due.amount}</td>
//                   <td style={{ padding: "12px" }}>{due.payment_date}</td>
//                   <td style={{ padding: "12px" }}>{due.status}</td>
//                   <td style={{ padding: "12px" }}>{due.remarks || "-"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" style={{ padding: "12px", textAlign: "center" }}>
//                   No pending dues found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PendingDues;

import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";

const PendingDues = () => {
  const [driver, setDriver] = useState(null);
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDues();
  }, []);

  const fetchPendingDues = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setLoading(false);
        return;
      }

      const assignmentsRes = await fetch(API_URL("/api/assignments/"));
      const assignments = await assignmentsRes.json();

      const driverAssignments = assignments.filter(
        (item) => Number(item.driver) === Number(loggedInDriver.id)
      );

      if (driverAssignments.length === 0) {
        setDues([]);
        setLoading(false);
        return;
      }

      const assignmentIds = driverAssignments.map((item) => Number(item.id));

      const paymentsRes = await fetch(API_URL("/api/payments/"));
      const allPayments = await paymentsRes.json();

      const unpaidPayments = allPayments.filter(
        (payment) =>
          assignmentIds.includes(Number(payment.assignment)) &&
          String(payment.status).toLowerCase() === "unpaid"
      );

      setDues(unpaidPayments);
    } catch (error) {
      console.error("Pending dues error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPending = dues.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  if (loading) {
    return <div>Loading pending dues...</div>;
  }

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #fff7ed 0%, #f8fafc 100%)",
          border: "1px solid #fed7aa",
          borderRadius: "18px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "700", color: "#0f172a" }}>
          Pending Dues
        </h2>
        <p style={{ margin: "10px 0 0 0", color: "#475569", fontSize: "15px", lineHeight: "1.6" }}>
          Review unpaid payment records and track the total pending amount.
        </p>

        {driver && (
          <div
            style={{
              marginTop: "18px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "999px",
              padding: "8px 14px",
              fontWeight: "600",
              color: "#1e293b",
              maxWidth: "100%",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#f59e0b",
                display: "inline-block",
              }}
            />
            Logged in as: {driver.user_name}
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
            minWidth: 0,
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
            Total Pending Amount
          </p>
          <h3
            style={{
              margin: "10px 0 0 0",
              color: "#dc2626",
              fontSize: "26px",
              wordBreak: "break-word",
            }}
          >
            Rs. {totalPending}
          </h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
            minWidth: 0,
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
            Total Pending Records
          </p>
          <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "26px" }}>
            {dues.length}
          </h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
            minWidth: 0,
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
            Status
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "8px 14px",
              borderRadius: "999px",
              background: dues.length > 0 ? "#fef3c7" : "#dcfce7",
              color: dues.length > 0 ? "#92400e" : "#166534",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            {dues.length > 0 ? "Attention Needed" : "Clear"}
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h4 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>
              Unpaid Records
            </h4>
            <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" }}>
              Only unpaid dues are listed here
            </p>
          </div>

          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "12px",
              padding: "10px 14px",
              maxWidth: "100%",
            }}
          >
            <strong style={{ color: "#9a3412", fontSize: "15px" }}>
              Pending: {dues.length}
            </strong>
          </div>
        </div>

        {dues.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "620px" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
                    #
                  </th>
                  <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
                    Amount
                  </th>
                  <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
                    Date
                  </th>
                  <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
                    Status
                  </th>
                  <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
                    Remarks
                  </th>
                </tr>
              </thead>

              <tbody>
                {dues.map((due) => (
                  <tr key={due.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "14px", color: "#0f172a", fontWeight: "600" }}>
                      {due.id}
                    </td>
                    <td style={{ padding: "14px", color: "#dc2626", fontWeight: "700" }}>
                      Rs. {due.amount}
                    </td>
                    <td style={{ padding: "14px", color: "#475569" }}>
                      {due.payment_date}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "#fee2e2",
                          color: "#991b1b",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "capitalize",
                          display: "inline-block",
                        }}
                      >
                        {due.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        color: "#475569",
                        wordBreak: "break-word",
                      }}
                    >
                      {due.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              background: "#f8fafc",
              border: "1px dashed #cbd5e1",
              borderRadius: "14px",
              padding: "24px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No pending dues found
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingDues;