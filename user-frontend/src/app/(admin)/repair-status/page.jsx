import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./RepairStatus.css";

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
      setRepairs([]);
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

  const inProgressRepairs = repairs.filter((item) => {
    const value = String(item.status || "").toLowerCase();
    return value === "in_progress" || value === "in progress";
  }).length;

  const totalEstimatedCost = repairs.reduce(
    (sum, item) => sum + Number(item.estimated_cost || 0),
    0
  );

  const totalActualCost = repairs.reduce(
    (sum, item) => sum + Number(item.actual_cost || 0),
    0
  );

  const formatAmount = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  };

  const formatStatusText = (status) => {
    return String(status || "unknown").replace("_", " ");
  };

  const getStatusMeta = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed") {
      return {
        className: "repair-status-badge-completed",
        icon: "mdi:check-decagram-outline",
        label: "Completed",
      };
    }

    if (value === "pending") {
      return {
        className: "repair-status-badge-pending",
        icon: "mdi:clock-outline",
        label: "Pending",
      };
    }

    if (value === "in_progress" || value === "in progress") {
      return {
        className: "repair-status-badge-progress",
        icon: "mdi:progress-wrench",
        label: "In Progress",
      };
    }

    return {
      className: "repair-status-badge-muted",
      icon: "mdi:information-outline",
      label: formatStatusText(status),
    };
  };

  const getPriorityMeta = (priority) => {
    const value = String(priority || "").toLowerCase();

    if (value === "high") {
      return {
        className: "repair-status-priority-high",
        icon: "mdi:alert-circle-outline",
        label: "High Priority",
      };
    }

    if (value === "medium") {
      return {
        className: "repair-status-priority-medium",
        icon: "mdi:alert-outline",
        label: "Medium Priority",
      };
    }

    return {
      className: "repair-status-priority-low",
      icon: "mdi:arrow-down-circle-outline",
      label: "Low Priority",
    };
  };

  const InfoBox = ({ label, value, full = false, pre = false, children }) => {
    return (
      <div
        className={`repair-status-info-box ${
          full ? "repair-status-info-box-full" : ""
        }`}
      >
        <p className="repair-status-label">{label}</p>

        {children ? (
          children
        ) : (
          <strong
            className={`repair-status-value ${
              pre ? "repair-status-value-pre" : ""
            }`}
          >
            {value || "-"}
          </strong>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="repair-status-loading-card repair-status-reveal">
        <h4>Loading repair status...</h4>
        <p>Please wait while we fetch repair records for your assigned vehicle.</p>
      </div>
    );
  }

  return (
    <div className="repair-status-page">
      <div className="repair-status-hero repair-status-reveal">
        <div className="repair-status-hero-inner">
          <div>
            <div className="repair-status-kicker">
              <span className="repair-status-dot" />
              Driver Panel Overview
            </div>

            <h2 className="repair-status-hero-title">Repair Status</h2>

            <p className="repair-status-hero-subtitle">
              Track repair requests, maintenance issues, current progress, costs,
              bills, and priority status for your assigned vehicle.
            </p>
          </div>

          <div className="repair-status-hero-glass">
            <span>Logged in as</span>
            <strong>{driver?.user_name || "Driver"}</strong>
          </div>
        </div>
      </div>

      <div className="repair-status-stats-grid repair-status-reveal repair-status-delay-1">
        <div className="repair-status-stat-card repair-status-stat-blue">
          <div className="repair-status-stat-icon-bg" />
          <div className="repair-status-stat-icon">
            <IconifyIcon icon="mdi:car-wrench" />
          </div>

          <p className="repair-status-stat-label">Total Repair Records</p>
          <strong className="repair-status-stat-value">{totalRepairs}</strong>
          <span className="repair-status-stat-note">All repair requests</span>
        </div>

        <div className="repair-status-stat-card repair-status-stat-red">
          <div className="repair-status-stat-icon-bg" />
          <div className="repair-status-stat-icon">
            <IconifyIcon icon="mdi:alert-circle-outline" />
          </div>

          <p className="repair-status-stat-label">High Priority</p>
          <strong className="repair-status-stat-value">{highPriority}</strong>
          <span className="repair-status-stat-note">Urgent repair issues</span>
        </div>

        <div className="repair-status-stat-card repair-status-stat-purple">
          <div className="repair-status-stat-icon-bg" />
          <div className="repair-status-stat-icon">
            <IconifyIcon icon="mdi:check-decagram-outline" />
          </div>

          <p className="repair-status-stat-label">Completed Repairs</p>
          <strong className="repair-status-stat-value">{completedRepairs}</strong>
          <span className="repair-status-stat-note">
            {inProgressRepairs} in progress
          </span>
        </div>

        <div className="repair-status-stat-card repair-status-stat-orange">
          <div className="repair-status-stat-icon-bg" />
          <div className="repair-status-stat-icon">
            <IconifyIcon icon="mdi:cash-multiple" />
          </div>

          <p className="repair-status-stat-label">Total Actual Cost</p>
          <strong className="repair-status-stat-value">
            {formatAmount(totalActualCost)}
          </strong>
          <span className="repair-status-stat-note">
            Estimated: {formatAmount(totalEstimatedCost)}
          </span>
        </div>
      </div>

      <div className="repair-status-list repair-status-reveal repair-status-delay-2">
        {repairs.length > 0 ? (
          repairs.map((item) => {
            const statusMeta = getStatusMeta(item.status);
            const priorityMeta = getPriorityMeta(item.priority);

            return (
              <div className="repair-status-card" key={item.id}>
                <div className="repair-status-card-head">
                  <div className="repair-status-title-wrap">
                    <div className="repair-status-card-icon">
                      <IconifyIcon icon="mdi:tools" />
                    </div>

                    <div>
                      <h4 className="repair-status-card-title">
                        {item.issue || "Repair Request"}
                      </h4>

                      <p className="repair-status-card-subtitle">
                        Repair request for assigned vehicle
                      </p>
                    </div>
                  </div>

                  <div className="repair-status-badge-wrap">
                    <span
                      className={`repair-status-badge ${priorityMeta.className}`}
                    >
                      <IconifyIcon icon={priorityMeta.icon} />
                      {priorityMeta.label}
                    </span>

                    <span className={`repair-status-badge ${statusMeta.className}`}>
                      <IconifyIcon icon={statusMeta.icon} />
                      {statusMeta.label}
                    </span>
                  </div>
                </div>

                <div className="repair-status-info-grid">
                  <InfoBox label="Reported Date" value={item.reported_date} />

                  <InfoBox label="Estimated Cost">
                    <strong className="repair-status-value repair-status-cost">
                      {formatAmount(item.estimated_cost)}
                    </strong>
                  </InfoBox>

                  <InfoBox label="Actual Cost">
                    <strong className="repair-status-value repair-status-cost">
                      {formatAmount(item.actual_cost)}
                    </strong>
                  </InfoBox>

                  <InfoBox label="Repair ID" value={`#${item.id}`} />

                  <InfoBox label="Bill / Receipt">
                    {item.bill_receipt_url ? (
                      <a
                        href={item.bill_receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        className="repair-status-attachment-btn"
                      >
                        <IconifyIcon icon="mdi:file-eye-outline" />
                        View Bill / Receipt
                      </a>
                    ) : (
                      <strong className="repair-status-value">
                        Not uploaded
                      </strong>
                    )}
                  </InfoBox>

                  <InfoBox label="Notes" value={item.notes || "-"} full pre />
                </div>
              </div>
            );
          })
        ) : (
          <div className="repair-status-empty-card">
            <div className="repair-status-empty-icon">
              <IconifyIcon icon="mdi:car-wrench" />
            </div>

            <h4>No repair records found</h4>

            <p>
              No repair records are currently linked to your assigned vehicle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairStatus;