import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { API_URL } from "../../helpers/apiConfig";
import "./Reports.css";

const defaultBookingSummary = {
  total_requests: 0,
  pending_requests: 0,
  contacted_requests: 0,
  confirmed_requests: 0,
  completed_requests: 0,
  cancelled_requests: 0,
  total_booking_value: 0,
  pending_value: 0,
  contacted_value: 0,
  confirmed_value: 0,
  completed_earnings: 0,
  cancelled_value: 0,
};

const getAccessToken = () => {
  const accessToken = localStorage.getItem("access");

  if (accessToken) return accessToken;

  try {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    return authUser?.token || "";
  } catch (error) {
    return "";
  }
};

const getRefreshToken = () => localStorage.getItem("refresh") || "";

const saveAccessToken = (newAccessToken) => {
  localStorage.setItem("access", newAccessToken);

  try {
    const authUser = JSON.parse(localStorage.getItem("authUser"));

    if (authUser) {
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          ...authUser,
          token: newAccessToken,
        })
      );
    }
  } catch (error) {
    // ignore
  }
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Admin session expired.");
  }

  const response = await fetch(API_URL("/api/token/refresh/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data?.access) {
    throw new Error("Admin session expired.");
  }

  saveAccessToken(data.access);

  return data.access;
};

const authFetch = async (path, options = {}, retry = true) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Admin token not found.");
  }

  const response = await fetch(API_URL(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 && retry) {
    const newAccessToken = await refreshAccessToken();

    return fetch(API_URL(path), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newAccessToken}`,
        ...(options.headers || {}),
      },
    });
  }

  return response;
};

const normalizeResponse = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res?.data?.results)) return res.data.results;
  return [];
};

const formatAmount = (value) => Number(value || 0).toLocaleString("en-PK");

const Reports = () => {
  const reportRef = useRef(null);

  const [bookingSummary, setBookingSummary] = useState(defaultBookingSummary);
  const [data, setData] = useState({
    drivers: [],
    cars: [],
    assignments: [],
    payments: [],
    expenses: [],
    repairs: [],
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchBookingSummary = async () => {
    try {
      const response = await authFetch("/api/city-bookings/summary/", {
        method: "GET",
      });

      const summaryData = await response.json();

      if (!response.ok) {
        throw new Error("Booking summary request failed.");
      }

      setBookingSummary({
        ...defaultBookingSummary,
        ...summaryData,
      });
    } catch (error) {
      console.warn("Booking summary unavailable:", error);
      setBookingSummary(defaultBookingSummary);
    }
  };

  const fetchReportData = async () => {
    try {
      const [
        driversRes,
        carsRes,
        assignmentsRes,
        paymentsRes,
        expensesRes,
        repairsRes,
      ] = await Promise.all([
        axios.get(API_URL("/api/drivers/")),
        axios.get(API_URL("/api/cars/")),
        axios.get(API_URL("/api/assignments/")),
        axios.get(API_URL("/api/payments/")),
        axios.get(API_URL("/api/expenses/")),
        axios.get(API_URL("/api/repairs/")),
      ]);

      setData({
        drivers: normalizeResponse(driversRes),
        cars: normalizeResponse(carsRes),
        assignments: normalizeResponse(assignmentsRes),
        payments: normalizeResponse(paymentsRes),
        expenses: normalizeResponse(expensesRes),
        repairs: normalizeResponse(repairsRes),
      });

      await fetchBookingSummary();
    } catch (error) {
      console.error("Reports error:", error);

      setData({
        drivers: [],
        cars: [],
        assignments: [],
        payments: [],
        expenses: [],
        repairs: [],
      });
    }
  };

  const handleDownloadReport = async () => {
    const element = reportRef.current;

    if (!element) return;

    document.body.classList.add("reports-pdf-mode");

    const options = {
      margin: [8, 8, 8, 8],
      filename: `DriveLedger-Report-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        windowWidth: 1400,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
        before: ".pdf-page-break-before",
        after: ".pdf-page-break-after",
        avoid: ".pdf-avoid-break",
      },
    };

    try {
      await html2pdf().set(options).from(element).save();
    } finally {
      document.body.classList.remove("reports-pdf-mode");
    }
  };

  const totalPayments = data.payments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpenses = data.expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const completedBookingEarnings = Number(
    bookingSummary.completed_earnings || 0
  );

  const totalRevenue = totalPayments + completedBookingEarnings;

  const completedRepairCost = data.repairs
    .filter((item) => item.status === "completed")
    .reduce(
      (sum, item) => sum + Number(item.actual_cost || item.estimated_cost || 0),
      0
    );

  const pendingRepairCost = data.repairs
    .filter((item) => item.status !== "completed")
    .reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);

  const profit = totalRevenue - totalExpenses;

  const paidCount = data.payments.filter((p) => p.status === "paid").length;
  const unpaidCount = data.payments.filter((p) => p.status === "unpaid").length;

  const activeAssignments = data.assignments.filter(
    (a) => a.status === "active"
  ).length;

  const pendingRepairs = data.repairs.filter(
    (r) => r.status !== "completed"
  ).length;

  const getMonthKey = (date) => {
    if (!date) return "Unknown Date";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return "Unknown Date";

    return d.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const monthlyReport = {};

  data.payments.forEach((p) => {
    const month = getMonthKey(p.payment_date);

    if (!monthlyReport[month]) {
      monthlyReport[month] = { income: 0, expense: 0 };
    }

    monthlyReport[month].income += Number(p.amount || 0);
  });

  data.expenses.forEach((e) => {
    const month = getMonthKey(e.expense_date);

    if (!monthlyReport[month]) {
      monthlyReport[month] = { income: 0, expense: 0 };
    }

    monthlyReport[month].expense += Number(e.amount || 0);
  });

  const monthlyRows = Object.entries(monthlyReport).map(([month, value]) => ({
    month,
    income: value.income,
    expense: value.expense,
    profit: value.income - value.expense,
  }));

  const bestMonth = monthlyRows.reduce(
    (best, item) => (!best || item.profit > best.profit ? item : best),
    null
  );

  const worstMonth = monthlyRows.reduce(
    (worst, item) => (!worst || item.profit < worst.profit ? item : worst),
    null
  );

  const maxMonthlyValue = Math.max(
    ...monthlyRows.map((m) => Math.max(m.income, m.expense)),
    1
  );

  const financeTotal = totalRevenue + totalExpenses;
  const revenueWidth = financeTotal ? (totalRevenue / financeTotal) * 100 : 0;
  const expenseWidth = financeTotal ? (totalExpenses / financeTotal) * 100 : 0;

  return (
    <div className="page-content driveledger-reports">
      <div className="container-fluid">
        <div className="reports-hero reports-reveal reports-delay-1">
          <div>
            <div className="reports-hero-pill">
              <span className="dl-status-dot"></span>
              Business Performance Overview
            </div>

            <h4>Reports & Analytics</h4>
            <p>
              Monthly profit, booking earnings, financial health, repair risk,
              payment status and operational summary.
            </p>
          </div>

          <button
            type="button"
            className="reports-print-btn"
            onClick={handleDownloadReport}
          >
            Download Summary
          </button>
        </div>

        <div ref={reportRef} className="reports-download-area">
          {profit < 0 && (
            <ReportAlert
              type="danger"
              title="Loss Alert"
              message={`Your expenses are higher than total revenue. Current loss is Rs. ${formatAmount(
                Math.abs(profit)
              )}.`}
            />
          )}

          {pendingRepairCost > 0 && (
            <ReportAlert
              type="warning"
              title="Repair Risk"
              message={`Pending repair estimate is Rs. ${formatAmount(
                pendingRepairCost
              )}. This may affect future profit.`}
            />
          )}

          <div className="row g-3 reports-reveal reports-delay-2 pdf-avoid-break">
            <ReportCard
              title="Total Drivers"
              value={data.drivers.length}
              icon="👤"
            />
            <ReportCard title="Total Cars" value={data.cars.length} icon="🚗" />
            <ReportCard
              title="Active Assignments"
              value={activeAssignments}
              icon="🔗"
            />
            <ReportCard
              title="Booking Requests"
              value={bookingSummary.total_requests}
              icon="📅"
            />
          </div>

          <div className="row g-3 mt-1 reports-reveal reports-delay-3 pdf-avoid-break">
            <MoneyCard
              title="Total Payments"
              value={totalPayments}
              tone="positive"
              icon="💰"
            />
            <MoneyCard
              title="Completed Booking Earnings"
              value={completedBookingEarnings}
              tone="positive"
              icon="📅"
            />
            <MoneyCard
              title="Total Expenses"
              value={totalExpenses}
              tone="negative"
              icon="📉"
            />
            <MoneyCard
              title="Net Profit / Loss"
              value={profit}
              tone={profit >= 0 ? "positive" : "negative"}
              icon={profit >= 0 ? "📈" : "⚠️"}
            />
          </div>

          <div className="report-card reports-reveal reports-delay-3 pdf-avoid-break">
            <div className="report-card-head">
              <div>
                <h5>Booking Earnings Report</h5>
                <p>
                  Completed bookings are counted as actual revenue. Pending and
                  confirmed bookings are shown as future pipeline value.
                </p>
              </div>
            </div>

            <div className="booking-report-grid">
              <BookingReportItem
                label="Total Booking Value"
                value={`Rs. ${formatAmount(bookingSummary.total_booking_value)}`}
                tone="report-info"
              />
              <BookingReportItem
                label="Pending Value"
                value={`Rs. ${formatAmount(bookingSummary.pending_value)}`}
                tone="report-warning"
              />
              <BookingReportItem
                label="Confirmed Earnings"
                value={`Rs. ${formatAmount(bookingSummary.confirmed_value)}`}
                tone="report-info"
              />
              <BookingReportItem
                label="Completed Earnings"
                value={`Rs. ${formatAmount(bookingSummary.completed_earnings)}`}
                tone="report-positive"
              />
              <BookingReportItem
                label="Cancelled Lost Value"
                value={`Rs. ${formatAmount(bookingSummary.cancelled_value)}`}
                tone="report-negative"
              />
              <BookingReportItem
                label="Completed Bookings"
                value={bookingSummary.completed_requests}
                tone="report-positive"
              />
            </div>
          </div>

          <div className="report-card reports-reveal reports-delay-3 pdf-avoid-break">
            <div className="report-card-head">
              <div>
                <h5>Financial Distribution</h5>
                <p>
                  Net profit uses payments plus completed booking earnings minus
                  total expenses. Completed repairs are shown separately for
                  repair cost visibility.
                </p>
              </div>
            </div>

            <div className="report-distribution">
              <div
                className="report-distribution-income"
                style={{ width: `${revenueWidth}%` }}
              >
                Revenue
              </div>

              <div
                className="report-distribution-expense"
                style={{ width: `${expenseWidth}%` }}
              >
                Expenses
              </div>
            </div>

            <div className="report-distribution-footer">
              <span>Revenue: Rs. {formatAmount(totalRevenue)}</span>
              <span>Costs: Rs. {formatAmount(totalExpenses)}</span>
            </div>
          </div>

          <div className="row g-3 mt-1 reports-reveal reports-delay-4 pdf-avoid-break">
            <SummaryBox
              title="Payment Status Summary"
              lines={[
                ["Paid Payments", paidCount, "report-positive"],
                ["Unpaid Payments", unpaidCount, "report-negative"],
                ["Total Payment Records", data.payments.length, ""],
              ]}
            />

            <SummaryBox
              title="Monthly Performance"
              lines={[
                [
                  "Best Month",
                  bestMonth
                    ? `${bestMonth.month} — Rs. ${formatAmount(
                        bestMonth.profit
                      )}`
                    : "-",
                  "report-positive",
                ],
                [
                  "Weakest Month",
                  worstMonth
                    ? `${worstMonth.month} — Rs. ${formatAmount(
                        worstMonth.profit
                      )}`
                    : "-",
                  "report-negative",
                ],
                [
                  "Pending Repair Estimate",
                  `Rs. ${formatAmount(pendingRepairCost)}`,
                  "report-warning",
                ],
              ]}
            />

            <SummaryBox
              title="Booking Pipeline Summary"
              lines={[
                [
                  "Pending Requests",
                  `${bookingSummary.pending_requests} — Rs. ${formatAmount(
                    bookingSummary.pending_value
                  )}`,
                  "report-warning",
                ],
                [
                  "Confirmed Requests",
                  `${bookingSummary.confirmed_requests} — Rs. ${formatAmount(
                    bookingSummary.confirmed_value
                  )}`,
                  "report-info",
                ],
                [
                  "Cancelled Requests",
                  `${bookingSummary.cancelled_requests} — Rs. ${formatAmount(
                    bookingSummary.cancelled_value
                  )}`,
                  "report-negative",
                ],
              ]}
            />

            <SummaryBox
              title="Repair Workload"
              lines={[
                ["Pending Repairs", pendingRepairs, "report-warning"],
                [
                  "Completed Repair Cost",
                  `Rs. ${formatAmount(completedRepairCost)}`,
                  "report-negative",
                ],
                ["Total Repair Records", data.repairs.length, ""],
              ]}
            />
          </div>

          <div className="report-card pdf-avoid-break">
            <div className="report-card-head">
              <div>
                <h5>Monthly Profit Graph</h5>
                <p>
                  Green = income, red = expenses, final value = monthly
                  profit/loss.
                </p>
              </div>
            </div>

            {monthlyRows.length > 0 ? (
              monthlyRows.map((month) => (
                <div key={month.month} className="report-month-row">
                  <div className="report-month-top">
                    <strong>{month.month}</strong>
                    <strong
                      className={
                        month.profit >= 0
                          ? "report-positive"
                          : "report-negative"
                      }
                    >
                      Rs. {formatAmount(month.profit)}
                    </strong>
                  </div>

                  <div className="report-bar-track">
                    <div
                      className="report-bar report-bar-income"
                      style={{
                        width: `${(month.income / maxMonthlyValue) * 100}%`,
                      }}
                    >
                      Income Rs. {formatAmount(month.income)}
                    </div>
                  </div>

                  <div className="report-bar-track">
                    <div
                      className="report-bar report-bar-expense"
                      style={{
                        width: `${(month.expense / maxMonthlyValue) * 100}%`,
                      }}
                    >
                      Expense Rs. {formatAmount(month.expense)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="report-empty">No monthly data available.</p>
            )}
          </div>

          <RecentTable
            title="Recent Payments"
            rows={data.payments.slice(-5).reverse()}
            columns={["#", "Amount", "Date", "Status", "Remarks"]}
            render={(item, index) => (
              <>
                <td>{index + 1}</td>
                <td>Rs. {formatAmount(item.amount)}</td>
                <td>{item.payment_date || "-"}</td>
                <td>
                  <span
                    className={`report-badge ${
                      item.status === "paid"
                        ? "report-badge-success"
                        : "report-badge-danger"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>{item.remarks || "-"}</td>
              </>
            )}
          />

          <RecentTable
            title="Recent Expenses"
            rows={data.expenses.slice(-5).reverse()}
            columns={["#", "Amount", "Date", "Category", "Notes"]}
            render={(item, index) => (
              <>
                <td>{index + 1}</td>
                <td>Rs. {formatAmount(item.amount)}</td>
                <td>{item.expense_date || "-"}</td>
                <td>
                  <span className="report-badge report-badge-info">
                    {item.category}
                  </span>
                </td>
                <td>{item.notes || "-"}</td>
              </>
            )}
          />

          <RecentTable
            title="Recent Repairs"
            rows={data.repairs.slice(-5).reverse()}
            columns={["#", "Issue", "Priority", "Status", "Estimated Cost"]}
            render={(item, index) => (
              <>
                <td>{index + 1}</td>
                <td>{item.issue}</td>
                <td>
                  <span className="report-badge report-badge-info">
                    {item.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`report-badge ${
                      item.status === "completed"
                        ? "report-badge-success"
                        : "report-badge-warning"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>Rs. {formatAmount(item.estimated_cost)}</td>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const ReportAlert = ({ type, title, message }) => (
  <div
    className={`report-alert ${
      type === "danger" ? "report-alert-danger" : "report-alert-warning"
    }`}
  >
    <div className="report-alert-icon">!</div>
    <div>
      <strong>{title}:</strong> {message}
    </div>
  </div>
);

const ReportCard = ({ title, value, icon }) => (
  <div className="col-xl-3 col-md-6">
    <div className="report-kpi-card">
      <div className="report-card-icon">{icon}</div>
      <div className="report-kpi-label">{title}</div>
      <h2 className="report-kpi-value">{value}</h2>
    </div>
  </div>
);

const MoneyCard = ({ title, value, tone, icon }) => {
  const toneClass =
    tone === "positive"
      ? "report-positive"
      : tone === "negative"
      ? "report-negative"
      : "report-warning";

  return (
    <div className="col-xl-3 col-md-6">
      <div className="report-money-card">
        <div className="report-card-icon">{icon}</div>
        <div className="report-money-label">{title}</div>
        <h4 className={`report-money-value ${toneClass}`}>
          Rs. {formatAmount(value)}
        </h4>
      </div>
    </div>
  );
};

const BookingReportItem = ({ label, value, tone }) => (
  <div className="booking-report-item">
    <span>{label}</span>
    <strong className={tone}>{value}</strong>
  </div>
);

const SummaryBox = ({ title, lines }) => (
  <div className="col-xl-3 col-md-6">
    <div className="report-summary-box">
      <h5>{title}</h5>

      {lines.map(([label, value, color]) => (
        <div className="report-summary-row" key={label}>
          <span>{label}</span>
          <strong className={color}>{value}</strong>
        </div>
      ))}
    </div>
  </div>
);

const RecentTable = ({ title, rows, columns, render }) => (
  <div className="report-card pdf-avoid-break">
    <div className="report-card-head">
      <div>
        <h5>{title}</h5>
        <p>Latest {rows.length} record(s)</p>
      </div>
    </div>

    <div className="report-table-wrap">
      <table className="table table-hover align-middle report-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((item, index) => (
              <tr key={item.id || index}>{render(item, index)}</tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="report-empty">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default Reports;