import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const fetchJson = async (url, signal) => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
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

  const fetchSupportMessages = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setPageError("");

        const loggedInDriver = await getLoggedInDriver();

        if (signal?.aborted) return;

        setDriver(loggedInDriver);

        if (!loggedInDriver?.id) {
          setMessages([]);
          return;
        }

        const data = await fetchJson(API_URL("/api/support-messages/"), signal);

        if (signal?.aborted) return;

        const supportMessages = safeArray(data);

        const driverMessages = supportMessages.filter(
          (item) => Number(item.driver) === Number(loggedInDriver.id)
        );

        setMessages(driverMessages);
      } catch (error) {
        if (error?.name === "AbortError") return;

        console.error("Support fetch error:", error);
        setMessages([]);
        setPageError("Support messages could not be loaded. Please refresh the page.");
        showToast("Failed to load support messages.", "error");
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

    fetchSupportMessages(controller.signal);

    return () => {
      controller.abort();

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [fetchSupportMessages]);

  const handleSendMessage = async () => {
    if (sending) return;

    if (!driver?.id) {
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

      let data = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            data?.message ||
            "Failed to send support message"
        );
      }

      setSubject("");
      setMessageText("");
      setIssueAttachment(null);

      const fileInput = document.getElementById("issue-attachment-input");

      if (fileInput) {
        fileInput.value = "";
      }

      if (data?.id) {
        setMessages((prev) => [data, ...prev]);
      } else {
        const controller = new AbortController();
        await fetchSupportMessages(controller.signal);
      }

      showToast("Support message sent successfully.", "success");
    } catch (error) {
      console.error("Support send error:", error);
      showToast(error.message || "Failed to send support message.", "error");
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

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString();
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  }, [messages]);

  const openCount = useMemo(() => {
    return messages.filter(
      (item) => String(item.status || "").toLowerCase() === "open"
    ).length;
  }, [messages]);

  const resolvedCount = useMemo(() => {
    return messages.filter(
      (item) => String(item.status || "").toLowerCase() === "resolved"
    ).length;
  }, [messages]);

  const repliedCount = useMemo(() => {
    return messages.filter((item) => String(item.admin_reply || "").trim() !== "")
      .length;
  }, [messages]);

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

      {pageError && (
        <div className="support-alert-card support-reveal support-delay-1">
          <div className="support-alert-icon">
            <IconifyIcon icon="mdi:alert-circle-outline" />
          </div>

          <div>
            <strong>Unable to load support messages.</strong>
            <p>{pageError}</p>
          </div>
        </div>
      )}

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

        <div className="support-stat-card support-stat-amber">
          <div className="support-stat-icon-bg" />
          <div className="support-stat-icon">
            <IconifyIcon icon="mdi:message-alert-outline" />
          </div>

          <p className="support-stat-label">Open Requests</p>
          <strong className="support-stat-value">{openCount}</strong>
          <span className="support-stat-note">Waiting for resolution</span>
        </div>

        <div className="support-stat-card support-stat-indigo">
          <div className="support-stat-icon-bg" />
          <div className="support-stat-icon">
            <IconifyIcon icon="mdi:check-decagram-outline" />
          </div>

          <p className="support-stat-label">Resolved</p>
          <strong className="support-stat-value">{resolvedCount}</strong>
          <span className="support-stat-note">Completed requests</span>
        </div>

        <div className="support-stat-card support-stat-slate">
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
            {sortedMessages.length > 0 ? (
              sortedMessages.map((item) => (
                <div className="support-message-card" key={item.id}>
                  <div className="support-message-top">
                    <div className="support-message-title-wrap">
                      <div className="support-message-icon">
                        <IconifyIcon icon="mdi:message-text-outline" />
                      </div>

                      <div>
                        <h4 className="support-message-title">
                          {item.subject || "Support Request"}
                        </h4>
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
                    <div className="support-message-box">
                      {item.message || "No message available."}
                    </div>
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