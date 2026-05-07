// import React, { useEffect, useState } from "react";
// import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
// import { API_URL } from "@/helpers/apiConfig";
// import {
//   pageHeroStyle,
//   pageTitleStyle,
//   pageSubtitleStyle,
//   loggedInPillStyle,
//   statCardStyle,
//   contentCardStyle,
//   emptyStateStyle,
//   sectionTitleStyle,
//   sectionSubtitleStyle,
//   statLabelStyle,
//   infoLabelStyle,
//   primaryButtonStyle,
// } from "@/helpers/panelStyles";

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

//   const repliedCount = messages.filter(
//     (item) => String(item.admin_reply || "").trim() !== ""
//   ).length;

//   return (
//     <div>
//       <div style={pageHeroStyle}>
//         <h2 style={pageTitleStyle}>Support</h2>
//         <p style={pageSubtitleStyle}>
//           Contact admin for help, report issues, or ask questions related to your
//           account and assigned car.
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
//           <p style={statLabelStyle}>Total Messages</p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "26px" }}>
//             {messages.length}
//           </h3>
//         </div>

//         <div style={statCardStyle}>
//           <p style={statLabelStyle}>Open Requests</p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#d97706", fontSize: "26px" }}>
//             {openCount}
//           </h3>
//         </div>

//         <div style={statCardStyle}>
//           <p style={statLabelStyle}>Resolved</p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#16a34a", fontSize: "26px" }}>
//             {resolvedCount}
//           </h3>
//         </div>

//         <div style={statCardStyle}>
//           <p style={statLabelStyle}>Replies Received</p>
//           <h3 style={{ margin: "10px 0 0 0", color: "#2563eb", fontSize: "26px" }}>
//             {repliedCount}
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
//         <div style={contentCardStyle}>
//           <h4 style={sectionTitleStyle}>Send Support / Report Issue</h4>
//           <p style={sectionSubtitleStyle}>
//             Describe your issue, repair concern, or question clearly so admin can help you faster.
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
//                 placeholder="Write your issue, repair concern, or question here"
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
//                 }}
//               />
//             </div>

//             <button
//               onClick={handleSendMessage}
//               disabled={sending}
//               style={{
//                 ...primaryButtonStyle,
//                 width: "100%",
//               }}
//             >
//               {sending ? "Sending..." : "Send Message"}
//             </button>
//           </div>
//         </div>

//         <div style={contentCardStyle}>
//           <h4 style={sectionTitleStyle}>Previous Messages</h4>
//           <p style={sectionSubtitleStyle}>
//             Track your support requests and view admin replies.
//           </p>

//           <div style={{ display: "grid", gap: "14px", maxHeight: "600px", overflowY: "auto" }}>
//             {loading ? (
//               <div style={emptyStateStyle}>Loading support messages...</div>
//             ) : messages.length > 0 ? (
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

//                     <div style={{ marginBottom: "10px" }}>
//                       <p style={{ ...infoLabelStyle, marginBottom: "6px" }}>Your Message</p>
//                       <div
//                         style={{
//                           border: "1px solid #e2e8f0",
//                           borderRadius: "12px",
//                           padding: "12px",
//                           background: "#ffffff",
//                           color: "#475569",
//                           fontSize: "14px",
//                           lineHeight: "1.6",
//                           whiteSpace: "pre-wrap",
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         {item.message}
//                       </div>
//                     </div>

//                     <div style={{ marginBottom: "10px" }}>
//                       <p style={{ ...infoLabelStyle, marginBottom: "6px" }}>Admin Reply</p>
//                       {item.admin_reply ? (
//                         <div
//                           style={{
//                             border: "1px solid #d1fae5",
//                             borderRadius: "12px",
//                             padding: "12px",
//                             background: "#ecfdf5",
//                             color: "#166534",
//                             fontSize: "14px",
//                             lineHeight: "1.6",
//                             whiteSpace: "pre-wrap",
//                             wordBreak: "break-word",
//                           }}
//                         >
//                           {item.admin_reply}
//                         </div>
//                       ) : (
//                         <div
//                           style={{
//                             border: "1px dashed #cbd5e1",
//                             borderRadius: "12px",
//                             padding: "12px",
//                             background: "#ffffff",
//                             color: "#64748b",
//                             fontSize: "14px",
//                           }}
//                         >
//                           No reply yet.
//                         </div>
//                       )}
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: "12px",
//                         flexWrap: "wrap",
//                         marginTop: "8px",
//                       }}
//                     >
//                       <small
//                         style={{
//                           color: "#64748b",
//                           fontSize: "13px",
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         Sent: {new Date(item.created_at).toLocaleString()}
//                       </small>

//                       {item.replied_at && (
//                         <small
//                           style={{
//                             color: "#2563eb",
//                             fontSize: "13px",
//                             wordBreak: "break-word",
//                           }}
//                         >
//                           Replied: {new Date(item.replied_at).toLocaleString()}
//                         </small>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div style={emptyStateStyle}>No support messages found.</div>
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
  const [issueAttachment, setIssueAttachment] = useState(null);
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

      const payload = new FormData();
      payload.append("driver", driver.id);
      payload.append("subject", subject.trim());
      payload.append("message", messageText.trim());
      payload.append("status", "open");

      if (issueAttachment) {
        payload.append("issue_attachment", issueAttachment);
      }

      const res = await fetch(API_URL("/api/support-messages/"), {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        throw new Error("Failed to send support message");
      }

      setSubject("");
      setMessageText("");
      setIssueAttachment(null);

      const fileInput = document.getElementById("issue-attachment-input");
      if (fileInput) {
        fileInput.value = "";
      }

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
                Issue Attachment Optional
              </label>
              <input
                id="issue-attachment-input"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setIssueAttachment(e.target.files?.[0] || null)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "14px",
                  background: "#ffffff",
                }}
              />
              <small style={{ display: "block", marginTop: "6px", color: "#64748b" }}>
                Upload an issue photo, repair image, or PDF if available.
              </small>

              {issueAttachment && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: "13px",
                    fontWeight: "600",
                    wordBreak: "break-word",
                  }}
                >
                  Selected: {issueAttachment.name}
                </div>
              )}
            </div>

            <button
              onClick={handleSendMessage}
              disabled={sending}
              style={{
                ...primaryButtonStyle,
                width: "100%",
                opacity: sending ? 0.7 : 1,
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
                      <p style={{ ...infoLabelStyle, marginBottom: "6px" }}>
                        Attachment
                      </p>

                      {item.issue_attachment_url ? (
                        <a
                          href={item.issue_attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-block",
                            padding: "9px 14px",
                            borderRadius: "10px",
                            background: "#2563eb",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: "700",
                          }}
                        >
                          View Attachment
                        </a>
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
                          No attachment uploaded.
                        </div>
                      )}
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