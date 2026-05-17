import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./Dashboard.css";

const Dashboard = () => {
  const [driver, setDriver] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [car, setCar] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const safeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const fetchJson = async (url, signal) => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  };

  const fetchDashboardData = useCallback(async (signal) => {
    try {
      setLoading(true);
      setDashboardError("");

      const loggedInDriver = await getLoggedInDriver();

      if (signal?.aborted) return;

      setDriver(loggedInDriver);

      if (!loggedInDriver?.id) {
        setAssignment(null);
        setCar(null);
        setPayments([]);
        return;
      }

      const assignmentsData = await fetchJson(API_URL("/api/assignments/"), signal);
      const assignments = safeArray(assignmentsData);

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(loggedInDriver.id) &&
          String(item.status || "").toLowerCase() === "active"
      );

      if (signal?.aborted) return;

      setAssignment(activeAssignment || null);

      if (!activeAssignment?.id) {
        setCar(null);
        setPayments([]);
        return;
      }

      const [carData, paymentsData] = await Promise.all([
        activeAssignment?.car
          ? fetchJson(API_URL(`/api/cars/${activeAssignment.car}/`), signal)
          : Promise.resolve(null),
        fetchJson(API_URL("/api/payments/"), signal),
      ]);

      if (signal?.aborted) return;

      const allPayments = safeArray(paymentsData);

      const relatedPayments = allPayments.filter(
        (payment) => Number(payment.assignment) === Number(activeAssignment.id)
      );

      setCar(carData);
      setPayments(relatedPayments);
    } catch (error) {
      if (error?.name === "AbortError") return;

      console.error("Dashboard error:", error);
      setDashboardError("Dashboard data could not be loaded. Please refresh the page.");
      setCar(null);
      setPayments([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboardData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchDashboardData]);

  const recentPayments = useMemo(() => {
    return [...payments].slice(-6).reverse();
  }, [payments]);

  const totalAmount = useMemo(() => {
    return payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [payments]);

  const paidCount = useMemo(() => {
    return payments.filter(
      (item) => String(item.status || "").toLowerCase() === "paid"
    ).length;
  }, [payments]);

  const unpaidCount = useMemo(() => {
    return payments.filter(
      (item) => String(item.status || "").toLowerCase() === "unpaid"
    ).length;
  }, [payments]);

  const formattedTotalAmount = useMemo(() => {
    return new Intl.NumberFormat("en-PK").format(totalAmount);
  }, [totalAmount]);

  const getStatusBadgeClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid") return "driver-badge driver-badge-success";
    if (value === "unpaid") return "driver-badge driver-badge-danger";
    if (value === "active") return "driver-badge driver-badge-info";
    if (value === "completed") return "driver-badge driver-badge-success";
    if (value === "pending") return "driver-badge driver-badge-warning";

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
              Logged in as: <strong>{driver.user_name || driver.name || "Driver"}</strong>
            </div>
          )}
        </div>

        <div className="driver-hero-glass">
          <span>Current Status</span>
          <strong>{assignment ? "On Assignment" : "No Active Assignment"}</strong>
        </div>
      </div>

      {dashboardError && (
        <div className="driver-alert-card driver-reveal driver-delay-2">
          <div className="driver-alert-icon">
            <IconifyIcon icon="mdi:alert-circle-outline" />
          </div>

          <div>
            <strong>Unable to load dashboard data.</strong>
            <p>{dashboardError}</p>
          </div>
        </div>
      )}

      <div className="driver-kpi-grid driver-reveal driver-delay-2">
        <StatCard
          title="Assigned Car"
          value={car ? `${car.make || ""} ${car.model || ""}`.trim() : "No Car"}
          subtitle="Current assigned vehicle"
          icon="mdi:car-sports"
          tone="blue"
        />

        <StatCard
          title="Assignment Status"
          value={assignment ? assignment.status : "No Assignment"}
          subtitle="Live assignment condition"
          icon="mdi:file-document-check-outline"
          tone="purple"
          capitalize
        />

        <StatCard
          title="Total Payments"
          value={payments.length}
          subtitle="All payment records"
          icon="mdi:cash-multiple"
          tone="indigo"
        />

        <StatCard
          title="Paid Records"
          value={paidCount}
          subtitle={`${unpaidCount} unpaid record(s)`}
          icon="mdi:credit-card-check-outline"
          tone="slate"
        />
      </div>

      {!assignment && (
        <div className="driver-alert-card driver-reveal driver-delay-2">
          <div className="driver-alert-icon">
            <IconifyIcon icon="mdi:information-outline" />
          </div>

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
              <strong>Rs. {formattedTotalAmount}</strong>
            </div>
          </div>

          {recentPayments.length > 0 ? (
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
                    {recentPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <strong>
                            Rs.{" "}
                            {new Intl.NumberFormat("en-PK").format(
                              Number(payment.amount || 0)
                            )}
                          </strong>
                        </td>

                        <td>{payment.payment_date || "-"}</td>

                        <td>
                          <span className={getStatusBadgeClass(payment.status)}>
                            {payment.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="driver-mobile-payment-list">
                {recentPayments.map((payment) => (
                  <div className="driver-mobile-payment-card" key={payment.id}>
                    <div>
                      <span>Amount</span>
                      <strong>
                        Rs.{" "}
                        {new Intl.NumberFormat("en-PK").format(
                          Number(payment.amount || 0)
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Date</span>
                      <strong>{payment.payment_date || "-"}</strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong>
                        <span className={getStatusBadgeClass(payment.status)}>
                          {payment.status || "Unknown"}
                        </span>
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="driver-empty-state">
              <div>
                <IconifyIcon icon="mdi:credit-card-outline" />
              </div>

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
            <SummaryRow label="Driver" value={driver?.user_name || driver?.name || "-"} />

            <SummaryRow
              label="Vehicle"
              value={car ? `${car.make || ""} ${car.model || ""}`.trim() : "No car assigned"}
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
    <div className="driver-stat-icon">
      <IconifyIcon icon={icon} />
    </div>

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