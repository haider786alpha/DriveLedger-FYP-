import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";

const RepairStatus = () => {
  const [driver, setDriver] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
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

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(loggedInDriver.id) &&
          String(item.status).toLowerCase() === "active"
      );

      if (!activeAssignment) {
        setRepairs([]);
        setLoading(false);
        return;
      }

      const repairsRes = await fetch(API_URL("/api/repairs/"));
      const allRepairs = await repairsRes.json();

      const carRepairs = allRepairs.filter(
        (repair) => Number(repair.car) === Number(activeAssignment.car)
      );

      setRepairs(carRepairs);
    } catch (error) {
      console.error("Repair status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRepairs = repairs.length;

  const highPriority = repairs.filter(
    (item) => String(item.priority).toLowerCase() === "high"
  ).length;

  const completedRepairs = repairs.filter(
    (item) => String(item.status).toLowerCase() === "completed"
  ).length;

  const totalEstimatedCost = repairs.reduce(
    (sum, item) => sum + Number(item.estimated_cost || 0),
    0
  );

  const totalActualCost = repairs.reduce(
    (sum, item) => sum + Number(item.actual_cost || 0),
    0
  );

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed") {
      return { background: "#dcfce7", color: "#166534" };
    }

    if (value === "pending") {
      return { background: "#fef3c7", color: "#92400e" };
    }

    if (value === "in_progress" || value === "in progress") {
      return { background: "#dbeafe", color: "#1d4ed8" };
    }

    return { background: "#e5e7eb", color: "#374151" };
  };

  const getPriorityStyle = (priority) => {
    const value = String(priority || "").toLowerCase();

    if (value === "high") {
      return { background: "#fee2e2", color: "#991b1b" };
    }

    if (value === "medium") {
      return { background: "#fef3c7", color: "#92400e" };
    }

    return { background: "#dcfce7", color: "#166534" };
  };

  const infoCardStyle = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "16px",
    minWidth: 0,
  };

  if (loading) {
    return <div>Loading repair status...</div>;
  }

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #f5f3ff 0%, #f8fafc 100%)",
          border: "1px solid #ddd6fe",
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
          Repair Status
        </h2>

        <p
          style={{
            margin: "10px 0 0 0",
            color: "#475569",
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        >
          Track repair requests, maintenance issues, current progress, costs, and bills for your assigned vehicle.
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
                background: "#8b5cf6",
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
            Total Repair Records
          </p>
          <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "26px" }}>
            {totalRepairs}
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
            High Priority
          </p>
          <h3 style={{ margin: "10px 0 0 0", color: "#dc2626", fontSize: "26px" }}>
            {highPriority}
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
            Completed Repairs
          </p>
          <h3 style={{ margin: "10px 0 0 0", color: "#16a34a", fontSize: "26px" }}>
            {completedRepairs}
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
            Total Actual Cost
          </p>
          <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "26px" }}>
            Rs. {totalActualCost}
          </h3>
        </div>
      </div>

      <div style={{ display: "grid", gap: "18px" }}>
        {repairs.length > 0 ? (
          repairs.map((item) => (
            <div
              key={item.id}
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
                  alignItems: "flex-start",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginBottom: "18px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      color: "#0f172a",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.issue}
                  </h4>
                  <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                    Repair request for assigned vehicle
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      ...getPriorityStyle(item.priority),
                      padding: "7px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.priority} Priority
                  </span>

                  <span
                    style={{
                      ...getStatusStyle(item.status),
                      padding: "7px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {String(item.status || "").replace("_", " ")}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                }}
              >
                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Reported Date
                  </p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {item.reported_date || "-"}
                  </strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Estimated Cost
                  </p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    Rs. {item.estimated_cost || 0}
                  </strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Actual Cost
                  </p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    Rs. {item.actual_cost || 0}
                  </strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Repair ID
                  </p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a" }}>
                    #{item.id}
                  </strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Bill / Receipt
                  </p>

                  {item.bill_receipt_url ? (
                    <a
                      href={item.bill_receipt_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        padding: "9px 14px",
                        borderRadius: "10px",
                        background: "#2563eb",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      View Bill / Receipt
                    </a>
                  ) : (
                    <strong
                      style={{
                        display: "block",
                        marginTop: "6px",
                        color: "#92400e",
                        fontSize: "15px",
                      }}
                    >
                      Not uploaded
                    </strong>
                  )}
                </div>

                <div
                  style={{
                    ...infoCardStyle,
                    gridColumn: "1 / -1",
                  }}
                >
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Notes
                  </p>
                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#0f172a",
                      fontWeight: "600",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.notes || "-"}
                  </strong>
                </div>
              </div>
            </div>
          ))
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
            No repair records found for your assigned car.
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairStatus;