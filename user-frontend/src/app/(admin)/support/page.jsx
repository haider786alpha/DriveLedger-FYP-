// import React, { useEffect, useState } from "react";
// import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
// import { API_URL } from "@/helpers/apiConfig";

// const Support = () => {
//   const [driver, setDriver] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [subject, setSubject] = useState("");
//   const [messageText, setMessageText] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);

//   useEffect(() => {
//     fetchSupportMessages();
//   }, []);

//   const fetchSupportMessages = async () => {
//     try {
//       setLoading(true);

//       const loggedInDriver = await getLoggedInDriver();
//       setDriver(loggedInDriver);

//       if (!loggedInDriver) {
//         setMessages([]);
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(API_URL("/api/support-messages/"));
//       const data = await res.json();

//       const driverMessages = (Array.isArray(data) ? data : []).filter(
//         (item) => Number(item.driver) === Number(loggedInDriver.id)
//       );

//       setMessages(driverMessages);
//     } catch (error) {
//       console.error("Support fetch error:", error);
//       setMessages([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!driver) {
//       alert("Driver not found.");
//       return;
//     }

//     if (!subject.trim() || !messageText.trim()) {
//       alert("Please enter subject and message.");
//       return;
//     }

//     try {
//       setSending(true);

//       const payload = {
//         driver: driver.id,
//         subject: subject.trim(),
//         message: messageText.trim(),
//         status: "open",
//       };

//       const res = await fetch(API_URL("/api/support-messages/"), {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to send support message");
//       }

//       setSubject("");
//       setMessageText("");
//       alert("Support message sent successfully.");
//       fetchSupportMessages();
//     } catch (error) {
//       console.error("Support send error:", error);
//       alert("Failed to send support message.");
//     } finally {
//       setSending(false);
//     }
//   };

//   const statusStyle = (status) => {
//     const value = String(status || "").toLowerCase();

//     if (value === "resolved") {
//       return {
//         background: "#dcfce7",
//         color: "#166534",
//       };
//     }

//     return {
//       background: "#fef3c7",
//       color: "#92400e",
//     };
//   };

//   const openCount = messages.filter(
//     (item) => String(item.status).toLowerCase() === "open"
//   ).length;

//   const resolvedCount = messages.filter(
//     (item) => String(item.status).toLowerCase() === "resolved"
//   ).length;

//   return (
//     <div>
//       <div
//         style={{
//           background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
//           border: "1px solid #dbeafe",
//           borderRadius: "18px",
//           padding: "24px",
//           marginBottom: "24px",
//           boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
//         }}
//       >
//         <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "700", color: "#0f172a" }}>
//           Support
//         </h2>
//         <p style={{ margin: "10px 0 0 0", color: "#475569", fontSize: "15px", lineHeight: "1.6" }}>
//           Contact admin for help, report issues, or ask questions related to your account and assigned car.
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
//             Total Messages
//           </p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "26px" }}>
//             {messages.length}
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
//             Open Requests
//           </p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#d97706", fontSize: "26px" }}>
//             {openCount}
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
//             Resolved
//           </p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#16a34a", fontSize: "26px" }}>
//             {resolvedCount}
//           </h3>
//         </div>
//       </div>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//           gap: "20px",
//         }}
//       >
//         <div
//           style={{
//             background: "#ffffff",
//             border: "1px solid #e5e7eb",
//             borderRadius: "18px",
//             padding: "24px",
//             boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
//             minWidth: 0,
//           }}
//         >
//           <h4 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>
//             Send Support Message
//           </h4>
//           <p style={{ margin: "6px 0 18px 0", color: "#64748b", fontSize: "14px" }}>
//             Describe your issue clearly so admin can help you faster.
//           </p>

//           <div style={{ display: "grid", gap: "16px" }}>
//             <div>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "8px",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   color: "#334155",
//                 }}
//               >
//                 Subject
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter subject"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "12px 14px",
//                   borderRadius: "12px",
//                   border: "1px solid #cbd5e1",
//                   outline: "none",
//                   fontSize: "14px",
//                   minWidth: 0,
//                 }}
//               />
//             </div>

//             <div>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "8px",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   color: "#334155",
//                 }}
//               >
//                 Message
//               </label>
//               <textarea
//                 rows="7"
//                 placeholder="Write your issue or question here"
//                 value={messageText}
//                 onChange={(e) => setMessageText(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "12px 14px",
//                   borderRadius: "12px",
//                   border: "1px solid #cbd5e1",
//                   outline: "none",
//                   fontSize: "14px",
//                   resize: "none",
//                   minWidth: 0,
//                 }}
//               />
//             </div>

//             <button
//               onClick={handleSendMessage}
//               disabled={sending}
//               style={{
//                 padding: "12px 18px",
//                 border: "none",
//                 borderRadius: "12px",
//                 background: "#2563eb",
//                 color: "#fff",
//                 cursor: "pointer",
//                 fontWeight: "600",
//                 boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
//                 width: "100%",
//               }}
//             >
//               {sending ? "Sending..." : "Send Message"}
//             </button>
//           </div>
//         </div>

//         <div
//           style={{
//             background: "#ffffff",
//             border: "1px solid #e5e7eb",
//             borderRadius: "18px",
//             padding: "24px",
//             boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
//             minWidth: 0,
//           }}
//         >
//           <h4 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>
//             Previous Messages
//           </h4>
//           <p style={{ margin: "6px 0 18px 0", color: "#64748b", fontSize: "14px" }}>
//             Track the status of your previous support requests.
//           </p>

//           <div style={{ display: "grid", gap: "14px", maxHeight: "520px", overflowY: "auto" }}>
//             {messages.length > 0 ? (
//               messages.map((item) => {
//                 const badge = statusStyle(item.status);

//                 return (
//                   <div
//                     key={item.id}
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "16px",
//                       padding: "16px",
//                       background: "#f8fafc",
//                       minWidth: 0,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "flex-start",
//                         gap: "10px",
//                         marginBottom: "8px",
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <p
//                         style={{
//                           margin: 0,
//                           fontWeight: "700",
//                           color: "#0f172a",
//                           fontSize: "16px",
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         {item.subject}
//                       </p>

//                       <span
//                         style={{
//                           ...badge,
//                           padding: "6px 12px",
//                           borderRadius: "999px",
//                           fontSize: "12px",
//                           fontWeight: "700",
//                           textTransform: "capitalize",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {item.status}
//                       </span>
//                     </div>

//                     <p
//                       style={{
//                         margin: "0 0 10px 0",
//                         fontSize: "14px",
//                         color: "#475569",
//                         lineHeight: "1.6",
//                         wordBreak: "break-word",
//                       }}
//                     >
//                       {item.message}
//                     </p>

//                     <small
//                       style={{
//                         color: "#64748b",
//                         fontSize: "13px",
//                         wordBreak: "break-word",
//                         display: "block",
//                       }}
//                     >
//                       {new Date(item.created_at).toLocaleString()}
//                     </small>
//                   </div>
//                 );
//               })
//             ) : (
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   border: "1px dashed #cbd5e1",
//                   borderRadius: "14px",
//                   padding: "24px",
//                   textAlign: "center",
//                   color: "#64748b",
//                 }}
//               >
//                 No support messages found.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Support;

import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import {
  pageHeroStyle,
  pageTitleStyle,
  pageSubtitleStyle,
  loggedInPillStyle,
  statCardStyle,
  contentCardStyle,
  emptyStateStyle,
  sectionTitleStyle,
  sectionSubtitleStyle,
  statLabelStyle,
  infoLabelStyle,
  primaryButtonStyle,
} from "@/helpers/panelStyles";

const Support = () => {
  const [driver, setDriver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSupportMessages();
  }, []);

  const fetchSupportMessages = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setMessages([]);
        setLoading(false);
        return;
      }

      const res = await fetch(API_URL("/api/support-messages/"));
      const data = await res.json();

      const driverMessages = (Array.isArray(data) ? data : []).filter(
        (item) => Number(item.driver) === Number(loggedInDriver.id)
      );

      setMessages(driverMessages);
    } catch (error) {
      console.error("Support fetch error:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!driver) {
      alert("Driver not found.");
      return;
    }

    if (!subject.trim() || !messageText.trim()) {
      alert("Please enter subject and message.");
      return;
    }

    try {
      setSending(true);

      const payload = {
        driver: driver.id,
        subject: subject.trim(),
        message: messageText.trim(),
        status: "open",
      };

      const res = await fetch(API_URL("/api/support-messages/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to send support message");
      }

      setSubject("");
      setMessageText("");
      alert("Support message sent successfully.");
      fetchSupportMessages();
    } catch (error) {
      console.error("Support send error:", error);
      alert("Failed to send support message.");
    } finally {
      setSending(false);
    }
  };

  const statusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "resolved") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  };

  const openCount = messages.filter(
    (item) => String(item.status).toLowerCase() === "open"
  ).length;

  const resolvedCount = messages.filter(
    (item) => String(item.status).toLowerCase() === "resolved"
  ).length;

  const repliedCount = messages.filter(
    (item) => String(item.admin_reply || "").trim() !== ""
  ).length;

  return (
    <div>
      <div style={pageHeroStyle}>
        <h2 style={pageTitleStyle}>Support</h2>
        <p style={pageSubtitleStyle}>
          Contact admin for help, report issues, or ask questions related to your
          account and assigned car.
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Total Messages</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "26px" }}>
            {messages.length}
          </h3>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Open Requests</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#d97706", fontSize: "26px" }}>
            {openCount}
          </h3>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Resolved</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#16a34a", fontSize: "26px" }}>
            {resolvedCount}
          </h3>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Replies Received</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#2563eb", fontSize: "26px" }}>
            {repliedCount}
          </h3>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={contentCardStyle}>
          <h4 style={sectionTitleStyle}>Send Support / Report Issue</h4>
          <p style={sectionSubtitleStyle}>
            Describe your issue, repair concern, or question clearly so admin can help you faster.
          </p>

          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Subject
              </label>
              <input
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Message
              </label>
              <textarea
                rows="7"
                placeholder="Write your issue, repair concern, or question here"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "14px",
                  resize: "none",
                }}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={sending}
              style={{
                ...primaryButtonStyle,
                width: "100%",
              }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>

        <div style={contentCardStyle}>
          <h4 style={sectionTitleStyle}>Previous Messages</h4>
          <p style={sectionSubtitleStyle}>
            Track your support requests and view admin replies.
          </p>

          <div style={{ display: "grid", gap: "14px", maxHeight: "600px", overflowY: "auto" }}>
            {loading ? (
              <div style={emptyStateStyle}>Loading support messages...</div>
            ) : messages.length > 0 ? (
              messages.map((item) => {
                const badge = statusStyle(item.status);

                return (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "16px",
                      padding: "16px",
                      background: "#f8fafc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "700",
                          color: "#0f172a",
                          fontSize: "16px",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.subject}
                      </p>

                      <span
                        style={{
                          ...badge,
                          padding: "6px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <p style={{ ...infoLabelStyle, marginBottom: "6px" }}>Your Message</p>
                      <div
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          padding: "12px",
                          background: "#ffffff",
                          color: "#475569",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.message}
                      </div>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <p style={{ ...infoLabelStyle, marginBottom: "6px" }}>Admin Reply</p>
                      {item.admin_reply ? (
                        <div
                          style={{
                            border: "1px solid #d1fae5",
                            borderRadius: "12px",
                            padding: "12px",
                            background: "#ecfdf5",
                            color: "#166534",
                            fontSize: "14px",
                            lineHeight: "1.6",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.admin_reply}
                        </div>
                      ) : (
                        <div
                          style={{
                            border: "1px dashed #cbd5e1",
                            borderRadius: "12px",
                            padding: "12px",
                            background: "#ffffff",
                            color: "#64748b",
                            fontSize: "14px",
                          }}
                        >
                          No reply yet.
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginTop: "8px",
                      }}
                    >
                      <small
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          wordBreak: "break-word",
                        }}
                      >
                        Sent: {new Date(item.created_at).toLocaleString()}
                      </small>

                      {item.replied_at && (
                        <small
                          style={{
                            color: "#2563eb",
                            fontSize: "13px",
                            wordBreak: "break-word",
                          }}
                        >
                          Replied: {new Date(item.replied_at).toLocaleString()}
                        </small>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={emptyStateStyle}>No support messages found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;