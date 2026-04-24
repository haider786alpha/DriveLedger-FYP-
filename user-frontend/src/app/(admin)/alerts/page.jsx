const Alerts = () => {
  const alerts = [
    {
      id: 1,
      message: "Your payment for 19 April is still pending.",
      type: "warning",
      date: "20 April 2026",
    },
    {
      id: 2,
      message: "New repair request has been approved.",
      type: "success",
      date: "18 April 2026",
    },
    {
      id: 3,
      message: "Car maintenance due in 3 days.",
      type: "info",
      date: "17 April 2026",
    },
  ];

  const getColor = (type) => {
    if (type === "warning") return "#f59e0b";
    if (type === "success") return "#10b981";
    return "#3b82f6";
  };

  return (
    <div>
      <h2>Alerts</h2>
      <p>Important notifications related to your account.</p>

      <div style={{ marginTop: "20px" }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              borderLeft: `5px solid ${getColor(alert.type)}`,
              background: "#f9f9f9",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <p style={{ margin: 0, fontWeight: "bold" }}>
              {alert.message}
            </p>
            <small style={{ color: "#666" }}>{alert.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;