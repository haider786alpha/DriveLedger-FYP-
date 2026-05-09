import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";

const AssignedCar = () => {
  const [driver, setDriver] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedCar();
  }, []);

  const fetchAssignedCar = async () => {
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

      setAssignment(activeAssignment || null);

      if (!activeAssignment) {
        setLoading(false);
        return;
      }

      const carRes = await fetch(API_URL(`/api/cars/${activeAssignment.car}/`));
      const carData = await carRes.json();
      setCar(carData);
    } catch (error) {
      console.error("Assigned car error:", error);
    } finally {
      setLoading(false);
    }
  };

  const infoCardStyle = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "16px",
    minWidth: 0,
  };

  const getDateStatus = (dateValue, type = "due") => {
    if (!dateValue) {
      return {
        label: "Not Available",
        background: "#e5e7eb",
        color: "#374151",
      };
    }

    const today = new Date();
    const targetDate = new Date(dateValue);

    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const differenceInDays = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays < 0) {
      return {
        label: type === "maintenance" ? "Maintenance Overdue" : "Expired",
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    if (differenceInDays <= 30) {
      return {
        label: type === "maintenance" ? "Maintenance Due Soon" : "Expiring Soon",
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    return {
      label: type === "maintenance" ? "Maintenance OK" : "Valid",
      background: "#dcfce7",
      color: "#166534",
    };
  };

  const maintenanceStatus = getDateStatus(car?.next_maintenance_date, "maintenance");
  const insuranceStatus = getDateStatus(car?.insurance_expiry, "document");
  const registrationStatus = getDateStatus(car?.registration_expiry, "document");

  if (loading) {
    return <div>Loading assigned car...</div>;
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
          Assigned Car
        </h2>

        <p style={{ margin: "10px 0 0 0", color: "#475569", fontSize: "15px", lineHeight: "1.6" }}>
          View complete details of the vehicle currently assigned to your account, including maintenance and document status.
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
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            Logged in as: {driver.user_name}
          </div>
        )}
      </div>

      {car ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: "22px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    color: "#0f172a",
                    wordBreak: "break-word",
                  }}
                >
                  {car.make} {car.model}
                </h3>
                <p style={{ margin: "8px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                  Your current assigned vehicle
                </p>
              </div>

              <span
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "#dcfce7",
                  color: "#166534",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                }}
              >
                {assignment?.status || "active"}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px",
              }}
            >
              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Make</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.make || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Model</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.model || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Year</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a" }}>
                  {car.year || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Mileage</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.mileage || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Current Mileage</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.current_mileage || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Registration Number</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.registration_number || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Condition</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.condition || "-"}
                </strong>
              </div>

              <div style={{ ...infoCardStyle, gridColumn: "1 / -1" }}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Notes</p>
                <strong
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#0f172a",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {car.notes || "-"}
                </strong>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "20px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                minWidth: 0,
              }}
            >
              <h4 style={{ margin: "0 0 18px 0", color: "#0f172a" }}>
                Maintenance Status
              </h4>

              <div style={{ display: "grid", gap: "14px" }}>
                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Last Service Date</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {car.last_service_date || "-"}
                  </strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Next Maintenance Date</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {car.next_maintenance_date || "-"}
                  </strong>

                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background: maintenanceStatus.background,
                      color: maintenanceStatus.color,
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {maintenanceStatus.label}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                minWidth: 0,
              }}
            >
              <h4 style={{ margin: "0 0 18px 0", color: "#0f172a" }}>
                Document Status
              </h4>

              <div style={{ display: "grid", gap: "14px" }}>
                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Insurance Expiry</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {car.insurance_expiry || "-"}
                  </strong>

                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background: insuranceStatus.background,
                      color: insuranceStatus.color,
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {insuranceStatus.label}
                  </span>
                </div>

                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Registration Expiry</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {car.registration_expiry || "-"}
                  </strong>

                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background: registrationStatus.background,
                      color: registrationStatus.color,
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {registrationStatus.label}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                minWidth: 0,
              }}
            >
              <h4 style={{ margin: "0 0 18px 0", color: "#0f172a" }}>Assignment Details</h4>

              <div style={{ display: "grid", gap: "14px" }}>
                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Assignment Status</p>
                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#0f172a",
                      textTransform: "capitalize",
                      wordBreak: "break-word",
                    }}
                  >
                    {assignment?.status || "-"}
                  </strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Assigned Date</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {assignment?.start_date || "-"}
                  </strong>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                minWidth: 0,
              }}
            >
              <h4 style={{ margin: "0 0 18px 0", color: "#0f172a" }}>Quick Overview</h4>

              <div style={{ display: "grid", gap: "12px" }}>
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #dbeafe",
                    borderRadius: "14px",
                    padding: "16px",
                    minWidth: 0,
                  }}
                >
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Driver</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {driver?.user_name || "-"}
                  </strong>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px",
                    minWidth: 0,
                  }}
                >
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Vehicle Type</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {car.make} {car.model}
                  </strong>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px",
                    minWidth: 0,
                  }}
                >
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Registration</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {car.registration_number || "-"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          No active car assigned.
        </div>
      )}
    </div>
  );
};

export default AssignedCar;