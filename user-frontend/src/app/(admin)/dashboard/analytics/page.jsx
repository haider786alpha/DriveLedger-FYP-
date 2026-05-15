import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import "./Dashboard.css";

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

  const unpaidCount = payments.filter(
    (item) => String(item.status).toLowerCase() === "unpaid"
  ).length;

  const getStatusBadgeClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid") return "driver-badge driver-badge-success";
    if (value === "unpaid") return "driver-badge driver-badge-danger";
    if (value === "active") return "driver-badge driver-badge-info";

    return "driver-badge driver-badge-muted";
  };

  if (loading) {
    return (
      <div className="driver-dashboard">
        <div className="driver-loading-card">
          <div className="driver-loader"></div>
          <h5>Loading dashboard...</h5>
          <p>Please wait while we prepare your driver panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      <div className="driver-hero driver-reveal driver-delay-1">
        <div className="driver-hero-content">
          <div className="driver-hero-pill">
            <span className="driver-status-dot"></span>
            Driver Panel Overview
          </div>

          <h2>Driver Dashboard</h2>

          <p>
            Welcome to DriveLedger Driver Panel. Track your assigned vehicle,
            payment activity, and current assignment status in one clean place.
          </p>

          {driver && (
            <div className="driver-login-pill">
              <span className="driver-online-dot"></span>
              Logged in as: <strong>{driver.user_name}</strong>
            </div>
          )}
        </div>

        <div className="driver-hero-glass">
          <span>Current Status</span>
          <strong>{assignment ? "On Assignment" : "No Active Assignment"}</strong>
        </div>
      </div>

      <div className="driver-kpi-grid driver-reveal driver-delay-2">
        <StatCard
          title="Assigned Car"
          value={car ? `${car.make} ${car.model}` : "No Car"}
          subtitle="Current assigned vehicle"
          icon="🚗"
          tone="blue"
        />

        <StatCard
          title="Assignment Status"
          value={assignment ? assignment.status : "No Assignment"}
          subtitle="Live assignment condition"
          icon="🔗"
          tone="teal"
          capitalize
        />

        <StatCard
          title="Total Payments"
          value={payments.length}
          subtitle="All payment records"
          icon="💰"
          tone="green"
        />

        <StatCard
          title="Paid Records"
          value={paidCount}
          subtitle={`${unpaidCount} unpaid record(s)`}
          icon="✅"
          tone="purple"
        />
      </div>

      {!assignment && (
        <div className="driver-alert-card driver-reveal driver-delay-2">
          <div className="driver-alert-icon">!</div>
          <div>
            <strong>No active assignment found.</strong>
            <p>
              Your dashboard will show vehicle and payment information after the
              admin assigns you to a car.
            </p>
          </div>
        </div>
      )}

      <div className="driver-main-grid">
        <div className="driver-card driver-reveal driver-delay-3">
          <div className="driver-card-head">
            <div>
              <h4>Recent Payments</h4>
              <p>Latest payment activity linked to your active assignment.</p>
            </div>

            <div className="driver-total-chip">
              <span>Total Amount</span>
              <strong>Rs. {totalAmount}</strong>
            </div>
          </div>

          {payments.length > 0 ? (
            <>
              <div className="driver-payment-table-wrap">
                <table className="driver-payment-table">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.slice(-6).reverse().map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <strong>Rs. {payment.amount}</strong>
                        </td>
                        <td>{payment.payment_date || "-"}</td>
                        <td>
                          <span className={getStatusBadgeClass(payment.status)}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="driver-mobile-payment-list">
                {payments.slice(-6).reverse().map((payment) => (
                  <div className="driver-mobile-payment-card" key={payment.id}>
                    <div>
                      <span>Amount</span>
                      <strong>Rs. {payment.amount}</strong>
                    </div>

                    <div>
                      <span>Date</span>
                      <strong>{payment.payment_date || "-"}</strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong>
                        <span className={getStatusBadgeClass(payment.status)}>
                          {payment.status}
                        </span>
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="driver-empty-state">
              <div>💳</div>
              <h5>No payments found</h5>
              <p>Your payment records will appear here after admin adds them.</p>
            </div>
          )}
        </div>

        <div className="driver-card driver-reveal driver-delay-4">
          <div className="driver-card-head">
            <div>
              <h4>Quick Summary</h4>
              <p>A quick look at your current driver panel data.</p>
            </div>
          </div>

          <div className="driver-summary-list">
            <SummaryRow label="Driver" value={driver?.user_name || "-"} />
            <SummaryRow
              label="Vehicle"
              value={car ? `${car.make} ${car.model}` : "No car assigned"}
            />
            <SummaryRow
              label="Registration"
              value={car?.registration_number || "-"}
            />
            <SummaryRow
              label="Assignment"
              value={assignment?.status || "No active assignment"}
              badge={assignment?.status}
            />
            <SummaryRow
              label="Start Date"
              value={assignment?.start_date || "-"}
            />
            <SummaryRow
              label="End Date"
              value={assignment?.end_date || "Not ended"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, tone, capitalize }) => (
  <div className={`driver-stat-card driver-stat-${tone}`}>
    <div className="driver-stat-icon">{icon}</div>

    <p>{title}</p>

    <h3 className={capitalize ? "text-capitalize" : ""}>{value}</h3>

    <span>{subtitle}</span>
  </div>
);

const SummaryRow = ({ label, value, badge }) => (
  <div className="driver-summary-row">
    <span>{label}</span>

    {badge ? (
      <strong>
        <span className="driver-badge driver-badge-info">{value}</span>
      </strong>
    ) : (
      <strong>{value}</strong>
    )}
  </div>
);

export default Dashboard;