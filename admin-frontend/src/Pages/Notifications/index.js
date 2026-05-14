import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Notifications.css";

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
  const [toast, setToast] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: "",
    id: null,
    title: "",
    message: "",
    deleting: false,
  });

  const [lastSeenSupportId, setLastSeenSupportId] = useState(() =>
    Number(localStorage.getItem("lastSeenSupportId") || 0)
  );

  const [lastSeenResetRequestId, setLastSeenResetRequestId] = useState(() =>
    Number(localStorage.getItem("lastSeenResetRequestId") || 0)
  );

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notification_type: "info",
    recipient_type: "all",
    driver: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchAllData = async () => {
    fetchNotifications();
    fetchDrivers();
    fetchSupportMessages();
    fetchPasswordResetRequests();
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

  const formatDate = (value) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return "-";
    }
  };

  const trimText = (text, length = 70) => {
    if (!text) return "-";
    return text.length > length ? `${text.slice(0, length)}...` : text;
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
      showToast("error", "Missing Fields", "Title and message are required.");
      return;
    }

    if (formData.recipient_type === "driver" && !formData.driver) {
      showToast("error", "Driver Required", "Please select a driver.");
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

      showToast(
        "success",
        "Notification Sent",
        "Notification has been created successfully."
      );

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
      showToast("error", "Send Failed", "Failed to create notification.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (type, id, title, message) => {
    setDeleteModal({
      open: true,
      type,
      id,
      title,
      message,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      type: "",
      id: null,
      title: "",
      message: "",
      deleting: false,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return;

    setDeleteModal((prev) => ({ ...prev, deleting: true }));

    try {
      if (deleteModal.type === "notification") {
        await axios.delete(API_URL(`/api/notifications/${deleteModal.id}/`));
        fetchNotifications();
      }

      if (deleteModal.type === "support") {
        await axios.delete(API_URL(`/api/support-messages/${deleteModal.id}/`));
        fetchSupportMessages();

        if (selectedSupport && selectedSupport.id === deleteModal.id) {
          setSelectedSupport(null);
          setReplyText("");
        }
      }

      if (deleteModal.type === "reset") {
        await axios.delete(
          API_URL(`/api/password-reset-requests/${deleteModal.id}/`)
        );
        fetchPasswordResetRequests();
      }

      closeDeleteModal();

      showToast(
        "success",
        "Deleted Successfully",
        "Selected record has been removed."
      );
    } catch (error) {
      console.error("Delete error:", error);

      setDeleteModal((prev) => ({ ...prev, deleting: false }));

      showToast("error", "Delete Failed", "Could not delete this record.");
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

      showToast("success", "Status Updated", "Support status has been updated.");
    } catch (error) {
      console.error("Support status update error:", error);
      showToast("error", "Update Failed", "Failed to update support status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const sendSupportReply = async () => {
    if (!selectedSupport) return;

    if (!replyText.trim()) {
      showToast("error", "Reply Required", "Please write a reply first.");
      return;
    }

    try {
      setUpdatingId(selectedSupport.id);

      const res = await axios.patch(
        API_URL(`/api/support-messages/${selectedSupport.id}/`),
        { admin_reply: replyText.trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      const updatedSupport = res?.data || {
        ...selectedSupport,
        admin_reply: replyText.trim(),
      };

      setSelectedSupport(updatedSupport);
      setReplyText(updatedSupport.admin_reply || "");

      fetchSupportMessages();

      showToast("success", "Reply Sent", "Reply has been sent successfully.");
    } catch (error) {
      console.error("Send support reply error:", error);
      showToast("error", "Reply Failed", "Failed to send reply.");
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

      fetchPasswordResetRequests();

      showToast(
        "success",
        "Request Updated",
        "Password reset request status has been updated."
      );
    } catch (error) {
      console.error("Password reset request update error:", error);
      showToast("error", "Update Failed", "Failed to update reset request.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getTypeBadgeClass = (type) => {
    if (type === "success") return "notify-badge notify-badge-success";
    if (type === "warning") return "notify-badge notify-badge-warning";
    return "notify-badge notify-badge-info";
  };

  const getRecipientBadgeClass = (type) => {
    return type === "all"
      ? "notify-badge notify-badge-dark"
      : "notify-badge notify-badge-info";
  };

  const getSupportStatusBadgeClass = (status) => {
    return status === "resolved"
      ? "notify-badge notify-badge-success"
      : "notify-badge notify-badge-warning";
  };

  const getResetStatusBadgeClass = (status) => {
    return status === "resolved"
      ? "notify-badge notify-badge-success"
      : "notify-badge notify-badge-danger";
  };

  const getReadRateBadgeClass = (item) => {
    const total = Number(item.targeted_driver_count || 0);
    const read = Number(item.read_count || 0);

    if (total === 0) return "notify-badge notify-badge-muted";
    if (read === 0) return "notify-badge notify-badge-danger";
    if (read === total) return "notify-badge notify-badge-success";
    return "notify-badge notify-badge-warning";
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

  const latestResetRequestId =
    passwordResetRequests.length > 0
      ? Math.max(...passwordResetRequests.map((item) => Number(item.id)))
      : 0;

  const newResetRequestCount = passwordResetRequests.filter(
    (item) => Number(item.id) > Number(lastSeenResetRequestId)
  ).length;

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
    <div className="page-content driveledger-notifications">
      {toast && (
        <div className={`notify-toast notify-toast-${toast.type}`}>
          <div className="notify-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="notify-modal-backdrop">
          <div className="notify-modal-card">
            <div className="notify-modal-icon">!</div>

            <h5>{deleteModal.title}</h5>
            <p>{deleteModal.message}</p>

            <div className="notify-modal-actions">
              <button
                type="button"
                className="notify-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="notify-modal-delete"
                onClick={confirmDelete}
                disabled={deleteModal.deleting}
              >
                {deleteModal.deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="notify-hero notify-reveal notify-delay-1">
          <div className="notify-hero-pill">
            <span className="dl-status-dot"></span>
            Driver Communication Center
          </div>

          <h4>Notifications & Support</h4>
          <p>
            Manage driver notifications, support messages and password reset
            requests in one clean admin center.
          </p>
        </div>

        <div className="notify-card notify-reveal notify-delay-2">
          <div className="notify-tabs">
            <button
              type="button"
              className={`notify-tab-btn ${
                activeTab === "notifications" ? "notify-tab-active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>

            <button
              type="button"
              className={`notify-tab-btn ${
                newSupportCount > 0
                  ? "notify-tab-alert"
                  : activeTab === "support"
                  ? "notify-tab-active"
                  : ""
              }`}
              onClick={handleSupportTabClick}
            >
              Support Messages
              {newSupportCount > 0 && (
                <span className="notify-tab-badge">{newSupportCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`notify-tab-btn ${
                newResetRequestCount > 0
                  ? "notify-tab-alert"
                  : activeTab === "reset-requests"
                  ? "notify-tab-active"
                  : ""
              }`}
              onClick={handleResetRequestsTabClick}
            >
              Password Reset Requests
              {newResetRequestCount > 0 && (
                <span className="notify-tab-badge">
                  {newResetRequestCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "notifications" && (
          <NotificationsTab
            formData={formData}
            handleChange={handleChange}
            drivers={drivers}
            loading={loading}
            handleCreateNotification={handleCreateNotification}
            searchNotifications={searchNotifications}
            setSearchNotifications={setSearchNotifications}
            filteredNotifications={filteredNotifications}
            getTypeBadgeClass={getTypeBadgeClass}
            getRecipientBadgeClass={getRecipientBadgeClass}
            getReadRateBadgeClass={getReadRateBadgeClass}
            formatDate={formatDate}
            trimText={trimText}
            openDeleteModal={openDeleteModal}
          />
        )}

        {activeTab === "support" && (
          <SupportTab
            selectedSupport={selectedSupport}
            setSelectedSupport={setSelectedSupport}
            replyText={replyText}
            setReplyText={setReplyText}
            updatingId={updatingId}
            sendSupportReply={sendSupportReply}
            searchSupport={searchSupport}
            setSearchSupport={setSearchSupport}
            filteredSupportMessages={filteredSupportMessages}
            getSupportStatusBadgeClass={getSupportStatusBadgeClass}
            updateSupportStatus={updateSupportStatus}
            formatDate={formatDate}
            trimText={trimText}
            openDeleteModal={openDeleteModal}
          />
        )}

        {activeTab === "reset-requests" && (
          <ResetRequestsTab
            searchResetRequests={searchResetRequests}
            setSearchResetRequests={setSearchResetRequests}
            filteredResetRequests={filteredResetRequests}
            getResetStatusBadgeClass={getResetStatusBadgeClass}
            updateResetRequestStatus={updateResetRequestStatus}
            updatingId={updatingId}
            formatDate={formatDate}
            trimText={trimText}
            openDeleteModal={openDeleteModal}
          />
        )}
      </div>
    </div>
  );
};

const NotificationsTab = ({
  formData,
  handleChange,
  drivers,
  loading,
  handleCreateNotification,
  searchNotifications,
  setSearchNotifications,
  filteredNotifications,
  getTypeBadgeClass,
  getRecipientBadgeClass,
  getReadRateBadgeClass,
  formatDate,
  trimText,
  openDeleteModal,
}) => (
  <>
    <div className="notify-card notify-reveal notify-delay-2">
      <div className="notify-card-head">
        <div>
          <h5>Create Notification</h5>
          <p>Send a message to all drivers or a single selected driver.</p>
        </div>
      </div>

      <form onSubmit={handleCreateNotification}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="notify-form-label">Title</label>
            <input
              type="text"
              name="title"
              className="notify-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notification title"
            />
          </div>

          <div className="col-md-3">
            <label className="notify-form-label">Type</label>
            <select
              name="notification_type"
              className="notify-select"
              value={formData.notification_type}
              onChange={handleChange}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="notify-form-label">Send To</label>
            <select
              name="recipient_type"
              className="notify-select"
              value={formData.recipient_type}
              onChange={handleChange}
            >
              <option value="all">All Drivers</option>
              <option value="driver">Single Driver</option>
            </select>
          </div>

          {formData.recipient_type === "driver" && (
            <div className="col-md-6">
              <label className="notify-form-label">Select Driver</label>
              <select
                name="driver"
                className="notify-select"
                value={formData.driver}
                onChange={handleChange}
              >
                <option value="">Choose driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.user_name || `Driver ${driver.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-12">
            <label className="notify-form-label">Message</label>
            <textarea
              name="message"
              className="notify-textarea"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your notification message"
            />
          </div>

          <div className="col-12">
            <button className="notify-primary-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </div>
      </form>
    </div>

    <div className="notify-card">
      <input
        className="notify-search-input"
        placeholder="Search notifications by title, message, type, recipient, or driver"
        value={searchNotifications}
        onChange={(e) => setSearchNotifications(e.target.value)}
      />
    </div>

    <div className="notify-card">
      <div className="notify-card-head">
        <div>
          <h5>Notification Records</h5>
          <p>{filteredNotifications.length} notification record(s) found</p>
        </div>
      </div>

      <div className="notify-table-wrap">
        <table className="table table-hover align-middle notify-table">
          <thead>
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
                    <div className="notify-title">{item.title}</div>
                  </td>
                  <td className="notify-message">{trimText(item.message, 90)}</td>
                  <td>
                    <span className={getTypeBadgeClass(item.notification_type)}>
                      {item.notification_type}
                    </span>
                  </td>
                  <td>
                    <span className={getRecipientBadgeClass(item.recipient_type)}>
                      {item.recipient_type === "all"
                        ? "All Drivers"
                        : "Single Driver"}
                    </span>
                  </td>
                  <td>{item.driver_name || "-"}</td>
                  <td>
                    <span className={getReadRateBadgeClass(item)}>
                      Read {item.read_count || 0} /{" "}
                      {item.targeted_driver_count || 0}
                    </span>
                    <div className="notify-sub">
                      Unread: {item.unread_count || 0}
                    </div>
                  </td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    <button
                      type="button"
                      className="notify-danger-btn"
                      onClick={() =>
                        openDeleteModal(
                          "notification",
                          item.id,
                          "Delete Notification?",
                          "Are you sure you want to delete this notification?"
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="notify-empty">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="notify-mobile-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item, index) => (
            <div className="notify-mobile-card" key={item.id}>
              <div className="notify-mobile-top">
                <div>
                  <div className="notify-title">
                    {index + 1}. {item.title}
                  </div>
                  <div className="notify-sub">{formatDate(item.created_at)}</div>
                </div>

                <span className={getTypeBadgeClass(item.notification_type)}>
                  {item.notification_type}
                </span>
              </div>

              <div className="notify-mobile-row">
                <span>Message</span>
                <strong>{trimText(item.message, 80)}</strong>
              </div>

              <div className="notify-mobile-row">
                <span>Recipient</span>
                <strong>
                  {item.recipient_type === "all"
                    ? "All Drivers"
                    : item.driver_name || "Single Driver"}
                </strong>
              </div>

              <div className="notify-mobile-row">
                <span>Read</span>
                <strong>
                  {item.read_count || 0} / {item.targeted_driver_count || 0}
                </strong>
              </div>

              <div className="notify-actions">
                <button
                  type="button"
                  className="notify-danger-btn"
                  onClick={() =>
                    openDeleteModal(
                      "notification",
                      item.id,
                      "Delete Notification?",
                      "Are you sure you want to delete this notification?"
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="notify-empty">No notifications found</div>
        )}
      </div>
    </div>
  </>
);

const SupportTab = ({
  selectedSupport,
  setSelectedSupport,
  replyText,
  setReplyText,
  updatingId,
  sendSupportReply,
  searchSupport,
  setSearchSupport,
  filteredSupportMessages,
  getSupportStatusBadgeClass,
  updateSupportStatus,
  formatDate,
  trimText,
  openDeleteModal,
}) => (
  <>
    {selectedSupport && (
      <div className="notify-card notify-reveal notify-delay-2">
        <div className="notify-card-head">
          <div>
            <h5>Support Message Details</h5>
            <p>Full view of the selected support message.</p>
          </div>

          <button
            type="button"
            className="notify-light-btn"
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
            <strong>Driver:</strong> {selectedSupport.driver_name || "-"}
          </div>

          <div className="col-md-6">
            <strong>Status:</strong>{" "}
            <span className={getSupportStatusBadgeClass(selectedSupport.status)}>
              {selectedSupport.status}
            </span>
          </div>

          <div className="col-12">
            <strong>Subject:</strong> {selectedSupport.subject}
          </div>

          <div className="col-12">
            <strong>Message:</strong>
            <div className="support-detail-box mt-2">
              {selectedSupport.message}
            </div>
          </div>

          <div className="col-12">
            <strong>Created At:</strong> {formatDate(selectedSupport.created_at)}
          </div>

          <div className="col-12">
            <strong>Issue Attachment:</strong>
            <div className="mt-2">
              {selectedSupport.issue_attachment_url ? (
                <a
                  href={selectedSupport.issue_attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="notify-info-btn"
                >
                  View Attachment
                </a>
              ) : (
                <div className="support-empty-box">No attachment uploaded.</div>
              )}
            </div>
          </div>

          <div className="col-12">
            <strong>Admin Reply:</strong>
            <div className="mt-2">
              {selectedSupport.admin_reply ? (
                <div className="support-reply-box">
                  {selectedSupport.admin_reply}
                </div>
              ) : (
                <div className="support-empty-box">No reply sent yet.</div>
              )}
            </div>
          </div>

          {selectedSupport.replied_at && (
            <div className="col-12">
              <strong>Replied At:</strong> {formatDate(selectedSupport.replied_at)}
            </div>
          )}

          <div className="col-12">
            <label className="notify-form-label">Write Reply</label>
            <textarea
              className="notify-textarea"
              rows="4"
              placeholder="Write reply for the driver..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button
              type="button"
              className="notify-primary-btn"
              disabled={updatingId === selectedSupport.id}
              onClick={sendSupportReply}
            >
              {updatingId === selectedSupport.id ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="notify-card">
      <input
        className="notify-search-input"
        placeholder="Search support messages by subject, message, driver, status, reply, or attachment"
        value={searchSupport}
        onChange={(e) => setSearchSupport(e.target.value)}
      />
    </div>

    <div className="notify-card">
      <div className="notify-card-head">
        <div>
          <h5>Support Messages</h5>
          <p>{filteredSupportMessages.length} support message(s) found</p>
        </div>
      </div>

      <div className="notify-table-wrap">
        <table className="table table-hover align-middle notify-table">
          <thead>
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
                    <div className="notify-title">{item.subject}</div>
                  </td>
                  <td className="notify-message">{trimText(item.message, 70)}</td>
                  <td>
                    <span className={getSupportStatusBadgeClass(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.admin_reply ? (
                      <span className="notify-badge notify-badge-success">
                        Replied
                      </span>
                    ) : (
                      <span className="notify-badge notify-badge-muted">
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
                        className="notify-info-btn"
                      >
                        View
                      </a>
                    ) : (
                      <span className="notify-badge notify-badge-muted">None</span>
                    )}
                  </td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    <SupportActions
                      item={item}
                      updatingId={updatingId}
                      setSelectedSupport={setSelectedSupport}
                      setReplyText={setReplyText}
                      updateSupportStatus={updateSupportStatus}
                      openDeleteModal={openDeleteModal}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="notify-empty">
                  No support messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="notify-mobile-list">
        {filteredSupportMessages.length > 0 ? (
          filteredSupportMessages.map((item, index) => (
            <div className="notify-mobile-card" key={item.id}>
              <div className="notify-mobile-top">
                <div>
                  <div className="notify-title">
                    {index + 1}. {item.subject}
                  </div>
                  <div className="notify-sub">{item.driver_name || "-"}</div>
                  <div className="notify-sub">{formatDate(item.created_at)}</div>
                </div>

                <span className={getSupportStatusBadgeClass(item.status)}>
                  {item.status}
                </span>
              </div>

              <div className="notify-mobile-row">
                <span>Message</span>
                <strong>{trimText(item.message, 80)}</strong>
              </div>

              <div className="notify-mobile-row">
                <span>Reply</span>
                <strong>{item.admin_reply ? "Replied" : "No Reply"}</strong>
              </div>

              <div className="notify-actions">
                <SupportActions
                  item={item}
                  updatingId={updatingId}
                  setSelectedSupport={setSelectedSupport}
                  setReplyText={setReplyText}
                  updateSupportStatus={updateSupportStatus}
                  openDeleteModal={openDeleteModal}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="notify-empty">No support messages found</div>
        )}
      </div>
    </div>
  </>
);

const SupportActions = ({
  item,
  updatingId,
  setSelectedSupport,
  setReplyText,
  updateSupportStatus,
  openDeleteModal,
}) => (
  <div className="notify-actions">
    <button
      type="button"
      className="notify-info-btn"
      onClick={() => {
        setSelectedSupport(item);
        setReplyText(item.admin_reply || "");
      }}
    >
      View
    </button>

    {item.status !== "resolved" ? (
      <button
        type="button"
        className="notify-success-btn"
        disabled={updatingId === item.id}
        onClick={() => updateSupportStatus(item, "resolved")}
      >
        {updatingId === item.id ? "Updating..." : "Resolved"}
      </button>
    ) : (
      <button
        type="button"
        className="notify-warning-btn"
        disabled={updatingId === item.id}
        onClick={() => updateSupportStatus(item, "open")}
      >
        {updatingId === item.id ? "Updating..." : "Open"}
      </button>
    )}

    <button
      type="button"
      className="notify-danger-btn"
      onClick={() =>
        openDeleteModal(
          "support",
          item.id,
          "Delete Support Message?",
          "Are you sure you want to delete this support message?"
        )
      }
    >
      Delete
    </button>
  </div>
);

const ResetRequestsTab = ({
  searchResetRequests,
  setSearchResetRequests,
  filteredResetRequests,
  getResetStatusBadgeClass,
  updateResetRequestStatus,
  updatingId,
  formatDate,
  trimText,
  openDeleteModal,
}) => (
  <>
    <div className="notify-card">
      <input
        className="notify-search-input"
        placeholder="Search reset requests by username, email, message, or status"
        value={searchResetRequests}
        onChange={(e) => setSearchResetRequests(e.target.value)}
      />
    </div>

    <div className="notify-card">
      <div className="notify-card-head">
        <div>
          <h5>Password Reset Requests</h5>
          <p>
            Review driver login issues, reset passwords from User Management,
            then mark the request as resolved.
          </p>
        </div>
      </div>

      <div className="notify-table-wrap">
        <table className="table table-hover align-middle notify-table">
          <thead>
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
                    <div className="notify-title">{item.username}</div>
                  </td>
                  <td>{item.email}</td>
                  <td className="notify-message">{trimText(item.message, 80)}</td>
                  <td>
                    <span className={getResetStatusBadgeClass(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>{formatDate(item.resolved_at)}</td>
                  <td>
                    <ResetActions
                      item={item}
                      updatingId={updatingId}
                      updateResetRequestStatus={updateResetRequestStatus}
                      openDeleteModal={openDeleteModal}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="notify-empty">
                  No password reset requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="notify-mobile-list">
        {filteredResetRequests.length > 0 ? (
          filteredResetRequests.map((item, index) => (
            <div className="notify-mobile-card" key={item.id}>
              <div className="notify-mobile-top">
                <div>
                  <div className="notify-title">
                    {index + 1}. {item.username}
                  </div>
                  <div className="notify-sub">{item.email}</div>
                  <div className="notify-sub">{formatDate(item.created_at)}</div>
                </div>

                <span className={getResetStatusBadgeClass(item.status)}>
                  {item.status}
                </span>
              </div>

              <div className="notify-mobile-row">
                <span>Message</span>
                <strong>{trimText(item.message, 80)}</strong>
              </div>

              <div className="notify-mobile-row">
                <span>Resolved</span>
                <strong>{formatDate(item.resolved_at)}</strong>
              </div>

              <div className="notify-actions">
                <ResetActions
                  item={item}
                  updatingId={updatingId}
                  updateResetRequestStatus={updateResetRequestStatus}
                  openDeleteModal={openDeleteModal}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="notify-empty">No password reset requests found</div>
        )}
      </div>
    </div>
  </>
);

const ResetActions = ({
  item,
  updatingId,
  updateResetRequestStatus,
  openDeleteModal,
}) => (
  <div className="notify-actions">
    <Link to="/users" className="notify-info-btn">
      Users
    </Link>

    {item.status !== "resolved" ? (
      <button
        type="button"
        className="notify-success-btn"
        disabled={updatingId === item.id}
        onClick={() => updateResetRequestStatus(item, "resolved")}
      >
        {updatingId === item.id ? "Updating..." : "Resolved"}
      </button>
    ) : (
      <button
        type="button"
        className="notify-warning-btn"
        disabled={updatingId === item.id}
        onClick={() => updateResetRequestStatus(item, "pending")}
      >
        {updatingId === item.id ? "Updating..." : "Pending"}
      </button>
    )}

    <button
      type="button"
      className="notify-danger-btn"
      onClick={() =>
        openDeleteModal(
          "reset",
          item.id,
          "Delete Reset Request?",
          "Are you sure you want to delete this password reset request?"
        )
      }
    >
      Delete
    </button>
  </div>
);

export default Notifications;