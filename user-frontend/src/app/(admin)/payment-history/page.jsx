// import React, { useEffect, useState } from "react";
// import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
// import { API_URL } from "@/helpers/apiConfig";

// const PaymentHistory = () => {
//   const [driver, setDriver] = useState(null);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
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
//         setPayments([]);
//         setLoading(false);
//         return;
//       }

//       const assignmentIds = driverAssignments.map((item) => Number(item.id));

//       const paymentsRes = await fetch(API_URL("/api/payments/"));
//       const allPayments = await paymentsRes.json();

//       const driverPayments = allPayments.filter(
//         (payment) =>
//           assignmentIds.includes(Number(payment.assignment)) &&
//           String(payment.status).toLowerCase() === "paid"
//       );

//       setPayments(driverPayments);
//     } catch (error) {
//       console.error("Payment history error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPaidAmount = payments.reduce(
//     (sum, item) => sum + Number(item.amount || 0),
//     0
//   );

//   if (loading) {
//     return <div>Loading payment history...</div>;
//   }

//   return (
//     <div>
//       <div
//         style={{
//           background: "linear-gradient(135deg, #ecfeff 0%, #f8fafc 100%)",
//           border: "1px solid #cffafe",
//           borderRadius: "18px",
//           padding: "24px",
//           marginBottom: "24px",
//           boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
//         }}
//       >
//         <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "700", color: "#0f172a" }}>
//           Payment History
//         </h2>
//         <p style={{ margin: "10px 0 0 0", color: "#475569", fontSize: "15px", lineHeight: "1.6" }}>
//           Review all completed payment records linked to your assignments.
//         </p>

//         {driver && (
//           <div
//             style={{
//               marginTop: "18px",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "8px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "999px",
//               padding: "8px 14px",
//               fontWeight: "600",
//               color: "#1e293b",
//               maxWidth: "100%",
//               flexWrap: "wrap",
//             }}
//           >
//             <span
//               style={{
//                 width: "10px",
//                 height: "10px",
//                 borderRadius: "50%",
//                 background: "#22c55e",
//                 display: "inline-block",
//               }}
//             />
//             Logged in as: {driver.user_name}
//           </div>
//         )}
//       </div>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//           gap: "20px",
//           marginBottom: "24px",
//         }}
//       >
//         <div
//           style={{
//             background: "#ffffff",
//             border: "1px solid #e5e7eb",
//             borderRadius: "18px",
//             padding: "22px",
//             boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
//             minWidth: 0,
//           }}
//         >
//           <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
//             Total Paid Records
//           </p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "26px" }}>
//             {payments.length}
//           </h3>
//         </div>

//         <div
//           style={{
//             background: "#ffffff",
//             border: "1px solid #e5e7eb",
//             borderRadius: "18px",
//             padding: "22px",
//             boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
//             minWidth: 0,
//           }}
//         >
//           <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
//             Total Amount Paid
//           </p>
//           <h3
//             style={{
//               margin: "10px 0 0 0",
//               color: "#0f172a",
//               fontSize: "26px",
//               wordBreak: "break-word",
//             }}
//           >
//             Rs. {totalPaidAmount}
//           </h3>
//         </div>

//         <div
//           style={{
//             background: "#ffffff",
//             border: "1px solid #e5e7eb",
//             borderRadius: "18px",
//             padding: "22px",
//             boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
//             minWidth: 0,
//           }}
//         >
//           <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
//             Payment Status
//           </p>
//           <span
//             style={{
//               display: "inline-block",
//               marginTop: "12px",
//               padding: "8px 14px",
//               borderRadius: "999px",
//               background: "#dcfce7",
//               color: "#166534",
//               fontSize: "12px",
//               fontWeight: "700",
//             }}
//           >
//             Paid Records Only
//           </span>
//         </div>
//       </div>

//       <div
//         style={{
//           background: "#ffffff",
//           border: "1px solid #e5e7eb",
//           borderRadius: "18px",
//           padding: "22px",
//           boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
//           minWidth: 0,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "18px",
//             flexWrap: "wrap",
//             gap: "12px",
//           }}
//         >
//           <div style={{ minWidth: 0 }}>
//             <h4 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>
//               Completed Payments
//             </h4>
//             <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" }}>
//               A clean view of your successful payment history
//             </p>
//           </div>

//           <div
//             style={{
//               background: "#f8fafc",
//               border: "1px solid #e2e8f0",
//               borderRadius: "12px",
//               padding: "10px 14px",
//               maxWidth: "100%",
//             }}
//           >
//             <strong style={{ color: "#0f172a", fontSize: "15px" }}>
//               Total: {payments.length}
//             </strong>
//           </div>
//         </div>

//         {payments.length > 0 ? (
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "620px" }}>
//               <thead>
//                 <tr style={{ background: "#f8fafc" }}>
//                   <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
//                     #
//                   </th>
//                   <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
//                     Amount
//                   </th>
//                   <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
//                     Date
//                   </th>
//                   <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
//                     Status
//                   </th>
//                   <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
//                     Remarks
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {payments.map((payment) => (
//                   <tr key={payment.id} style={{ borderTop: "1px solid #e5e7eb" }}>
//                     <td style={{ padding: "14px", color: "#0f172a", fontWeight: "600" }}>
//                       {payment.id}
//                     </td>
//                     <td style={{ padding: "14px", color: "#0f172a", fontWeight: "600" }}>
//                       Rs. {payment.amount}
//                     </td>
//                     <td style={{ padding: "14px", color: "#475569" }}>
//                       {payment.payment_date}
//                     </td>
//                     <td style={{ padding: "14px" }}>
//                       <span
//                         style={{
//                           padding: "6px 12px",
//                           borderRadius: "999px",
//                           background: "#dcfce7",
//                           color: "#166534",
//                           fontSize: "12px",
//                           fontWeight: "700",
//                           textTransform: "capitalize",
//                           display: "inline-block",
//                         }}
//                       >
//                         {payment.status}
//                       </span>
//                     </td>
//                     <td
//                       style={{
//                         padding: "14px",
//                         color: "#475569",
//                         wordBreak: "break-word",
//                       }}
//                     >
//                       {payment.remarks || "-"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div
//             style={{
//               background: "#f8fafc",
//               border: "1px dashed #cbd5e1",
//               borderRadius: "14px",
//               padding: "24px",
//               textAlign: "center",
//               color: "#64748b",
//             }}
//           >
//             No payments found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentHistory;


import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";

const PaymentHistory = () => {
  const [driver, setDriver] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
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
        setPayments([]);
        setLoading(false);
        return;
      }

      const assignmentIds = driverAssignments.map((item) => Number(item.id));

      const paymentsRes = await fetch(API_URL("/api/payments/"));
      const allPayments = await paymentsRes.json();

      const driverPayments = allPayments.filter(
        (payment) =>
          assignmentIds.includes(Number(payment.assignment)) &&
          String(payment.status).toLowerCase() === "paid"
      );

      setPayments(driverPayments);
    } catch (error) {
      console.error("Payment history error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPaidAmount = payments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const downloadPaymentSummary = () => {
    if (!payments || payments.length === 0) {
      alert("No payment records available to download.");
      return;
    }

    const headers = ["ID", "Amount", "Payment Date", "Status", "Remarks"];

    const rows = payments.map((payment) => [
      payment.id,
      payment.amount,
      payment.payment_date,
      payment.status,
      payment.remarks || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `payment-summary-${driver?.user_name || "driver"}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #ecfeff 0%, #f8fafc 100%)",
          border: "1px solid #cffafe",
          borderRadius: "18px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: "700",
            color: "#0f172a",
          }}
        >
          Payment History
        </h2>

        <p
          style={{
            margin: "10px 0 0 0",
            color: "#475569",
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        >
          Review all completed payment records linked to your assignments.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "18px",
          }}
        >
          {driver && (
            <div
              style={{
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
                  background: "#22c55e",
                  display: "inline-block",
                }}
              />
              Logged in as: {driver.user_name}
            </div>
          )}

          <button
            onClick={downloadPaymentSummary}
            disabled={payments.length === 0}
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: "12px",
              border: "none",
              background: payments.length === 0 ? "#94a3b8" : "#2563eb",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "700",
              cursor: payments.length === 0 ? "not-allowed" : "pointer",
              boxShadow:
                payments.length === 0
                  ? "none"
                  : "0 8px 20px rgba(37, 99, 235, 0.22)",
            }}
          >
            Download Payment Summary
          </button>
        </div>
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
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Total Paid Records
          </p>
          <h3
            style={{
              margin: "10px 0 0 0",
              color: "#0f172a",
              fontSize: "26px",
            }}
          >
            {payments.length}
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
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Total Amount Paid
          </p>
          <h3
            style={{
              margin: "10px 0 0 0",
              color: "#0f172a",
              fontSize: "26px",
              wordBreak: "break-word",
            }}
          >
            Rs. {totalPaidAmount}
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
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Payment Status
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "#dcfce7",
              color: "#166534",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            Paid Records Only
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
              Completed Payments
            </h4>
            <p
              style={{
                margin: "6px 0 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              A clean view of your successful payment history
            </p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "10px 14px",
              maxWidth: "100%",
            }}
          >
            <strong style={{ color: "#0f172a", fontSize: "15px" }}>
              Total: {payments.length}
            </strong>
          </div>
        </div>

        {payments.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "620px",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    Remarks
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    style={{ borderTop: "1px solid #e5e7eb" }}
                  >
                    <td
                      style={{
                        padding: "14px",
                        color: "#0f172a",
                        fontWeight: "600",
                      }}
                    >
                      {payment.id}
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        color: "#0f172a",
                        fontWeight: "600",
                      }}
                    >
                      Rs. {payment.amount}
                    </td>
                    <td style={{ padding: "14px", color: "#475569" }}>
                      {payment.payment_date}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "#dcfce7",
                          color: "#166534",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "capitalize",
                          display: "inline-block",
                        }}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        color: "#475569",
                        wordBreak: "break-word",
                      }}
                    >
                      {payment.remarks || "-"}
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
            No payments found
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;