import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import DriverToast from "@/components/DriverToast";
import "./Support.css";

const Support = () => {
  const [driver, setDriver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [issueAttachment, setIssueAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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
    fetchSupportMessages();
  }, []);

  const fetchSupportMessages = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setMessages([]);
        setLoading(false);
        return;
      }

      const res = await fetch(API_URL("/api/support-messages/"));
      const data = await res.json();

      const driverMessages = (Array.isArray(data) ? data : []).filter(
        (item) => Number(item.driver) === Number(loggedInDriver.id)
      );

      setMessages(driverMessages);
    } catch (error) {
      console.error("Support fetch error:", error);
      setMessages([]);
      showToast("Failed to load support messages.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!driver) {
      showToast("Driver profile not found.", "error");
      return;
    }

    if (!subject.trim() || !messageText.trim()) {
      showToast("Please enter both subject and message.", "warning");
      return;
    }

    try {
      setSending(true);

      const payload = new FormData();
      payload.append("driver", driver.id);
      payload.append("subject", subject.trim());
      payload.append("message", messageText.trim());
      payload.append("status", "open");

      if (issueAttachment) {
        payload.append("issue_attachment", issueAttachment);
      }

      const res = await fetch(API_URL("/api/support-messages/"), {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        throw new Error("Failed to send support message");
      }

      setSubject("");
      setMessageText("");
      setIssueAttachment(null);

      const fileInput = document.getElementById("issue-attachment-input");
      if (fileInput) {
        fileInput.value = "";
      }

      showToast("Support message sent successfully.", "success");
      await fetchSupportMessages();
    } catch (error) {
      console.error("Support send error:", error);
      showToast("Failed to send support message.", "error");
    } finally {
      setSending(false);
    }
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "resolved") {
      return "support-badge-resolved";
    }

    return "support-badge-open";
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString();
  };

  const openCount = messages.filter(
    (item) => String(item.status).toLowerCase() === "open"
  ).length;

  const resolvedCount = messages.filter(
    (item) => String(item.status).toLowerCase() === "resolved"
  ).length;

  const repliedCount = messages.filter(
    (item) => String(item.admin_reply || "").trim() !== ""
  ).length;

  if (loading) {
    return (
      <div className="support-loading-card support-reveal">
        <DriverToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
        <h4>Loading support...</h4>
        <p>Please wait while we fetch your support requests.</p>
      </div>
    );
  }

  return (
    <div className="support-page">
      <DriverToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <div className="support-hero support-reveal">
        <div className="support-hero-inner">
          <div>
            <div className="support-kicker">
              <span className="support-status-dot" />
              Driver Panel Overview
            </div>

            <h2 className="support-hero-title">Support</h2>

            <p className="support-hero-subtitle">
              Contact admin for help, report issues, upload attachments, and
              track replies related to your account or assigned car.
            </p>
          </div>

          <div className="support-hero-glass">
            <span>Logged in as</span>
            <strong>{driver?.user_name || "Driver"}</strong>
          </div>
        </div>
      </div>

      <div className="support-stats-grid support-reveal support-delay-1">
        <div className="support-stat-card support-stat-blue">
          <div className="support-stat-icon-bg" />
          <div className="support-stat-icon">
            <IconifyIcon icon="mdi:message-text-outline" />
          </div>

          <p className="support-stat-label">Total Messages</p>
          <strong className="support-stat-value">{messages.length}</strong>
          <span className="support-stat-note">All support requests</span>
        </div>

        <div className="support-stat-card support-stat-orange">
          <div className="support-stat-icon-bg" />
          <div className="support-stat-icon">
            <IconifyIcon icon="mdi:message-alert-outline" />
          </div>

          <p className="support-stat-label">Open Requests</p>
          <strong className="support-stat-value">{openCount}</strong>
          <span className="support-stat-note">Waiting for resolution</span>
        </div>

        <div className="support-stat-card support-stat-purple">
          <div className="support-stat-icon-bg" />
          <div className="support-stat-icon">
            <IconifyIcon icon="mdi:check-decagram-outline" />
          </div>

          <p className="support-stat-label">Resolved</p>
          <strong className="support-stat-value">{resolvedCount}</strong>
          <span className="support-stat-note">Completed requests</span>
        </div>

        <div className="support-stat-card support-stat-indigo">
          <div className="support-stat-icon-bg" />
          <div className="support-stat-icon">
            <IconifyIcon icon="mdi:reply-outline" />
          </div>

          <p className="support-stat-label">Replies Received</p>
          <strong className="support-stat-value">{repliedCount}</strong>
          <span className="support-stat-note">Admin responses</span>
        </div>
      </div>

      <div className="support-shell support-reveal support-delay-2">
        <div className="support-card support-form-card">
          <div className="support-card-head">
            <div>
              <h4 className="support-section-title">Send Support Request</h4>
              <p className="support-section-subtitle">
                Describe your issue clearly so admin can help you faster.
              </p>
            </div>

            <div className="support-header-icon">
              <IconifyIcon icon="mdi:message-question-outline" />
            </div>
          </div>

          <div className="support-form-grid">
            <div className="support-field">
              <label>Subject</label>
              <input
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="support-input"
              />
            </div>

            <div className="support-field">
              <label>Message</label>
              <textarea
                rows="7"
                placeholder="Write your issue, repair concern, or question here"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="support-textarea"
              />
            </div>

            <div className="support-field">
              <label>Issue Attachment Optional</label>
              <input
                id="issue-attachment-input"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setIssueAttachment(e.target.files?.[0] || null)}
                className="support-file-input"
              />

              <small className="support-help-text">
                Upload an issue photo, repair image, or PDF if available.
              </small>

              {issueAttachment && (
                <div className="support-selected-file">
                  <IconifyIcon icon="mdi:paperclip" />
                  Selected: {issueAttachment.name}
                </div>
              )}
            </div>

            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="support-submit-btn"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>

        <div className="support-card">
          <div className="support-card-head">
            <div>
              <h4 className="support-section-title">Previous Messages</h4>
              <p className="support-section-subtitle">
                Track your support requests and view admin replies.
              </p>
            </div>

            <div className="support-header-icon">
              <IconifyIcon icon="mdi:history" />
            </div>
          </div>

          <div className="support-message-list">
            {messages.length > 0 ? (
              messages.map((item) => (
                <div className="support-message-card" key={item.id}>
                  <div className="support-message-top">
                    <div className="support-message-title-wrap">
                      <div className="support-message-icon">
                        <IconifyIcon icon="mdi:message-text-outline" />
                      </div>

                      <div>
                        <h4 className="support-message-title">{item.subject}</h4>
                        <p className="support-message-meta">
                          Sent: {formatDateTime(item.created_at)}
                        </p>
                      </div>
                    </div>

                    <span className={`support-badge ${getStatusClass(item.status)}`}>
                      {item.status || "open"}
                    </span>
                  </div>

                  <div className="support-message-section">
                    <p className="support-message-label">Your Message</p>
                    <div className="support-message-box">{item.message}</div>
                  </div>

                  <div className="support-message-section">
                    <p className="support-message-label">Attachment</p>

                    {item.issue_attachment_url ? (
                      <a
                        href={item.issue_attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="support-attachment-btn"
                      >
                        <IconifyIcon icon="mdi:file-eye-outline" />
                        View Attachment
                      </a>
                    ) : (
                      <div className="support-message-box support-message-box-empty">
                        No attachment uploaded.
                      </div>
                    )}
                  </div>

                  <div className="support-message-section">
                    <p className="support-message-label">Admin Reply</p>

                    {item.admin_reply ? (
                      <div className="support-message-box support-message-box-admin">
                        {item.admin_reply}
                      </div>
                    ) : (
                      <div className="support-message-box support-message-box-empty">
                        No reply yet.
                      </div>
                    )}
                  </div>

                  <div className="support-message-footer">
                    <small>Sent: {formatDateTime(item.created_at)}</small>

                    {item.replied_at && (
                      <small className="support-replied-time">
                        Replied: {formatDateTime(item.replied_at)}
                      </small>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="support-empty-card">
                <div className="support-empty-icon">
                  <IconifyIcon icon="mdi:message-off-outline" />
                </div>
                <h4>No support messages found</h4>
                <p>
                  Once you send a support request, your conversation history will
                  appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;