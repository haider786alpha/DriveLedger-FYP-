import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";

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

      const res = await fetch("http://localhost:8000/api/support-messages/");
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

      const res = await fetch("http://localhost:8000/api/support-messages/", {
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

  const statusColor = (status) => {
    return status === "resolved" ? "#10b981" : "#f59e0b";
  };

  if (loading) {
    return <div>Loading support page...</div>;
  }

  return (
    <div>
      <h2>Support</h2>
      <p>Contact admin for help, queries, or issue reporting.</p>

      {driver && (
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          Logged in as: {driver.user_name}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h4>Send Support Message</h4>

          <div style={{ marginTop: "15px" }}>
            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <label>Message</label>
            <textarea
              rows="6"
              placeholder="Write your issue or question here"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "none",
              }}
            />

            <button
              onClick={handleSendMessage}
              disabled={sending}
              style={{
                marginTop: "15px",
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                background: "#3b82f6",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h4>Previous Messages</h4>

          <div style={{ marginTop: "15px" }}>
            {messages.length > 0 ? (
              messages.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <p style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>
                    {item.subject}
                  </p>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                    {item.message}
                  </p>
                  <small
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      color: "#666",
                    }}
                  >
                    {new Date(item.created_at).toLocaleString()}
                  </small>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      background: statusColor(item.status),
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p>No support messages found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;