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
  innerInfoCardStyle,
  sectionTitleStyle,
  sectionSubtitleStyle,
  statLabelStyle,
  infoLabelStyle,
  emptyStateStyle,
} from "@/helpers/panelStyles";

const Dashboard = () => {
  const [driver, setDriver] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [car, setCar] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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

      const paymentsRes = await fetch(API_URL("/api/payments/"));
      const allPayments = await paymentsRes.json();

      const relatedPayments = allPayments.filter(
        (payment) => Number(payment.assignment) === Number(activeAssignment.id)
      );

      setPayments(relatedPayments);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const paidCount = payments.filter(
    (item) => String(item.status).toLowerCase() === "paid"
  ).length;

  const getStatusBadge = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (value === "unpaid") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#e0e7ff",
      color: "#3730a3",
    };
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <div style={pageHeroStyle}>
        <h2 style={pageTitleStyle}>Driver Dashboard</h2>

        <p style={pageSubtitleStyle}>
          Welcome to DriveLedger Driver Panel. Track your assigned vehicle,
          payment activity, and current assignment status in one place.
        </p>

        {driver && (
          <div style={loggedInPillStyle}>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Assigned Car</p>
          <h3
            style={{
              margin: "10px 0 0 0",
              color: "#0f172a",
              fontSize: "24px",
              wordBreak: "break-word",
            }}
          >
            {car ? `${car.make} ${car.model}` : "No Car"}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
            Current assigned vehicle
          </p>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Assignment Status</p>
          <h3
            style={{
              margin: "10px 0 0 0",
              color: "#0f172a",
              fontSize: "24px",
              textTransform: "capitalize",
              wordBreak: "break-word",
            }}
          >
            {assignment ? assignment.status : "No Assignment"}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
            Live assignment condition
          </p>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Total Payments</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "24px" }}>
            {payments.length}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
            All payment records
          </p>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Paid Records</p>
          <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "24px" }}>
            {paidCount}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
            Completed payments only
          </p>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h4 style={sectionTitleStyle}>Recent Payments</h4>
              <p style={sectionSubtitleStyle}>
                Latest payment activity for your account
              </p>
            </div>

            <div
              style={{
                ...innerInfoCardStyle,
                textAlign: "right",
                maxWidth: "100%",
              }}
            >
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Total Amount</p>
              <strong style={{ color: "#0f172a", fontSize: "16px" }}>Rs. {totalAmount}</strong>
            </div>
          </div>

          {payments.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
                      Amount
                    </th>
                    <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
                      Date
                    </th>
                    <th style={{ padding: "14px", textAlign: "left", color: "#475569", fontSize: "14px" }}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "14px", color: "#0f172a", fontWeight: "600" }}>
                        Rs. {payment.amount}
                      </td>
                      <td style={{ padding: "14px", color: "#475569" }}>
                        {payment.payment_date}
                      </td>
                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            ...getStatusBadge(payment.status),
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "700",
                            textTransform: "capitalize",
                            display: "inline-block",
                          }}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={emptyStateStyle}>No payments found</div>
          )}
        </div>

        <div style={contentCardStyle}>
          <h4 style={sectionTitleStyle}>Quick Summary</h4>
          <p style={sectionSubtitleStyle}>A quick look at your current panel data</p>

          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            <div style={innerInfoCardStyle}>
              <p style={infoLabelStyle}>Driver</p>
              <strong style={{ color: "#0f172a", fontSize: "16px", wordBreak: "break-word" }}>
                {driver?.user_name || "-"}
              </strong>
            </div>

            <div style={innerInfoCardStyle}>
              <p style={infoLabelStyle}>Vehicle</p>
              <strong style={{ color: "#0f172a", fontSize: "16px", wordBreak: "break-word" }}>
                {car ? `${car.make} ${car.model}` : "No car assigned"}
              </strong>
            </div>

            <div style={innerInfoCardStyle}>
              <p style={infoLabelStyle}>Assignment</p>
              <strong
                style={{
                  color: "#0f172a",
                  fontSize: "16px",
                  textTransform: "capitalize",
                  wordBreak: "break-word",
                }}
              >
                {assignment?.status || "No active assignment"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;