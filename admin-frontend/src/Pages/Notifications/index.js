import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("notifications");

  const [notifications, setNotifications] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [supportMessages, setSupportMessages] = useState([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState([]);

  const [searchNotifications, setSearchNotifications] = useState("");
  const [searchSupport, setSearchSupport] = useState("");
  const [searchResetRequests, setSearchResetRequests] = useState("");

  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [lastSeenSupportId, setLastSeenSupportId] = useState(() => {
    return Number(localStorage.getItem("lastSeenSupportId") || 0);
  });

  const [lastSeenResetRequestId, setLastSeenResetRequestId] = useState(() => {
    return Number(localStorage.getItem("lastSeenResetRequestId") || 0);
  });

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notification_type: "info",
    recipient_type: "all",
    driver: "",
  });

  useEffect(() => {
    fetchNotifications();
    fetchDrivers();
    fetchSupportMessages();
    fetchPasswordResetRequests();
  }, []);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API_URL("/api/notifications/"));
      setNotifications(normalizeResponse(res));
    } catch (error) {
      console.error("Notifications error:", error);
      setNotifications([]);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(API_URL("/api/drivers/"));
      setDrivers(normalizeResponse(res));
    } catch (error) {
      console.error("Drivers error:", error);
      setDrivers([]);
    }
  };

  const fetchSupportMessages = async () => {
    try {
      const res = await axios.get(API_URL("/api/support-messages/"));
      setSupportMessages(normalizeResponse(res));
    } catch (error) {
      console.error("Support messages error:", error);
      setSupportMessages([]);
    }
  };

  const fetchPasswordResetRequests = async () => {
    try {
      const res = await axios.get(API_URL("/api/password-reset-requests/"));
      setPasswordResetRequests(normalizeResponse(res));
    } catch (error) {
      console.error("Password reset requests error:", error);
      setPasswordResetRequests([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "recipient_type" && value === "all") {
      setFormData((prev) => ({
        ...prev,
        recipient_type: value,
        driver: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      alert("Title and message are required.");
      return;
    }

    if (formData.recipient_type === "driver" && !formData.driver) {
      alert("Please select a driver.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        notification_type: formData.notification_type,
        recipient_type: formData.recipient_type,
        driver:
          formData.recipient_type === "driver"
            ? Number(formData.driver)
            : null,
      };

      await axios.post(API_URL("/api/notifications/"), payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Notification created successfully.");

      setFormData({
        title: "",
        message: "",
        notification_type: "info",
        recipient_type: "all",
        driver: "",
      });

      fetchNotifications();
    } catch (error) {
      console.error("Create notification error:", error);
      alert("Failed to create notification.");
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      await axios.delete(API_URL(`/api/notifications/${id}/`));
      alert("Notification deleted.");
      fetchNotifications();
    } catch (error) {
      console.error("Delete notification error:", error);
      alert("Failed to delete notification.");
    }
  };

  const updateSupportStatus = async (message, newStatus) => {
    try {
      setUpdatingId(message.id);

      const res = await axios.patch(
        API_URL(`/api/support-messages/${message.id}/`),
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      fetchSupportMessages();

      if (selectedSupport && selectedSupport.id === message.id) {
        setSelectedSupport(
          res?.data || { ...selectedSupport, status: newStatus }
        );
      }
    } catch (error) {
      console.error("Support status update error:", error);
      alert("Failed to update support message status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteSupportMessage = async (id) => {
    if (!window.confirm("Delete this support message?")) return;

    try {
      await axios.delete(API_URL(`/api/support-messages/${id}/`));
      alert("Support message deleted.");
      fetchSupportMessages();

      if (selectedSupport && selectedSupport.id === id) {
        setSelectedSupport(null);
        setReplyText("");
      }
    } catch (error) {
      console.error("Delete support message error:", error);
      alert("Failed to delete support message.");
    }
  };

  const sendSupportReply = async () => {
    if (!selectedSupport) return;

    if (!replyText.trim()) {
      alert("Please write a reply first.");
      return;
    }

    try {
      setUpdatingId(selectedSupport.id);

      const payload = {
        admin_reply: replyText.trim(),
      };

      const res = await axios.patch(
        API_URL(`/api/support-messages/${selectedSupport.id}/`),
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Reply sent successfully.");

      const updatedSupport = res?.data || {
        ...selectedSupport,
        admin_reply: replyText.trim(),
      };

      setSelectedSupport(updatedSupport);
      setReplyText(updatedSupport.admin_reply || "");

      fetchSupportMessages();
    } catch (error) {
      console.error("Send support reply error:", error);
      alert("Failed to send reply.");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateResetRequestStatus = async (request, newStatus) => {
    try {
      setUpdatingId(request.id);

      await axios.patch(
        API_URL(`/api/password-reset-requests/${request.id}/`),
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Password reset request updated.");
      fetchPasswordResetRequests();
    } catch (error) {
      console.error("Password reset request update error:", error);
      alert("Failed to update password reset request.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteResetRequest = async (id) => {
    if (!window.confirm("Delete this password reset request?")) return;

    try {
      await axios.delete(API_URL(`/api/password-reset-requests/${id}/`));
      alert("Password reset request deleted.");
      fetchPasswordResetRequests();
    } catch (error) {
      console.error("Delete password reset request error:", error);
      alert("Failed to delete password reset request.");
    }
  };

  const typeBadge = (type) => {
    if (type === "success") return "bg-success";
    if (type === "warning") return "bg-warning text-dark";
    return "bg-info";
  };

  const recipientBadge = (type) => {
    return type === "all" ? "bg-dark" : "bg-primary";
  };

  const supportStatusBadge = (status) => {
    return status === "resolved" ? "bg-success" : "bg-warning text-dark";
  };

  const resetRequestStatusBadge = (status) => {
    return status === "resolved" ? "bg-success" : "bg-danger";
  };

  const readRateBadge = (item) => {
    const total = Number(item.targeted_driver_count || 0);
    const read = Number(item.read_count || 0);

    if (total === 0) return "bg-secondary";
    if (read === 0) return "bg-danger";
    if (read === total) return "bg-success";
    return "bg-warning text-dark";
  };

  const filteredNotifications = notifications.filter((item) =>
    `${item.title} ${item.message} ${item.notification_type} ${
      item.recipient_type
    } ${item.driver_name || ""}`
      .toLowerCase()
      .includes(searchNotifications.toLowerCase())
  );

  const filteredSupportMessages = supportMessages.filter((item) =>
    `${item.subject} ${item.message} ${item.driver_name || ""} ${item.status} ${
      item.admin_reply || ""
    } ${item.issue_attachment_url ? "attachment uploaded" : "no attachment"}`
      .toLowerCase()
      .includes(searchSupport.toLowerCase())
  );

  const filteredResetRequests = passwordResetRequests.filter((item) =>
    `${item.username} ${item.email} ${item.message || ""} ${item.status} ${
      item.admin_note || ""
    }`
      .toLowerCase()
      .includes(searchResetRequests.toLowerCase())
  );

  const latestSupportId =
    supportMessages.length > 0
      ? Math.max(...supportMessages.map((item) => Number(item.id)))
      : 0;

  const newSupportCount = supportMessages.filter(
    (item) => Number(item.id) > Number(lastSeenSupportId)
  ).length;

  const hasNewSupport = newSupportCount > 0;

  const latestResetRequestId =
    passwordResetRequests.length > 0
      ? Math.max(...passwordResetRequests.map((item) => Number(item.id)))
      : 0;

  const newResetRequestCount = passwordResetRequests.filter(
    (item) => Number(item.id) > Number(lastSeenResetRequestId)
  ).length;

  const hasNewResetRequests = newResetRequestCount > 0;

  const handleSupportTabClick = () => {
    setActiveTab("support");
    setLastSeenSupportId(latestSupportId);
    localStorage.setItem("lastSeenSupportId", String(latestSupportId));
  };

  const handleResetRequestsTabClick = () => {
    setActiveTab("reset-requests");
    setLastSeenResetRequestId(latestResetRequestId);
    localStorage.setItem("lastSeenResetRequestId", String(latestResetRequestId));
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="mb-4">
          <h4 className="mb-1">Notifications & Support</h4>
          <p className="text-muted mb-0">
            Manage driver notifications, support messages, and password reset
            requests in one place.
          </p>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex gap-2 flex-wrap">
              <button
                className={`btn ${
                  activeTab === "notifications" ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                Notifications
              </button>

              <button
                className={`btn position-relative ${
                  hasNewSupport
                    ? "btn-warning"
                    : activeTab === "support"
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={handleSupportTabClick}
                style={
                  hasNewSupport
                    ? {
                        boxShadow: "0 0 0 0.2rem rgba(220, 53, 69, 0.2)",
                        fontWeight: "600",
                      }
                    : {}
                }
              >
                Support Messages
                {hasNewSupport && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {newSupportCount}
                  </span>
                )}
              </button>

              <button
                className={`btn position-relative ${
                  hasNewResetRequests
                    ? "btn-warning"
                    : activeTab === "reset-requests"
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={handleResetRequestsTabClick}
                style={
                  hasNewResetRequests
                    ? {
                        boxShadow: "0 0 0 0.2rem rgba(220, 53, 69, 0.2)",
                        fontWeight: "600",
                      }
                    : {}
                }
              >
                Password Reset Requests
                {hasNewResetRequests && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {newResetRequestCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {activeTab === "notifications" && (
          <>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">Create Notification</h5>

                <form onSubmit={handleCreateNotification}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter notification title"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Type</label>
                      <select
                        name="notification_type"
                        className="form-select"
                        value={formData.notification_type}
                        onChange={handleChange}
                      >
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Send To</label>
                      <select
                        name="recipient_type"
                        className="form-select"
                        value={formData.recipient_type}
                        onChange={handleChange}
                      >
                        <option value="all">All Drivers</option>
                        <option value="driver">Single Driver</option>
                      </select>
                    </div>

                    {formData.recipient_type === "driver" && (
                      <div className="col-md-6">
                        <label className="form-label">Select Driver</label>
                        <select
                          name="driver"
                          className="form-select"
                          value={formData.driver}
                          onChange={handleChange}
                        >
                          <option value="">Choose driver</option>
                          {drivers.length > 0 ? (
                            drivers.map((driver) => (
                              <option key={driver.id} value={driver.id}>
                                {driver.user_name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No drivers found
                            </option>
                          )}
                        </select>
                      </div>
                    )}

                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        className="form-control"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your notification message"
                      />
                    </div>

                    <div className="col-12">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Notification"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <input
                  className="form-control"
                  placeholder="Search notifications by title, message, type, recipient, or driver"
                  value={searchNotifications}
                  onChange={(e) => setSearchNotifications(e.target.value)}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Type</th>
                        <th>Recipient</th>
                        <th>Driver</th>
                        <th>Read Stats</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{item.title}</strong>
                            </td>
                            <td>{item.message}</td>
                            <td>
                              <span
                                className={`badge ${typeBadge(
                                  item.notification_type
                                )}`}
                              >
                                {item.notification_type}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${recipientBadge(
                                  item.recipient_type
                                )}`}
                              >
                                {item.recipient_type === "all"
                                  ? "All Drivers"
                                  : "Single Driver"}
                              </span>
                            </td>
                            <td>{item.driver_name || "-"}</td>
                            <td>
                              <div className="d-flex flex-column gap-1">
                                <span className={`badge ${readRateBadge(item)}`}>
                                  Read {item.read_count || 0} /{" "}
                                  {item.targeted_driver_count || 0}
                                </span>
                                <small className="text-muted">
                                  Unread: {item.unread_count || 0}
                                </small>
                              </div>
                            </td>
                            <td>{new Date(item.created_at).toLocaleString()}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteNotification(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No notifications found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "support" && (
          <>
            {selectedSupport && (
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="mb-1">Support Message Details</h5>
                      <p className="text-muted mb-0">
                        Full view of the selected support message
                      </p>
                    </div>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => {
                        setSelectedSupport(null);
                        setReplyText("");
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Driver:</strong>{" "}
                        {selectedSupport.driver_name || "-"}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`badge ${supportStatusBadge(
                            selectedSupport.status
                          )}`}
                        >
                          {selectedSupport.status}
                        </span>
                      </p>
                    </div>

                    <div className="col-12">
                      <p>
                        <strong>Subject:</strong> {selectedSupport.subject}
                      </p>
                    </div>

                    <div className="col-12">
                      <p>
                        <strong>Message:</strong>
                      </p>
                      <div
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                          padding: "14px",
                          background: "#f8fafc",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {selectedSupport.message}
                      </div>
                    </div>

                    <div className="col-12">
                      <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(selectedSupport.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="col-12">
                      <p>
                        <strong>Issue Attachment:</strong>
                      </p>

                      {selectedSupport.issue_attachment_url ? (
                        <a
                          href={selectedSupport.issue_attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Attachment
                        </a>
                      ) : (
                        <div
                          style={{
                            border: "1px dashed #cbd5e1",
                            borderRadius: "10px",
                            padding: "14px",
                            background: "#f8fafc",
                            color: "#64748b",
                          }}
                        >
                          No attachment uploaded.
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <p>
                        <strong>Admin Reply:</strong>
                      </p>
                      {selectedSupport.admin_reply ? (
                        <div
                          style={{
                            border: "1px solid #d1fae5",
                            borderRadius: "10px",
                            padding: "14px",
                            background: "#ecfdf5",
                            whiteSpace: "pre-wrap",
                            marginBottom: "12px",
                          }}
                        >
                          {selectedSupport.admin_reply}
                        </div>
                      ) : (
                        <div
                          style={{
                            border: "1px dashed #cbd5e1",
                            borderRadius: "10px",
                            padding: "14px",
                            background: "#f8fafc",
                            color: "#64748b",
                            marginBottom: "12px",
                          }}
                        >
                          No reply sent yet.
                        </div>
                      )}
                    </div>

                    {selectedSupport.replied_at && (
                      <div className="col-12">
                        <p>
                          <strong>Replied At:</strong>{" "}
                          {new Date(selectedSupport.replied_at).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div className="col-12">
                      <label className="form-label">
                        <strong>Write Reply</strong>
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Write reply for the driver..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <button
                        className="btn btn-primary"
                        disabled={updatingId === selectedSupport.id}
                        onClick={sendSupportReply}
                      >
                        {updatingId === selectedSupport.id
                          ? "Sending..."
                          : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card mb-4">
              <div className="card-body">
                <input
                  className="form-control"
                  placeholder="Search support messages by subject, message, driver, status, reply, or attachment"
                  value={searchSupport}
                  onChange={(e) => setSearchSupport(e.target.value)}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Driver</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Reply</th>
                        <th>Attachment</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSupportMessages.length > 0 ? (
                        filteredSupportMessages.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.driver_name || "-"}</td>
                            <td>
                              <strong>{item.subject}</strong>
                            </td>
                            <td style={{ maxWidth: "320px" }}>
                              {item.message.length > 60
                                ? item.message.slice(0, 60) + "..."
                                : item.message}
                            </td>
                            <td>
                              <span
                                className={`badge ${supportStatusBadge(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>
                              {item.admin_reply ? (
                                <span className="badge bg-success">Replied</span>
                              ) : (
                                <span className="badge bg-secondary">
                                  No Reply
                                </span>
                              )}
                            </td>
                            <td>
                              {item.issue_attachment_url ? (
                                <a
                                  href={item.issue_attachment_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="badge bg-secondary">None</span>
                              )}
                            </td>
                            <td>{new Date(item.created_at).toLocaleString()}</td>
                            <td>
                              <div className="d-flex flex-wrap gap-2">
                                <button
                                  className="btn btn-sm btn-info text-white"
                                  onClick={() => {
                                    setSelectedSupport(item);
                                    setReplyText(item.admin_reply || "");
                                  }}
                                >
                                  View
                                </button>

                                {item.status !== "resolved" ? (
                                  <button
                                    className="btn btn-sm btn-success"
                                    disabled={updatingId === item.id}
                                    onClick={() =>
                                      updateSupportStatus(item, "resolved")
                                    }
                                  >
                                    {updatingId === item.id
                                      ? "Updating..."
                                      : "Mark Resolved"}
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-warning"
                                    disabled={updatingId === item.id}
                                    onClick={() =>
                                      updateSupportStatus(item, "open")
                                    }
                                  >
                                    {updatingId === item.id
                                      ? "Updating..."
                                      : "Mark Open"}
                                  </button>
                                )}

                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => deleteSupportMessage(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No support messages found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "reset-requests" && (
          <>
            <div className="card mb-4">
              <div className="card-body">
                <input
                  className="form-control"
                  placeholder="Search reset requests by username, email, message, or status"
                  value={searchResetRequests}
                  onChange={(e) => setSearchResetRequests(e.target.value)}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <h5 className="mb-1">Password Reset Requests</h5>
                  <p className="text-muted mb-0">
                    Review requests submitted by drivers who cannot log in.
                    Reset the user password from User Management, share the
                    temporary password with the driver through an official
                    channel, then mark the request as resolved.
                  </p>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Resolved At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredResetRequests.length > 0 ? (
                        filteredResetRequests.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{item.username}</strong>
                            </td>
                            <td>{item.email}</td>
                            <td style={{ maxWidth: "320px" }}>
                              {item.message
                                ? item.message.length > 70
                                  ? item.message.slice(0, 70) + "..."
                                  : item.message
                                : "-"}
                            </td>
                            <td>
                              <span
                                className={`badge ${resetRequestStatusBadge(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>{new Date(item.created_at).toLocaleString()}</td>
                            <td>
                              {item.resolved_at
                                ? new Date(item.resolved_at).toLocaleString()
                                : "-"}
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-2">
                                <a
                                  href="/users"
                                  className="btn btn-sm btn-info text-white"
                                >
                                  Go to Users
                                </a>

                                {item.status !== "resolved" ? (
                                  <button
                                    className="btn btn-sm btn-success"
                                    disabled={updatingId === item.id}
                                    onClick={() =>
                                      updateResetRequestStatus(item, "resolved")
                                    }
                                  >
                                    {updatingId === item.id
                                      ? "Updating..."
                                      : "Mark Resolved"}
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-warning"
                                    disabled={updatingId === item.id}
                                    onClick={() =>
                                      updateResetRequestStatus(item, "pending")
                                    }
                                  >
                                    {updatingId === item.id
                                      ? "Updating..."
                                      : "Mark Pending"}
                                  </button>
                                )}

                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => deleteResetRequest(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No password reset requests found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;