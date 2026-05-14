import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "../../../helpers/apiConfig";

const NotificationDropdown = (props) => {
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL("/api/support-messages/"));
      const supportMessages = normalizeResponse(res);

      const sortedMessages = supportMessages
        .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
        .slice(0, 5);

      setNotifications(sortedMessages);
    } catch (error) {
      console.error("Notification dropdown error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getMessageTitle = (item) => {
    return (
      item.name ||
      item.driver_name ||
      item.user_name ||
      item.username ||
      item.subject ||
      "New support message"
    );
  };

  const getMessageText = (item) => {
    return (
      item.message ||
      item.description ||
      item.issue ||
      item.body ||
      "A new support request has been received."
    );
  };

  const getMessageTime = (item) => {
    const rawDate = item.created_at || item.date || item.timestamp;

    if (!rawDate) return "Recently";

    try {
      return new Date(rawDate).toLocaleString();
    } catch {
      return "Recently";
    }
  };

  const closeDropdown = () => {
    setMenu(false);
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => {
          const nextState = !menu;
          setMenu(nextState);

          if (nextState) {
            fetchNotifications();
          }
        }}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="ri-notification-3-line" />

          {notifications.length > 0 && <span className="noti-dot"></span>}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0">{props.t("Notifications")}</h6>
              </Col>

              <div className="col-auto">
                <Link to="/notifications" className="small" onClick={closeDropdown}>
                  View All
                </Link>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {loading ? (
              <div className="text-center text-muted py-4">
                Loading notifications...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((item) => (
                <Link
                  to="/notifications"
                  className="text-reset notification-item"
                  key={item.id}
                  onClick={closeDropdown}
                >
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-xs">
                        <span className="avatar-title bg-info rounded-circle font-size-16">
                          <i className="ri-customer-service-2-line"></i>
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow-1">
                      <h6 className="mb-1">{getMessageTitle(item)}</h6>

                      <div className="font-size-12 text-muted">
                        <p className="mb-1">
                          {String(getMessageText(item)).length > 70
                            ? `${String(getMessageText(item)).slice(0, 70)}...`
                            : getMessageText(item)}
                        </p>

                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i>{" "}
                          {getMessageTime(item)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4 px-3">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "14px",
                    background: "#ecfdf5",
                    color: "#0f766e",
                    fontSize: "20px",
                  }}
                >
                  <i className="ri-checkbox-circle-line"></i>
                </div>

                <h6 className="mb-1">No new notifications</h6>
                <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                  Support messages will appear here.
                </p>
              </div>
            )}
          </SimpleBar>

          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 text-center"
              to="/notifications"
              onClick={closeDropdown}
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>{" "}
              <span key="t-view-more">{props.t("View More..")}</span>
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(NotificationDropdown);