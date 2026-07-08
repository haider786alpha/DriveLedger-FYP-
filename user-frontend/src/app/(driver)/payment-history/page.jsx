import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import DriverToast from "@/components/DriverToast";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./PaymentHistory.css";

const PaymentHistory = () => {
  const [driver, setDriver] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchPayments = useCallback(
    async (signal) => {
      try {
        setLoading(true);

        const loggedInDriver = await getLoggedInDriver();

        if (signal?.aborted) return;

        setDriver(loggedInDriver);

        if (!loggedInDriver?.id) {
          setPayments([]);
          return;
        }

        const assignmentsData = await fetchJson(API_URL("/api/assignments/"), signal);

        if (signal?.aborted) return;

        const assignments = safeArray(assignmentsData);

        const driverAssignments = assignments.filter(
          (item) => Number(item.driver) === Number(loggedInDriver.id)
        );

        if (driverAssignments.length === 0) {
          setPayments([]);
          return;
        }

        const assignmentIds = driverAssignments.map((item) => Number(item.id));

        const paymentsData = await fetchJson(API_URL("/api/payments/"), signal);

        if (signal?.aborted) return;

        const allPayments = safeArray(paymentsData);

        const driverPayments = allPayments.filter(
          (payment) =>
            assignmentIds.includes(Number(payment.assignment)) &&
            String(payment.status || "").toLowerCase() === "paid"
        );

        setPayments(driverPayments);
      } catch (error) {
        if (error?.name === "AbortError") return;

        console.error("Payment history error:", error);
        setPayments([]);
        showToast("Failed to load payment history.", "error");
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

    fetchPayments(controller.signal);

    return () => {
      controller.abort();

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [fetchPayments]);

  const sortedPayments = useMemo(() => {
    return [...payments].sort(
      (a, b) => new Date(b.payment_date || 0) - new Date(a.payment_date || 0)
    );
  }, [payments]);

  const totalPaidAmount = useMemo(() => {
    return payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [payments]);

  const latestPayment = useMemo(() => {
    return sortedPayments.length > 0 ? sortedPayments[0] : null;
  }, [sortedPayments]);

  const averagePayment = useMemo(() => {
    return payments.length > 0 ? Math.round(totalPaidAmount / payments.length) : 0;
  }, [payments.length, totalPaidAmount]);

  const downloadPaymentSummary = () => {
    if (!payments || payments.length === 0) {
      showToast("No payment records available to download.", "warning");
      return;
    }

    const headers = ["ID", "Amount", "Payment Date", "Status", "Remarks"];

    const rows = sortedPayments.map((payment) => [
      payment.id || "-",
      payment.amount || "0",
      payment.payment_date || "-",
      payment.status || "paid",
      payment.remarks || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `payment-summary-${driver?.user_name || "driver"}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast("Payment summary downloaded successfully.", "success");
  };

  const formatAmount = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return dateValue;

    return dateValue;
  };

  if (loading) {
    return (
      <div className="payment-history-loading-card payment-history-reveal">
        <DriverToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />

        <h4>Loading payment history...</h4>
        <p>Please wait while we fetch your completed payment records.</p>
      </div>
    );
  }

  return (
    <div className="payment-history-page">
      <DriverToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <div className="payment-history-hero payment-history-reveal">
        <div className="payment-history-hero-inner">
          <div>
            <div className="payment-history-kicker">
              <span className="payment-history-status-dot" />
              Driver Panel Overview
            </div>

            <h2 className="payment-history-hero-title">Payment History</h2>

            <p className="payment-history-hero-subtitle">
              Review all completed payment records linked to your assignments,
              track paid amounts, and download your payment summary whenever needed.
            </p>
          </div>

          <div className="payment-history-hero-actions">
            <div className="payment-history-hero-glass">
              <span>Logged in as</span>
              <strong>{driver?.user_name || "Driver"}</strong>
            </div>

            <button
              onClick={downloadPaymentSummary}
              disabled={payments.length === 0}
              className="payment-history-download-btn"
            >
              Download Summary
            </button>
          </div>
        </div>
      </div>

      <div className="payment-history-stats-grid payment-history-reveal payment-history-delay-1">
        <div className="payment-history-stat-card payment-history-stat-blue">
          <div className="payment-history-stat-icon-bg" />
          <div className="payment-history-stat-icon">
            <IconifyIcon icon="mdi:credit-card-check-outline" />
          </div>

          <p className="payment-history-stat-label">Paid Records</p>
          <strong className="payment-history-stat-value">{payments.length}</strong>
          <span className="payment-history-stat-note">Completed payments</span>
        </div>

        <div className="payment-history-stat-card payment-history-stat-purple">
          <div className="payment-history-stat-icon-bg" />
          <div className="payment-history-stat-icon">
            <IconifyIcon icon="mdi:cash-multiple" />
          </div>

          <p className="payment-history-stat-label">Total Paid</p>
          <strong className="payment-history-stat-value">
            {formatAmount(totalPaidAmount)}
          </strong>
          <span className="payment-history-stat-note">All paid records</span>
        </div>

        <div className="payment-history-stat-card payment-history-stat-indigo">
          <div className="payment-history-stat-icon-bg" />
          <div className="payment-history-stat-icon">
            <IconifyIcon icon="mdi:chart-bar" />
          </div>

          <p className="payment-history-stat-label">Average Payment</p>
          <strong className="payment-history-stat-value">
            {formatAmount(averagePayment)}
          </strong>
          <span className="payment-history-stat-note">Estimated average</span>
        </div>

        <div className="payment-history-stat-card payment-history-stat-slate">
          <div className="payment-history-stat-icon-bg" />
          <div className="payment-history-stat-icon">
            <IconifyIcon icon="mdi:check-decagram-outline" />
          </div>

          <p className="payment-history-stat-label">Payment Status</p>
          <strong className="payment-history-stat-value">Paid Only</strong>
          <span className="payment-history-stat-note">
            {latestPayment
              ? `Latest: ${formatDate(latestPayment.payment_date)}`
              : "No paid records"}
          </span>
        </div>
      </div>

      <div className="payment-history-card payment-history-reveal payment-history-delay-2">
        <div className="payment-history-card-head">
          <div>
            <h4 className="payment-history-section-title">Completed Payments</h4>
            <p className="payment-history-section-subtitle">
              A clean view of your successful payment history.
            </p>
          </div>

          <div className="payment-history-total-chip">
            <span>Total Records</span>
            <strong>{payments.length}</strong>
          </div>
        </div>

        {sortedPayments.length > 0 ? (
          <>
            <div className="payment-history-table-wrap">
              <table className="payment-history-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <strong>#{payment.id}</strong>
                      </td>
                      <td>
                        <strong>{formatAmount(payment.amount)}</strong>
                      </td>
                      <td>{formatDate(payment.payment_date)}</td>
                      <td>
                        <span className="payment-history-badge">
                          {payment.status || "paid"}
                        </span>
                      </td>
                      <td>{payment.remarks || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="payment-history-mobile-list">
              {sortedPayments.map((payment) => (
                <div className="payment-history-mobile-card" key={payment.id}>
                  <div className="payment-history-mobile-row">
                    <span>Payment ID</span>
                    <strong>#{payment.id}</strong>
                  </div>

                  <div className="payment-history-mobile-row">
                    <span>Amount</span>
                    <strong>{formatAmount(payment.amount)}</strong>
                  </div>

                  <div className="payment-history-mobile-row">
                    <span>Date</span>
                    <strong>{formatDate(payment.payment_date)}</strong>
                  </div>

                  <div className="payment-history-mobile-row">
                    <span>Status</span>
                    <strong>
                      <span className="payment-history-badge">
                        {payment.status || "paid"}
                      </span>
                    </strong>
                  </div>

                  <div className="payment-history-mobile-row">
                    <span>Remarks</span>
                    <strong>{payment.remarks || "-"}</strong>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="payment-history-empty-card">
            <div className="payment-history-empty-icon">
              <IconifyIcon icon="mdi:credit-card-off-outline" />
            </div>

            <h4>No payments found</h4>
            <p>
              Once paid payment records are available for your assignments, they
              will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;