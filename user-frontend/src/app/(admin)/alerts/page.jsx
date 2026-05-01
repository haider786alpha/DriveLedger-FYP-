// import React, { useEffect, useState } from "react";
// import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
// import { API_URL } from "@/helpers/apiConfig";

// const Alerts = () => {
//   const [driver, setDriver] = useState(null);
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   const fetchAlerts = async () => {
//     try {
//       setLoading(true);

//       const loggedInDriver = await getLoggedInDriver();
//       setDriver(loggedInDriver);

//       if (!loggedInDriver) {
//         setAlerts([]);
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(API_URL("/api/notifications/"));
//       const data = await res.json();

//       const filteredAlerts = (Array.isArray(data) ? data : []).filter(
//         (item) =>
//           item.recipient_type === "all" ||
//           (item.recipient_type === "driver" &&
//             Number(item.driver) === Number(loggedInDriver.id))
//       );

//       setAlerts(filteredAlerts);
//     } catch (error) {
//       console.error("Alerts error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getColor = (type) => {
//     if (type === "warning") return "#f59e0b";
//     if (type === "success") return "#10b981";
//     return "#3b82f6";
//   };

//   if (loading) {
//     return <div>Loading alerts...</div>;
//   }

//   return (
//     <div>
//       <h2>Alerts</h2>
//       <p>Important notifications related to your account.</p>

//       {driver && (
//         <p style={{ marginTop: "10px", fontWeight: "bold" }}>
//           Logged in as: {driver.user_name}
//         </p>
//       )}

//       <div style={{ marginTop: "20px" }}>
//         {alerts.length > 0 ? (
//           alerts.map((alert) => (
//             <div
//               key={alert.id}
//               style={{
//                 borderLeft: `5px solid ${getColor(alert.notification_type)}`,
//                 background: "#f9f9f9",
//                 padding: "15px",
//                 borderRadius: "8px",
//                 marginBottom: "15px",
//               }}
//             >
//               <p style={{ margin: 0, fontWeight: "bold" }}>{alert.title}</p>
//               <p style={{ margin: "8px 0 6px 0" }}>{alert.message}</p>
//               <small style={{ color: "#666" }}>
//                 {new Date(alert.created_at).toLocaleString()}
//               </small>
//             </div>
//           ))
//         ) : (
//           <p>No alerts found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Alerts;

import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";

const Alerts = () => {
  const [driver, setDriver] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setAlerts([]);
        setLoading(false);
        return;
      }

      const res = await fetch(API_URL("/api/notifications/"));
      const data = await res.json();

      const filteredAlerts = (Array.isArray(data) ? data : []).filter(
        (item) =>
          item.recipient_type === "all" ||
          (item.recipient_type === "driver" &&
            Number(item.driver) === Number(loggedInDriver.id))
      );

      setAlerts(filteredAlerts);
    } catch (error) {
      console.error("Alerts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertStyles = (type) => {
    const value = String(type || "").toLowerCase();

    if (value === "warning") {
      return {
        border: "#f59e0b",
        bg: "#fff7ed",
        title: "#92400e",
        text: "#7c2d12",
        iconBg: "#fef3c7",
        icon: "⚠️",
        labelBg: "#fef3c7",
        labelColor: "#92400e",
      };
    }

    if (value === "success") {
      return {
        border: "#22c55e",
        bg: "#f0fdf4",
        title: "#166534",
        text: "#166534",
        iconBg: "#dcfce7",
        icon: "✅",
        labelBg: "#dcfce7",
        labelColor: "#166534",
      };
    }

    return {
      border: "#3b82f6",
      bg: "#eff6ff",
      title: "#1d4ed8",
      text: "#1e3a8a",
      iconBg: "#dbeafe",
      icon: "🔔",
      labelBg: "#dbeafe",
      labelColor: "#1d4ed8",
    };
  };

  const infoCount = alerts.filter(
    (item) => String(item.notification_type).toLowerCase() === "info"
  ).length;

  const warningCount = alerts.filter(
    (item) => String(item.notification_type).toLowerCase() === "warning"
  ).length;

  const successCount = alerts.filter(
    (item) => String(item.notification_type).toLowerCase() === "success"
  ).length;

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
          border: "1px solid #dbeafe",
          borderRadius: "18px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "700", color: "#0f172a" }}>
          Alerts
        </h2>
        <p style={{ margin: "10px 0 0 0", color: "#475569", fontSize: "15px", lineHeight: "1.6" }}>
          Stay updated with important notifications, reminders, and account-related updates.
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
                background: "#3b82f6",
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
            Info Alerts
          </p>
          <h3 style={{ margin: "10px 0 0 0", color: "#2563eb", fontSize: "26px" }}>
            {infoCount}
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
            Warning Alerts
          </p>
          <h3 style={{ margin: "10px 0 0 0", color: "#d97706", fontSize: "26px" }}>
            {warningCount}
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
            Success Alerts
          </p>
          <h3 style={{ margin: "10px 0 0 0", color: "#16a34a", fontSize: "26px" }}>
            {successCount}
          </h3>
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const styles = getAlertStyles(alert.notification_type);

            return (
              <div
                key={alert.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderLeft: `6px solid ${styles.border}`,
                  borderRadius: "18px",
                  padding: "20px",
                  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      minWidth: "48px",
                      borderRadius: "14px",
                      background: styles.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    {styles.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "8px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          color: styles.title,
                          wordBreak: "break-word",
                        }}
                      >
                        {alert.title}
                      </h4>

                      <span
                        style={{
                          background: styles.labelBg,
                          color: styles.labelColor,
                          padding: "6px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {alert.notification_type}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: styles.text,
                        fontSize: "15px",
                        lineHeight: "1.6",
                        wordBreak: "break-word",
                      }}
                    >
                      {alert.message}
                    </p>

                    <small
                      style={{
                        color: "#64748b",
                        fontSize: "13px",
                        wordBreak: "break-word",
                        display: "block",
                      }}
                    >
                      {new Date(alert.created_at).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              background: "#ffffff",
              border: "1px dashed #cbd5e1",
              borderRadius: "18px",
              padding: "28px",
              textAlign: "center",
              color: "#64748b",
              boxShadow: "0 10px 24px rgba(15, 23, 42, 0.03)",
            }}
          >
            No alerts found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;