import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { getLoggedInDriver } from '@/helpers/getLoggedInDriver';
import { API_URL } from '@/helpers/apiConfig';

const NotificationItem = ({ item, onMarkRead, markingId }) => {
  const isUnread = !item.is_read;

  return (
    <DropdownItem
      className="py-3 border-bottom text-wrap"
      as="div"
      style={{
        background: isUnread ? '#f8fbff' : '#ffffff',
        cursor: 'default',
      }}
    >
      <div className="d-flex gap-3">
        <div className="flex-shrink-0">
          <div
            className="avatar-sm"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background:
                item.notification_type === 'warning'
                  ? '#fff7ed'
                  : item.notification_type === 'success'
                  ? '#f0fdf4'
                  : '#eff6ff',
              color:
                item.notification_type === 'warning'
                  ? '#c2410c'
                  : item.notification_type === 'success'
                  ? '#166534'
                  : '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '700',
            }}
          >
            {item.notification_type === 'warning'
              ? '!'
              : item.notification_type === 'success'
              ? '✓'
              : 'i'}
          </div>
        </div>

        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
            <p
              className="mb-0 fw-semibold"
              style={{
                color: '#0f172a',
                wordBreak: 'break-word',
              }}
            >
              {item.title}
            </p>

            {isUnread && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '999px',
                  background: '#fee2e2',
                  color: '#991b1b',
                  fontSize: '10px',
                  fontWeight: '700',
                }}
              >
                Unread
              </span>
            )}
          </div>

          <p
            className="mb-2 mt-1"
            style={{
              color: '#475569',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {item.message}
          </p>

          <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <small style={{ color: '#64748b' }}>
              {new Date(item.created_at).toLocaleString()}
            </small>

            {isUnread ? (
              <button
                type="button"
                onClick={() => onMarkRead(item.id)}
                disabled={markingId === item.id}
                style={{
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {markingId === item.id ? 'Marking...' : 'Mark Read'}
              </button>
            ) : (
              <small style={{ color: '#2563eb' }}>
                {item.read_at ? `Read: ${new Date(item.read_at).toLocaleString()}` : 'Read'}
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

  const fetchNotifications = useCallback(async () => {
    try {
      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setNotifications([]);
        return;
      }

      const res = await fetch(API_URL(`/api/notifications/?driver_id=${loggedInDriver.id}`));
      const data = await res.json();

      const filteredAlerts = (Array.isArray(data) ? data : []).filter(
        (item) =>
          item.recipient_type === 'all' ||
          (item.recipient_type === 'driver' &&
            Number(item.driver) === Number(loggedInDriver.id))
      );

      setNotifications(filteredAlerts);
    } catch (error) {
      console.error('Topbar notifications error:', error);
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    const handleFocus = () => fetchNotifications();
    const handleNotificationsUpdated = () => fetchNotifications();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('notifications-updated', handleNotificationsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('notifications-updated', handleNotificationsUpdated);
    };
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  const markNotificationRead = async (notificationId) => {
    if (!driver) return;

    try {
      setMarkingId(notificationId);

      await fetch(API_URL(`/api/notifications/${notificationId}/mark-read/`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver: driver.id,
        }),
      });

      setNotifications((prev) =>
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

      window.dispatchEvent(new Event('notifications-updated'));
    } catch (error) {
      console.error('Topbar mark read error:', error);
    } finally {
      setMarkingId(null);
    }
  };

  const markAllRead = async () => {
    if (!driver) return;

    const unreadItems = notifications.filter((item) => !item.is_read);
    if (unreadItems.length === 0) return;

    try {
      for (const item of unreadItems) {
        await fetch(API_URL(`/api/notifications/${item.id}/mark-read/`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            driver: driver.id,
          }),
        });
      }

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
          read_at: item.read_at || new Date().toISOString(),
        }))
      );

      window.dispatchEvent(new Event('notifications-updated'));
    } catch (error) {
      console.error('Mark all read error:', error);
    }
  };

  return (
    <Dropdown className="topbar-item" align={'end'}>
      <DropdownToggle
        as="button"
        className="content-none topbar-button position-relative"
        aria-haspopup="true"
      >
        <IconifyIcon icon="iconamoon:notification-duotone" className="fs-24 align-middle" />
        {unreadCount > 0 && (
          <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
            {unreadCount > 99 ? '99+' : unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </DropdownToggle>

      <DropdownMenu className="py-0 dropdown-lg">
        <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0 fs-16 fw-semibold">Notifications</h6>
            </Col>
            <Col xs="auto">
              <button
                type="button"
                onClick={markAllRead}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#0f172a',
                  textDecoration: 'underline',
                  fontSize: '12px',
                }}
              >
                Mark All Read
              </button>
            </Col>
          </Row>
        </div>

        <SimplebarReactClient style={{ maxHeight: 320 }}>
          {notifications.length > 0 ? (
            notifications.slice(0, 6).map((notification) => (
              <NotificationItem
                key={notification.id}
                item={notification}
                onMarkRead={markNotificationRead}
                markingId={markingId}
              />
            ))
          ) : (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: '#64748b',
              }}
            >
              No notifications found.
            </div>
          )}
        </SimplebarReactClient>

        <div className="text-center py-3">
          <Button as={Link} to="/alerts" size="sm" variant="primary" className="icons-center">
            View All Alerts
            <IconifyIcon icon="bx:right-arrow-alt" className="ms-2" />
          </Button>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Notifications;