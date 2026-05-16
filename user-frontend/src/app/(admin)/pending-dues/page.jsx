import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./PendingDues.css";

const PendingDues = () => {
  const [driver, setDriver] = useState(null);
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDues();
  }, []);

  const fetchPendingDues = async () => {
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

      const driverAssignments = assignments.filter(
        (item) => Number(item.driver) === Number(loggedInDriver.id)
      );

      if (driverAssignments.length === 0) {
        setDues([]);
        setLoading(false);
        return;
      }

      const assignmentIds = driverAssignments.map((item) => Number(item.id));

      const paymentsRes = await fetch(API_URL("/api/payments/"));
      const allPayments = await paymentsRes.json();

      const unpaidPayments = allPayments.filter(
        (payment) =>
          assignmentIds.includes(Number(payment.assignment)) &&
          String(payment.status).toLowerCase() === "unpaid"
      );

      setDues(unpaidPayments);
    } catch (error) {
      console.error("Pending dues error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPending = dues.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const latestDue = dues.length
    ? [...dues].sort(
        (a, b) => new Date(b.payment_date || 0) - new Date(a.payment_date || 0)
      )[0]
    : null;

  const highestDue = dues.length
    ? Math.max(...dues.map((item) => Number(item.amount || 0)))
    : 0;

  const formatAmount = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return dateValue;
  };

  if (loading) {
    return (
      <div className="pending-dues-loading-card pending-dues-reveal">
        <h4>Loading pending dues...</h4>
        <p>Please wait while we fetch your unpaid payment records.</p>
      </div>
    );
  }

  return (
    <div className="pending-dues-page">
      <div className="pending-dues-hero pending-dues-reveal">
        <div className="pending-dues-hero-inner">
          <div>
            <div className="pending-dues-kicker">
              <span className="pending-dues-status-dot" />
              Driver Panel Overview
            </div>

            <h2 className="pending-dues-hero-title">Pending Dues</h2>

            <p className="pending-dues-hero-subtitle">
              Review unpaid payment records, track your total pending amount,
              and keep your assignment payments clear and organized.
            </p>
          </div>

          <div className="pending-dues-hero-glass">
            <span>Logged in as</span>
            <strong>{driver?.user_name || "Driver"}</strong>
          </div>
        </div>
      </div>

      <div className="pending-dues-stats-grid pending-dues-reveal pending-dues-delay-1">
        <div className="pending-dues-stat-card pending-dues-stat-red">
          <div className="pending-dues-stat-icon-bg" />
          <div className="pending-dues-stat-icon">
            <IconifyIcon icon="mdi:alert-circle-outline" />
          </div>

          <p className="pending-dues-stat-label">Pending Amount</p>
          <strong className="pending-dues-stat-value pending-dues-stat-danger">
            {formatAmount(totalPending)}
          </strong>
          <span className="pending-dues-stat-note">Total unpaid balance</span>
        </div>

        <div className="pending-dues-stat-card pending-dues-stat-blue">
          <div className="pending-dues-stat-icon-bg" />
          <div className="pending-dues-stat-icon">
            <IconifyIcon icon="mdi:file-document-alert-outline" />
          </div>

          <p className="pending-dues-stat-label">Pending Records</p>
          <strong className="pending-dues-stat-value">{dues.length}</strong>
          <span className="pending-dues-stat-note">Unpaid payment records</span>
        </div>

        <div className="pending-dues-stat-card pending-dues-stat-orange">
          <div className="pending-dues-stat-icon-bg" />
          <div className="pending-dues-stat-icon">
            <IconifyIcon icon="mdi:cash-clock" />
          </div>

          <p className="pending-dues-stat-label">Highest Due</p>
          <strong className="pending-dues-stat-value">
            {formatAmount(highestDue)}
          </strong>
          <span className="pending-dues-stat-note">Largest unpaid amount</span>
        </div>

        <div className="pending-dues-stat-card pending-dues-stat-purple">
          <div className="pending-dues-stat-icon-bg" />
          <div className="pending-dues-stat-icon">
            <IconifyIcon icon="mdi:clock-alert-outline" />
          </div>

          <p className="pending-dues-stat-label">Latest Due</p>
          <strong className="pending-dues-stat-value">
            {latestDue ? formatDate(latestDue.payment_date) : "Clear"}
          </strong>
          <span className="pending-dues-stat-note">
            {dues.length > 0 ? "Needs attention" : "No pending dues"}
          </span>
        </div>
      </div>

      <div className="pending-dues-card pending-dues-reveal pending-dues-delay-2">
        <div className="pending-dues-card-head">
          <div>
            <h4 className="pending-dues-section-title">Unpaid Records</h4>
            <p className="pending-dues-section-subtitle">
              Only unpaid dues are listed here for quick review.
            </p>
          </div>

          <div className="pending-dues-total-chip">
            <span>Pending Records</span>
            <strong>{dues.length}</strong>
          </div>
        </div>

        {dues.length > 0 ? (
          <>
            <div className="pending-dues-table-wrap">
              <table className="pending-dues-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {dues.map((due) => (
                    <tr key={due.id}>
                      <td>
                        <strong>#{due.id}</strong>
                      </td>
                      <td>
                        <strong className="pending-dues-amount">
                          {formatAmount(due.amount)}
                        </strong>
                      </td>
                      <td>{formatDate(due.payment_date)}</td>
                      <td>
                        <span className="pending-dues-badge">
                          {due.status || "unpaid"}
                        </span>
                      </td>
                      <td>{due.remarks || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pending-dues-mobile-list">
              {dues.map((due) => (
                <div className="pending-dues-mobile-card" key={due.id}>
                  <div className="pending-dues-mobile-row">
                    <span>Due ID</span>
                    <strong>#{due.id}</strong>
                  </div>

                  <div className="pending-dues-mobile-row">
                    <span>Amount</span>
                    <strong className="pending-dues-amount">
                      {formatAmount(due.amount)}
                    </strong>
                  </div>

                  <div className="pending-dues-mobile-row">
                    <span>Date</span>
                    <strong>{formatDate(due.payment_date)}</strong>
                  </div>

                  <div className="pending-dues-mobile-row">
                    <span>Status</span>
                    <strong>
                      <span className="pending-dues-badge">
                        {due.status || "unpaid"}
                      </span>
                    </strong>
                  </div>

                  <div className="pending-dues-mobile-row">
                    <span>Remarks</span>
                    <strong>{due.remarks || "-"}</strong>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="pending-dues-empty-card">
            <div className="pending-dues-empty-icon">
              <IconifyIcon icon="mdi:check-decagram-outline" />
            </div>

            <h4>No pending dues found</h4>
            <p>
              Your account currently has no unpaid payment records linked to
              your assignments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingDues;