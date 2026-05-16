import React, { useEffect, useState } from "react";
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

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3500);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setAlerts([]);
        setLoading(false);
        return;
      }

      const res = await fetch(
        API_URL(`/api/notifications/?driver_id=${loggedInDriver.id}`)
      );

      const data = await res.json();

      const filteredAlerts = (Array.isArray(data) ? data : []).filter(
        (item) =>
          item.recipient_type === "all" ||
          (item.recipient_type === "driver" &&
            Number(item.driver) === Number(loggedInDriver.id))
      );

      setAlerts(filteredAlerts);
    } catch (error) {
      console.error("Alerts error:", error);
      showToast("Failed to load alerts.", "error");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!driver) return;

    try {
      setMarkingId(notificationId);

      await fetch(API_URL(`/api/notifications/${notificationId}/mark-read/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver: driver.id,
        }),
      });

      setAlerts((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                is_read: true,
                read_at: new Date().toISOString(),
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
    if (!driver) return;

    const unreadAlerts = alerts.filter((item) => !item.is_read);

    if (unreadAlerts.length === 0) {
      showToast("There are no unread alerts to mark.", "info");
      return;
    }

    try {
      setMarkingAll(true);

      for (const alertItem of unreadAlerts) {
        await fetch(API_URL(`/api/notifications/${alertItem.id}/mark-read/`), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver: driver.id,
          }),
        });
      }

      const now = new Date().toISOString();

      setAlerts((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
          read_at: item.read_at || now,
        }))
      );

      window.dispatchEvent(new Event("notifications-updated"));
      showToast("All alerts marked as read.", "success");
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
    return new Date(dateValue).toLocaleString();
  };

  const infoCount = alerts.filter(
    (item) => String(item.notification_type).toLowerCase() === "info"
  ).length;

  const warningCount = alerts.filter(
    (item) => String(item.notification_type).toLowerCase() === "warning"
  ).length;

  const successCount = alerts.filter(
    (item) => String(item.notification_type).toLowerCase() === "success"
  ).length;

  const unreadCount = alerts.filter((item) => !item.is_read).length;

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

        <div className="alerts-stat-card alerts-stat-orange">
          <div className="alerts-stat-icon-bg" />
          <div className="alerts-stat-icon">
            <IconifyIcon icon="mdi:alert-outline" />
          </div>

          <p className="alerts-stat-label">Warning Alerts</p>
          <strong className="alerts-stat-value">{warningCount}</strong>
          <span className="alerts-stat-note">Important reminders</span>
        </div>

        <div className="alerts-stat-card alerts-stat-purple">
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
        {alerts.length > 0 ? (
          alerts.map((alertItem) => {
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
                        <h4 className="alerts-card-title">{alertItem.title}</h4>

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
                            disabled={markingId === alertItem.id}
                            className="alerts-secondary-btn"
                          >
                            {markingId === alertItem.id ? "Marking..." : "Mark Read"}
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="alerts-card-message">{alertItem.message}</p>

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