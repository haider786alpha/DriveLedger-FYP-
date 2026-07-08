import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import DriverToast from "@/components/DriverToast";
import "./Alerts.css";

const Alerts = () => {
  const [driver, setDriver] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [pageError, setPageError] = useState("");

  const toastTimerRef = useRef(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const safeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3500);
  }, []);

  const fetchAlerts = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setPageError("");

        const loggedInDriver = await getLoggedInDriver();

        if (signal?.aborted) return;

        setDriver(loggedInDriver);

        if (!loggedInDriver?.id) {
          setAlerts([]);
          return;
        }

        const res = await fetch(
          API_URL(`/api/notifications/?driver_id=${loggedInDriver.id}`),
          { signal }
        );

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();

        if (signal?.aborted) return;

        const notifications = safeArray(data);

        const filteredAlerts = notifications.filter(
          (item) =>
            item.recipient_type === "all" ||
            (item.recipient_type === "driver" &&
              Number(item.driver) === Number(loggedInDriver.id))
        );

        setAlerts(filteredAlerts);
      } catch (error) {
        if (error?.name === "AbortError") return;

        console.error("Alerts error:", error);
        setAlerts([]);
        setPageError("Alerts could not be loaded. Please refresh the page.");
        showToast("Failed to load alerts.", "error");
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [showToast]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchAlerts(controller.signal);

    return () => {
      controller.abort();

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [fetchAlerts]);

  const markAsRead = async (notificationId) => {
    if (!driver?.id || !notificationId) return;

    try {
      setMarkingId(notificationId);

      const res = await fetch(API_URL(`/api/notifications/${notificationId}/mark-read/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver: driver.id,
        }),
      });

      if (!res.ok) {
        throw new Error(`Mark read failed with status ${res.status}`);
      }

      setAlerts((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                is_read: true,
                read_at: item.read_at || new Date().toISOString(),
              }
            : item
        )
      );

      window.dispatchEvent(new Event("notifications-updated"));
      showToast("Alert marked as read.", "success");
    } catch (error) {
      console.error("Mark read error:", error);
      showToast("Failed to mark alert as read.", "error");
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    if (!driver?.id) return;

    const unreadAlerts = alerts.filter((item) => !item.is_read);

    if (unreadAlerts.length === 0) {
      showToast("There are no unread alerts to mark.", "info");
      return;
    }

    try {
      setMarkingAll(true);

      const results = await Promise.allSettled(
        unreadAlerts.map((alertItem) =>
          fetch(API_URL(`/api/notifications/${alertItem.id}/mark-read/`), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              driver: driver.id,
            }),
          }).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to mark alert ${alertItem.id}`);
            }

            return alertItem.id;
          })
        )
      );

      const successfulIds = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      if (successfulIds.length === 0) {
        throw new Error("No alerts were marked as read.");
      }

      const now = new Date().toISOString();

      setAlerts((prev) =>
        prev.map((item) =>
          successfulIds.includes(item.id)
            ? {
                ...item,
                is_read: true,
                read_at: item.read_at || now,
              }
            : item
        )
      );

      window.dispatchEvent(new Event("notifications-updated"));

      if (successfulIds.length === unreadAlerts.length) {
        showToast("All alerts marked as read.", "success");
      } else {
        showToast("Some alerts were marked as read. Please retry the remaining ones.", "warning");
      }
    } catch (error) {
      console.error("Mark all read error:", error);
      showToast("Failed to mark all alerts as read.", "error");
    } finally {
      setMarkingAll(false);
    }
  };

  const getAlertMeta = (type) => {
    const value = String(type || "").toLowerCase();

    if (value === "warning") {
      return {
        cardClass: "alerts-card-warning",
        iconClass: "alerts-card-icon-warning",
        badgeClass: "alerts-badge-warning",
        icon: "mdi:alert-outline",
        label: "Warning",
      };
    }

    if (value === "success") {
      return {
        cardClass: "alerts-card-success",
        iconClass: "alerts-card-icon-success",
        badgeClass: "alerts-badge-success",
        icon: "mdi:check-decagram-outline",
        label: "Success",
      };
    }

    return {
      cardClass: "alerts-card-info",
      iconClass: "alerts-card-icon-info",
      badgeClass: "alerts-badge-info",
      icon: "mdi:information-outline",
      label: "Info",
    };
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString();
  };

  const sortedAlerts = useMemo(() => {
    return [...alerts].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  }, [alerts]);

  const infoCount = useMemo(() => {
    return alerts.filter(
      (item) => String(item.notification_type || "").toLowerCase() === "info"
    ).length;
  }, [alerts]);

  const warningCount = useMemo(() => {
    return alerts.filter(
      (item) => String(item.notification_type || "").toLowerCase() === "warning"
    ).length;
  }, [alerts]);

  const successCount = useMemo(() => {
    return alerts.filter(
      (item) => String(item.notification_type || "").toLowerCase() === "success"
    ).length;
  }, [alerts]);

  const unreadCount = useMemo(() => {
    return alerts.filter((item) => !item.is_read).length;
  }, [alerts]);

  if (loading) {
    return (
      <div className="alerts-loading-card alerts-reveal">
        <DriverToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />

        <h4>Loading alerts...</h4>
        <p>Please wait while we fetch your notifications.</p>
      </div>
    );
  }

  return (
    <div className="alerts-page">
      <DriverToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <div className="alerts-hero alerts-reveal">
        <div className="alerts-hero-inner">
          <div>
            <div className="alerts-kicker">
              <span className="alerts-status-dot" />
              Driver Panel Overview
            </div>

            <h2 className="alerts-hero-title">Alerts</h2>

            <p className="alerts-hero-subtitle">
              Stay updated with important notifications, reminders, account
              updates, and messages shared by admin.
            </p>
          </div>

          <div className="alerts-hero-actions">
            <div className="alerts-hero-glass">
              <span>Logged in as</span>
              <strong>{driver?.user_name || "Driver"}</strong>
            </div>

            <button
              onClick={markAllAsRead}
              disabled={markingAll || unreadCount === 0}
              className="alerts-primary-btn"
            >
              {markingAll ? "Marking All..." : "Mark All Read"}
            </button>
          </div>
        </div>
      </div>

      {pageError && (
        <div className="alerts-page-alert-card alerts-reveal alerts-delay-1">
          <div className="alerts-page-alert-icon">
            <IconifyIcon icon="mdi:alert-circle-outline" />
          </div>

          <div>
            <strong>Unable to load alerts.</strong>
            <p>{pageError}</p>
          </div>
        </div>
      )}

      <div className="alerts-stats-grid alerts-reveal alerts-delay-1">
        <div className="alerts-stat-card alerts-stat-red">
          <div className="alerts-stat-icon-bg" />
          <div className="alerts-stat-icon">
            <IconifyIcon icon="mdi:bell-badge-outline" />
          </div>

          <p className="alerts-stat-label">Unread Alerts</p>
          <strong className="alerts-stat-value">{unreadCount}</strong>
          <span className="alerts-stat-note">Needs attention</span>
        </div>

        <div className="alerts-stat-card alerts-stat-blue">
          <div className="alerts-stat-icon-bg" />
          <div className="alerts-stat-icon">
            <IconifyIcon icon="mdi:information-outline" />
          </div>

          <p className="alerts-stat-label">Info Alerts</p>
          <strong className="alerts-stat-value">{infoCount}</strong>
          <span className="alerts-stat-note">General updates</span>
        </div>

        <div className="alerts-stat-card alerts-stat-indigo">
          <div className="alerts-stat-icon-bg" />
          <div className="alerts-stat-icon">
            <IconifyIcon icon="mdi:alert-outline" />
          </div>

          <p className="alerts-stat-label">Warning Alerts</p>
          <strong className="alerts-stat-value">{warningCount}</strong>
          <span className="alerts-stat-note">Important reminders</span>
        </div>

        <div className="alerts-stat-card alerts-stat-slate">
          <div className="alerts-stat-icon-bg" />
          <div className="alerts-stat-icon">
            <IconifyIcon icon="mdi:check-decagram-outline" />
          </div>

          <p className="alerts-stat-label">Success Alerts</p>
          <strong className="alerts-stat-value">{successCount}</strong>
          <span className="alerts-stat-note">Completed notices</span>
        </div>
      </div>

      <div className="alerts-list alerts-reveal alerts-delay-2">
        {sortedAlerts.length > 0 ? (
          sortedAlerts.map((alertItem) => {
            const meta = getAlertMeta(alertItem.notification_type);

            return (
              <div
                key={alertItem.id}
                className={`alerts-card ${
                  alertItem.is_read ? "alerts-card-read" : "alerts-card-unread"
                } ${meta.cardClass}`}
              >
                <div className="alerts-card-row">
                  <div className={`alerts-card-icon ${meta.iconClass}`}>
                    <IconifyIcon icon={meta.icon} />
                  </div>

                  <div className="alerts-card-content">
                    <div className="alerts-card-top">
                      <div>
                        <h4 className="alerts-card-title">
                          {alertItem.title || "Notification"}
                        </h4>

                        {!alertItem.is_read && (
                          <span className="alerts-badge alerts-badge-unread">
                            Unread
                          </span>
                        )}
                      </div>

                      <div className="alerts-card-actions">
                        <span className={`alerts-badge ${meta.badgeClass}`}>
                          {meta.label}
                        </span>

                        {!alertItem.is_read && (
                          <button
                            onClick={() => markAsRead(alertItem.id)}
                            disabled={markingId === alertItem.id || markingAll}
                            className="alerts-secondary-btn"
                          >
                            {markingId === alertItem.id ? "Marking..." : "Mark Read"}
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="alerts-card-message">
                      {alertItem.message || "No message available."}
                    </p>

                    <div className="alerts-meta">
                      <small>Created: {formatDateTime(alertItem.created_at)}</small>

                      {alertItem.read_at && (
                        <small className="alerts-read-time">
                          Read: {formatDateTime(alertItem.read_at)}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="alerts-empty-card">
            <div className="alerts-empty-icon">
              <IconifyIcon icon="mdi:bell-off-outline" />
            </div>

            <h4>No alerts found</h4>
            <p>You currently have no notifications or account alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;