// import React, { useEffect, useState } from "react";

// const Alerts = () => {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   const fetchAlerts = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/notifications/");
//       const data = await res.json();

//       setAlerts(Array.isArray(data) ? data : []);
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
//               <p style={{ margin: 0, fontWeight: "bold" }}>
//                 {alert.title}
//               </p>
//               <p style={{ margin: "8px 0 6px 0" }}>
//                 {alert.message}
//               </p>
//               <small style={{ color: "#666" }}>
//                 {alert.created_at}
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

      const res = await fetch("http://localhost:8000/api/notifications/");
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

  const getColor = (type) => {
    if (type === "warning") return "#f59e0b";
    if (type === "success") return "#10b981";
    return "#3b82f6";
  };

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div>
      <h2>Alerts</h2>
      <p>Important notifications related to your account.</p>

      {driver && (
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          Logged in as: {driver.user_name}
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                borderLeft: `5px solid ${getColor(alert.notification_type)}`,
                background: "#f9f9f9",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>{alert.title}</p>
              <p style={{ margin: "8px 0 6px 0" }}>{alert.message}</p>
              <small style={{ color: "#666" }}>
                {alert.created_at}
              </small>
            </div>
          ))
        ) : (
          <p>No alerts found.</p>
        )}
      </div>
    </div>
  );
};

export default Alerts;