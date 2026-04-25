import React, { useEffect, useState } from "react";

const RepairStatus = () => {
  const [repairs, setRepairs] = useState([]);

  const driverId = 6;

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const assignmentsRes = await fetch("http://localhost:8000/api/assignments/");
      const assignments = await assignmentsRes.json();

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(driverId) &&
          String(item.status).toLowerCase() === "active"
      );

      if (!activeAssignment) return;

      const repairsRes = await fetch("http://localhost:8000/api/repairs/");
      const allRepairs = await repairsRes.json();

      const carRepairs = allRepairs.filter(
        (repair) => Number(repair.car) === Number(activeAssignment.car)
      );

      setRepairs(carRepairs);
    } catch (error) {
      console.error("Repair status error:", error);
    }
  };

  return (
    <div>
      <h2>Repair Status</h2>
      <p>Track repair requests and maintenance issues for your assigned car.</p>

      <div style={{ marginTop: "20px" }}>
        {repairs.length > 0 ? (
          repairs.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "18px",
                marginBottom: "16px",
                background: "#fff",
              }}
            >
              <h4>{item.issue}</h4>
              <p><strong>Priority:</strong> {item.priority}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Reported Date:</strong> {item.reported_date}</p>
              <p><strong>Estimated Cost:</strong> Rs. {item.estimated_cost}</p>
              <p><strong>Notes:</strong> {item.notes || "-"}</p>
            </div>
          ))
        ) : (
          <p>No repair records found for your assigned car.</p>
        )}
      </div>
    </div>
  );
};

export default RepairStatus;