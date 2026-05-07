// import React, { useEffect, useState } from "react";
// import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
// import { API_URL } from "@/helpers/apiConfig";
// import {
//   pageHeroStyle,
//   pageTitleStyle,
//   pageSubtitleStyle,
//   loggedInPillStyle,
//   statCardStyle,
//   emptyStateStyle,
//   statLabelStyle,
// } from "@/helpers/panelStyles";

// const Alerts = () => {
//   const [driver, setDriver] = useState(null);
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [markingId, setMarkingId] = useState(null);

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

//       const res = await fetch(
//         API_URL(`/api/notifications/?driver_id=${loggedInDriver.id}`)
//       );
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

//   const markAsRead = async (notificationId) => {
//     if (!driver) return;

//     try {
//       setMarkingId(notificationId);

//       await fetch(API_URL(`/api/notifications/${notificationId}/mark-read/`), {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           driver: driver.id,
//         }),
//       });

//       setAlerts((prev) =>
//         prev.map((item) =>
//           item.id === notificationId
//             ? {
//                 ...item,
//                 is_read: true,
//                 read_at: new Date().toISOString(),
//               }
//             : item
//         )
//       );
//     } catch (error) {
//       console.error("Mark read error:", error);
//     } finally {
//       setMarkingId(null);
//     }
//   };

//   const getAlertStyles = (type, isRead) => {
//     const value = String(type || "").toLowerCase();
//     const opacity = isRead ? 0.72 : 1;

//     if (value === "warning") {
//       return {
//         border: "#f59e0b",
//         bg: "#fff7ed",
//         title: "#92400e",
//         text: "#7c2d12",
//         iconBg: "#fef3c7",
//         icon: "⚠️",
//         labelBg: "#fef3c7",
//         labelColor: "#92400e",
//         opacity,
//       };
//     }

//     if (value === "success") {
//       return {
//         border: "#22c55e",
//         bg: "#f0fdf4",
//         title: "#166534",
//         text: "#166534",
//         iconBg: "#dcfce7",
//         icon: "✅",
//         labelBg: "#dcfce7",
//         labelColor: "#166534",
//         opacity,
//       };
//     }

//     return {
//       border: "#3b82f6",
//       bg: "#eff6ff",
//       title: "#1d4ed8",
//       text: "#1e3a8a",
//       iconBg: "#dbeafe",
//       icon: "🔔",
//       labelBg: "#dbeafe",
//       labelColor: "#1d4ed8",
//       opacity,
//     };
//   };

//   const infoCount = alerts.filter(
//     (item) => String(item.notification_type).toLowerCase() === "info"
//   ).length;

//   const warningCount = alerts.filter(
//     (item) => String(item.notification_type).toLowerCase() === "warning"
//   ).length;

//   const successCount = alerts.filter(
//     (item) => String(item.notification_type).toLowerCase() === "success"
//   ).length;

//   const unreadCount = alerts.filter((item) => !item.is_read).length;

//   if (loading) {
//     return <div>Loading alerts...</div>;
//   }

//   return (
//     <div>
//       <div style={pageHeroStyle}>
//         <h2 style={pageTitleStyle}>Alerts</h2>
//         <p style={pageSubtitleStyle}>
//           Stay updated with important notifications, reminders, and account-related updates.
//         </p>

//         {driver && (
//           <div style={loggedInPillStyle}>
//             <span
//               style={{
//                 width: "10px",
//                 height: "10px",
//                 borderRadius: "50%",
//                 background: "#3b82f6",
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
//         <div style={statCardStyle}>
//           <p style={statLabelStyle}>Unread Alerts</p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#dc2626", fontSize: "26px" }}>
//             {unreadCount}
//           </h3>
//         </div>

//         <div style={statCardStyle}>
//           <p style={statLabelStyle}>Info Alerts</p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#2563eb", fontSize: "26px" }}>
//             {infoCount}
//           </h3>
//         </div>

//         <div style={statCardStyle}>
//           <p style={statLabelStyle}>Warning Alerts</p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#d97706", fontSize: "26px" }}>
//             {warningCount}
//           </h3>
//         </div>

//         <div style={statCardStyle}>
//           <p style={statLabelStyle}>Success Alerts</p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#16a34a", fontSize: "26px" }}>
//             {successCount}
//           </h3>
//         </div>
//       </div>

//       <div style={{ display: "grid", gap: "16px" }}>
//         {alerts.length > 0 ? (
//           alerts.map((alert) => {
//             const styles = getAlertStyles(alert.notification_type, alert.is_read);

//             return (
//               <div
//                 key={alert.id}
//                 style={{
//                   background: "#ffffff",
//                   border: alert.is_read
//                     ? "1px solid #e5e7eb"
//                     : `1px solid ${styles.border}`,
//                   borderLeft: `6px solid ${styles.border}`,
//                   borderRadius: "18px",
//                   padding: "20px",
//                   boxShadow: alert.is_read
//                     ? "0 8px 20px rgba(15, 23, 42, 0.03)"
//                     : "0 10px 24px rgba(15, 23, 42, 0.06)",
//                   minWidth: 0,
//                   opacity: styles.opacity,
//                   transition: "all 0.2s ease",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "16px",
//                     alignItems: "flex-start",
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: "48px",
//                       height: "48px",
//                       minWidth: "48px",
//                       borderRadius: "14px",
//                       background: styles.iconBg,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "22px",
//                     }}
//                   >
//                     {styles.icon}
//                   </div>

//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "flex-start",
//                         gap: "12px",
//                         flexWrap: "wrap",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       <div style={{ minWidth: 0 }}>
//                         <h4
//                           style={{
//                             margin: 0,
//                             fontSize: "20px",
//                             color: styles.title,
//                             wordBreak: "break-word",
//                           }}
//                         >
//                           {alert.title}
//                         </h4>

//                         {!alert.is_read && (
//                           <span
//                             style={{
//                               display: "inline-block",
//                               marginTop: "6px",
//                               padding: "4px 10px",
//                               borderRadius: "999px",
//                               background: "#fee2e2",
//                               color: "#991b1b",
//                               fontSize: "11px",
//                               fontWeight: "700",
//                             }}
//                           >
//                             Unread
//                           </span>
//                         )}
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           gap: "8px",
//                           alignItems: "center",
//                           flexWrap: "wrap",
//                         }}
//                       >
//                         <span
//                           style={{
//                             background: styles.labelBg,
//                             color: styles.labelColor,
//                             padding: "6px 12px",
//                             borderRadius: "999px",
//                             fontSize: "12px",
//                             fontWeight: "700",
//                             textTransform: "capitalize",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {alert.notification_type}
//                         </span>

//                         {!alert.is_read && (
//                           <button
//                             onClick={() => markAsRead(alert.id)}
//                             disabled={markingId === alert.id}
//                             style={{
//                               padding: "7px 12px",
//                               borderRadius: "10px",
//                               border: "1px solid #cbd5e1",
//                               background: "#ffffff",
//                               color: "#334155",
//                               fontSize: "12px",
//                               fontWeight: "700",
//                               cursor: "pointer",
//                             }}
//                           >
//                             {markingId === alert.id ? "Marking..." : "Mark Read"}
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     <p
//                       style={{
//                         margin: "0 0 12px 0",
//                         color: styles.text,
//                         fontSize: "15px",
//                         lineHeight: "1.6",
//                         wordBreak: "break-word",
//                       }}
//                     >
//                       {alert.message}
//                     </p>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: "12px",
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <small
//                         style={{
//                           color: "#64748b",
//                           fontSize: "13px",
//                           wordBreak: "break-word",
//                           display: "block",
//                         }}
//                       >
//                         Created: {new Date(alert.created_at).toLocaleString()}
//                       </small>

//                       {alert.read_at && (
//                         <small
//                           style={{
//                             color: "#2563eb",
//                             fontSize: "13px",
//                             wordBreak: "break-word",
//                             display: "block",
//                           }}
//                         >
//                           Read: {new Date(alert.read_at).toLocaleString()}
//                         </small>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div style={emptyStateStyle}>No alerts found.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Alerts;

import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import {
  pageHeroStyle,
  pageTitleStyle,
  pageSubtitleStyle,
  loggedInPillStyle,
  statCardStyle,
  emptyStateStyle,
  statLabelStyle,
} from "@/helpers/panelStyles";

const Alerts = () => {
  const [driver, setDriver] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

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

      const res = await fetch(
        API_URL(`/api/notifications/?driver_id=${loggedInDriver.id}`)
      );
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

  const markAsRead = async (notificationId) => {
    if (!driver) return;

    try {
      setMarkingId(notificationId);

      await fetch(API_URL(`/api/notifications/${notificationId}/mark-read/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver: driver.id,
        }),
      });

      setAlerts((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                is_read: true,
                read_at: new Date().toISOString(),
              }
            : item
        )
      );

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Mark read error:", error);
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    if (!driver) return;

    const unreadAlerts = alerts.filter((item) => !item.is_read);
    if (unreadAlerts.length === 0) return;

    try {
      setMarkingAll(true);

      for (const alert of unreadAlerts) {
        await fetch(API_URL(`/api/notifications/${alert.id}/mark-read/`), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver: driver.id,
          }),
        });
      }

      const now = new Date().toISOString();

      setAlerts((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
          read_at: item.read_at || now,
        }))
      );

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Mark all read error:", error);
      alert("Failed to mark all alerts as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  const getAlertStyles = (type, isRead) => {
    const value = String(type || "").toLowerCase();
    const opacity = isRead ? 0.72 : 1;

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
        opacity,
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
        opacity,
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
      opacity,
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

  const unreadCount = alerts.filter((item) => !item.is_read).length;

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div>
      <div style={pageHeroStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={pageTitleStyle}>Alerts</h2>
            <p style={pageSubtitleStyle}>
              Stay updated with important notifications, reminders, and
              account-related updates.
            </p>

            {driver && (
              <div style={loggedInPillStyle}>
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

          <button
            onClick={markAllAsRead}
            disabled={markingAll || unreadCount === 0}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: unreadCount === 0 ? "#f8fafc" : "#ffffff",
              color: unreadCount === 0 ? "#94a3b8" : "#334155",
              fontSize: "13px",
              fontWeight: "700",
              cursor: unreadCount === 0 ? "not-allowed" : "pointer",
              boxShadow:
                unreadCount === 0
                  ? "none"
                  : "0 8px 20px rgba(15, 23, 42, 0.05)",
              whiteSpace: "nowrap",
            }}
          >
            {markingAll ? "Marking All..." : "Mark All Read"}
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
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Unread Alerts</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#dc2626", fontSize: "26px" }}>
            {unreadCount}
          </h3>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Info Alerts</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#2563eb", fontSize: "26px" }}>
            {infoCount}
          </h3>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Warning Alerts</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#d97706", fontSize: "26px" }}>
            {warningCount}
          </h3>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Success Alerts</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#16a34a", fontSize: "26px" }}>
            {successCount}
          </h3>
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const styles = getAlertStyles(alert.notification_type, alert.is_read);

            return (
              <div
                key={alert.id}
                style={{
                  background: "#ffffff",
                  border: alert.is_read
                    ? "1px solid #e5e7eb"
                    : `1px solid ${styles.border}`,
                  borderLeft: `6px solid ${styles.border}`,
                  borderRadius: "18px",
                  padding: "20px",
                  boxShadow: alert.is_read
                    ? "0 8px 20px rgba(15, 23, 42, 0.03)"
                    : "0 10px 24px rgba(15, 23, 42, 0.06)",
                  minWidth: 0,
                  opacity: styles.opacity,
                  transition: "all 0.2s ease",
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
                      <div style={{ minWidth: 0 }}>
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

                        {!alert.is_read && (
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "6px",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              background: "#fee2e2",
                              color: "#991b1b",
                              fontSize: "11px",
                              fontWeight: "700",
                            }}
                          >
                            Unread
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
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

                        {!alert.is_read && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            disabled={markingId === alert.id}
                            style={{
                              padding: "7px 12px",
                              borderRadius: "10px",
                              border: "1px solid #cbd5e1",
                              background: "#ffffff",
                              color: "#334155",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            {markingId === alert.id ? "Marking..." : "Mark Read"}
                          </button>
                        )}
                      </div>
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

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <small
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          wordBreak: "break-word",
                          display: "block",
                        }}
                      >
                        Created: {new Date(alert.created_at).toLocaleString()}
                      </small>

                      {alert.read_at && (
                        <small
                          style={{
                            color: "#2563eb",
                            fontSize: "13px",
                            wordBreak: "break-word",
                            display: "block",
                          }}
                        >
                          Read: {new Date(alert.read_at).toLocaleString()}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={emptyStateStyle}>No alerts found.</div>
        )}
      </div>
    </div>
  );
};

export default Alerts;