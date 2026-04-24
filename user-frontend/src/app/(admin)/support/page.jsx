const Support = () => {
  const previousMessages = [
    {
      id: 1,
      subject: "Payment clarification",
      message: "I want confirmation about the pending amount for 19 April.",
      status: "Resolved",
      date: "18 April 2026",
    },
    {
      id: 2,
      subject: "Car issue report",
      message: "The assigned car is making unusual engine noise.",
      status: "Open",
      date: "20 April 2026",
    },
  ];

  return (
    <div>
      <h2>Support</h2>
      <p>Contact admin for help, queries, or issue reporting.</p>

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
              Send Message
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
            {previousMessages.map((item) => (
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
                <small style={{ display: "block", marginBottom: "6px", color: "#666" }}>
                  {item.date}
                </small>
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "20px",
                    background: item.status === "Resolved" ? "#10b981" : "#f59e0b",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;