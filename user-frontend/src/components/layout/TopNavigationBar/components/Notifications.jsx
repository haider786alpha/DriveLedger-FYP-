import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";

const safeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const getNotificationMeta = (type) => {
  const value = String(type || "").toLowerCase();

  if (value === "warning") {
    return {
      icon: "mdi:alert-outline",
      className: "driver-notification-warning",
      label: "Warning",
    };
  }

  if (value === "success") {
    return {
      icon: "mdi:check-decagram-outline",
      className: "driver-notification-success",
      label: "Success",
    };
  }

  return {
    icon: "mdi:information-outline",
    className: "driver-notification-info",
    label: "Info",
  };
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString();
};

const NotificationItem = ({ item, onMarkRead, markingId }) => {
  const isUnread = !item.is_read;
  const meta = getNotificationMeta(item.notification_type);

  return (
    <DropdownItem
      className={`driver-notification-item ${isUnread ? "driver-notification-unread" : ""}`}
      as="div"
    >
      <div className="driver-notification-row">
        <div className={`driver-notification-icon ${meta.className}`}>
          <IconifyIcon icon={meta.icon} />
        </div>

        <div className="driver-notification-content">
          <div className="driver-notification-top">
            <div>
              <p className="driver-notification-title">
                {item.title || "Notification"}
              </p>

              <span className={`driver-notification-type ${meta.className}`}>
                {meta.label}
              </span>
            </div>

            {isUnread && (
              <span className="driver-notification-unread-badge">Unread</span>
            )}
          </div>

          <p className="driver-notification-message">
            {item.message || "No message available."}
          </p>

          <div className="driver-notification-footer">
            <small>{formatDateTime(item.created_at)}</small>

            {isUnread ? (
              <button
                type="button"
                onClick={() => onMarkRead(item.id)}
                disabled={markingId === item.id}
                className="driver-notification-mark-btn"
              >
                {markingId === item.id ? "Marking..." : "Mark Read"}
              </button>
            ) : (
              <small className="driver-notification-read-time">
                {item.read_at ? `Read: ${formatDateTime(item.read_at)}` : "Read"}
              </small>
            )}
          </div>
        </div>
      </div>
    </DropdownItem>
  );
};

const Notifications = () => {
  const [driver, setDriver] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const notificationControllerRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      if (document.hidden) return;

      if (notificationControllerRef.current) {
        notificationControllerRef.current.abort();
      }

      const controller = new AbortController();
      notificationControllerRef.current = controller;

      const loggedInDriver = await getLoggedInDriver();

      if (controller.signal.aborted) return;

      setDriver(loggedInDriver);

      if (!loggedInDriver?.id) {
        setNotifications([]);
        return;
      }

      const res = await fetch(
        API_URL(`/api/notifications/?driver_id=${loggedInDriver.id}`),
        {
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        throw new Error(`Notifications request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (controller.signal.aborted) return;

      const allNotifications = safeArray(data);

      const filteredAlerts = allNotifications.filter(
        (item) =>
          item.recipient_type === "all" ||
          (item.recipient_type === "driver" &&
            Number(item.driver) === Number(loggedInDriver.id))
      );

      setNotifications(filteredAlerts);
    } catch (error) {
      if (error?.name === "AbortError") return;

      console.error("Topbar notifications error:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    const handleFocus = () => fetchNotifications();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications();
      }
    };

    const handleNotificationsUpdated = () => fetchNotifications();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("notifications-updated", handleNotificationsUpdated);

    return () => {
      clearInterval(interval);

      if (notificationControllerRef.current) {
        notificationControllerRef.current.abort();
      }

      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("notifications-updated", handleNotificationsUpdated);
    };
  }, [fetchNotifications]);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  const markNotificationRead = async (notificationId) => {
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

      setNotifications((prev) =>
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
    } catch (error) {
      console.error("Topbar mark read error:", error);
    } finally {
      setMarkingId(null);
    }
  };

  const markAllRead = async () => {
    if (!driver?.id || markingAll) return;

    const unreadItems = notifications.filter((item) => !item.is_read);

    if (unreadItems.length === 0) return;

    try {
      setMarkingAll(true);

      const results = await Promise.allSettled(
        unreadItems.map((item) =>
          fetch(API_URL(`/api/notifications/${item.id}/mark-read/`), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              driver: driver.id,
            }),
          }).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to mark notification ${item.id}`);
            }

            return item.id;
          })
        )
      );

      const successfulIds = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      if (successfulIds.length === 0) return;

      const now = new Date().toISOString();

      setNotifications((prev) =>
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
    } catch (error) {
      console.error("Mark all read error:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <Dropdown className="topbar-item driver-notifications-dropdown" align="end">
      <DropdownToggle
        as="button"
        className="content-none topbar-button position-relative driver-notifications-toggle"
        aria-haspopup="true"
        aria-label="Open notifications"
      >
        <IconifyIcon icon="mdi:bell-outline" />

        {unreadCount > 0 && (
          <span className="driver-notifications-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </DropdownToggle>

      <DropdownMenu className="driver-notifications-menu">
        <div className="driver-notifications-header">
          <Row className="align-items-center">
            <Col>
              <h6>Notifications</h6>
              <p>{unreadCount > 0 ? `${unreadCount} unread alert(s)` : "All caught up"}</p>
            </Col>

            <Col xs="auto">
              <button
                type="button"
                onClick={markAllRead}
                disabled={markingAll || unreadCount === 0}
                className="driver-notifications-mark-all"
              >
                {markingAll ? "Marking..." : "Mark All Read"}
              </button>
            </Col>
          </Row>
        </div>

        <SimplebarReactClient style={{ maxHeight: 360 }}>
          {sortedNotifications.length > 0 ? (
            sortedNotifications.slice(0, 6).map((notification) => (
              <NotificationItem
                key={notification.id}
                item={notification}
                onMarkRead={markNotificationRead}
                markingId={markingId}
              />
            ))
          ) : (
            <div className="driver-notifications-empty">
              <div>
                <IconifyIcon icon="mdi:bell-off-outline" />
              </div>

              <h6>No notifications</h6>
              <p>You currently have no alerts.</p>
            </div>
          )}
        </SimplebarReactClient>

        <div className="driver-notifications-footer">
          <Button
            as={Link}
            to="/alerts"
            size="sm"
            className="driver-notifications-view-all"
          >
            View All Alerts
            <IconifyIcon icon="mdi:arrow-right" />
          </Button>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Notifications;