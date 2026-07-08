import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./RepairStatus.css";

const RepairStatus = () => {
  const [driver, setDriver] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

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

  const fetchRepairs = useCallback(async (signal) => {
    try {
      setLoading(true);
      setPageError("");

      const loggedInDriver = await getLoggedInDriver();

      if (signal?.aborted) return;

      setDriver(loggedInDriver);

      if (!loggedInDriver?.id) {
        setRepairs([]);
        return;
      }

      const assignmentsData = await fetchJson(API_URL("/api/assignments/"), signal);

      if (signal?.aborted) return;

      const assignments = safeArray(assignmentsData);

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(loggedInDriver.id) &&
          String(item.status || "").toLowerCase() === "active"
      );

      if (!activeAssignment?.car) {
        setRepairs([]);
        return;
      }

      const repairsData = await fetchJson(API_URL("/api/repairs/"), signal);

      if (signal?.aborted) return;

      const allRepairs = safeArray(repairsData);

      const carRepairs = allRepairs.filter(
        (repair) => Number(repair.car) === Number(activeAssignment.car)
      );

      setRepairs(carRepairs);
    } catch (error) {
      if (error?.name === "AbortError") return;

      console.error("Repair status error:", error);
      setRepairs([]);
      setPageError("Repair records could not be loaded. Please refresh the page.");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchRepairs(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchRepairs]);

  const sortedRepairs = useMemo(() => {
    return [...repairs].sort(
      (a, b) => new Date(b.reported_date || 0) - new Date(a.reported_date || 0)
    );
  }, [repairs]);

  const totalRepairs = repairs.length;

  const highPriority = useMemo(() => {
    return repairs.filter(
      (item) => String(item.priority || "").toLowerCase() === "high"
    ).length;
  }, [repairs]);

  const completedRepairs = useMemo(() => {
    return repairs.filter(
      (item) => String(item.status || "").toLowerCase() === "completed"
    ).length;
  }, [repairs]);

  const inProgressRepairs = useMemo(() => {
    return repairs.filter((item) => {
      const value = String(item.status || "").toLowerCase();
      return value === "in_progress" || value === "in progress";
    }).length;
  }, [repairs]);

  const totalEstimatedCost = useMemo(() => {
    return repairs.reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);
  }, [repairs]);

  const totalActualCost = useMemo(() => {
    return repairs.reduce((sum, item) => sum + Number(item.actual_cost || 0), 0);
  }, [repairs]);

  const formatAmount = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
  };

  const formatStatusText = (status) => {
    return String(status || "unknown").replaceAll("_", " ");
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

      {pageError && (
        <div className="repair-status-alert-card repair-status-reveal repair-status-delay-1">
          <div className="repair-status-alert-icon">
            <IconifyIcon icon="mdi:alert-circle-outline" />
          </div>

          <div>
            <strong>Unable to load repair records.</strong>
            <p>{pageError}</p>
          </div>
        </div>
      )}

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

        <div className="repair-status-stat-card repair-status-stat-indigo">
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

        <div className="repair-status-stat-card repair-status-stat-slate">
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
        {sortedRepairs.length > 0 ? (
          sortedRepairs.map((item) => {
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
                      <strong className="repair-status-value">Not uploaded</strong>
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

            <p>No repair records are currently linked to your assigned vehicle.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairStatus;