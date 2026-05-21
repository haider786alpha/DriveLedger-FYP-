import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import "./Dashboard.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

const getRefreshToken = () => {
  return localStorage.getItem("refresh") || "";
};

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
    // ignore localStorage parse error
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

const formatAmount = (value) => {
  return Number(value || 0).toLocaleString("en-PK");
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
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
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const revealElements = document.querySelectorAll(".dl-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("dl-visible");
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      revealElements.forEach((element) => observer.unobserve(element));
    };
  }, [loading]);

  const normalizeResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.data?.results)) return response.data.results;
    return [];
  };

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

  const fetchDashboardData = async () => {
    try {
      const [drivers, cars, assignments, payments, expenses, repairs] =
        await Promise.all([
          axios.get(API_URL("/api/drivers/")),
          axios.get(API_URL("/api/cars/")),
          axios.get(API_URL("/api/assignments/")),
          axios.get(API_URL("/api/payments/")),
          axios.get(API_URL("/api/expenses/")),
          axios.get(API_URL("/api/repairs/")),
        ]);

      setData({
        drivers: normalizeResponse(drivers),
        cars: normalizeResponse(cars),
        assignments: normalizeResponse(assignments),
        payments: normalizeResponse(payments),
        expenses: normalizeResponse(expenses),
        repairs: normalizeResponse(repairs),
      });

      await fetchBookingSummary();
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPayments = data.payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const totalExpenses = data.expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const completedBookingEarnings = Number(
    bookingSummary.completed_earnings || 0
  );

  const totalRevenue = totalPayments + completedBookingEarnings;

  const profit = totalRevenue - totalExpenses;

  const activeAssignments = data.assignments.filter(
    (a) => String(a.status).toLowerCase() === "active"
  ).length;

  const availableCars = Math.max(data.cars.length - activeAssignments, 0);

  const pendingRepairs = data.repairs.filter(
    (r) => String(r.status).toLowerCase() !== "completed"
  ).length;

  const completedRepairs = data.repairs.filter(
    (r) => String(r.status).toLowerCase() === "completed"
  ).length;

  const paidPayments = data.payments.filter(
    (p) => String(p.status).toLowerCase() === "paid"
  ).length;

  const unpaidPayments = data.payments.filter(
    (p) => String(p.status).toLowerCase() === "unpaid"
  ).length;

  const fleetChart = [
    { name: "Assigned", value: activeAssignments },
    { name: "Available", value: availableCars },
  ];

  const financeChart = [
    { name: "Payments", amount: totalPayments },
    { name: "Bookings", amount: completedBookingEarnings },
    { name: "Expenses", amount: totalExpenses },
    { name: "Net Profit", amount: profit },
  ];

  const repairChart = [
    { name: "Completed", value: completedRepairs },
    { name: "Pending", value: pendingRepairs },
  ];

  if (loading) {
    return (
      <div className="page-content driveledger-dashboard">
        <div className="container-fluid">
          <div className="dl-loading-card">
            <div className="dl-loader"></div>
            <h5>Loading Dashboard...</h5>
            <p>Fetching latest DriveLedger records</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content driveledger-dashboard">
      <div className="container-fluid">
        <div className="dl-hero dl-reveal dl-reveal-up">
          <div className="dl-hero-content">
            <div className="dl-hero-top">
              <div>
                <div className="dl-hero-pill">
                  <span className="dl-status-dot"></span>
                  Live Admin Overview
                </div>

                <h4>DriveLedger Command Center</h4>

                <p>
                  Monitor fleet records, driver assignments, payments, expenses,
                  repairs, public bookings and overall business performance from
                  one dashboard.
                </p>
              </div>
            </div>

            <div className="dl-hero-stats">
              <div className="dl-hero-mini">
                <span>Total Revenue</span>
                <strong>Rs. {formatAmount(totalRevenue)}</strong>
              </div>

              <div className="dl-hero-mini">
                <span>Total Expenses</span>
                <strong>Rs. {formatAmount(totalExpenses)}</strong>
              </div>

              <div className="dl-hero-mini">
                <span>Net Profit / Loss</span>
                <strong>Rs. {formatAmount(profit)}</strong>
              </div>

              <div className="dl-hero-mini">
                <span>Booking Earnings</span>
                <strong>Rs. {formatAmount(completedBookingEarnings)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="dl-alert-grid dl-reveal dl-reveal-up dl-delay-1">
          {profit < 0 && (
            <div className="dl-alert dl-alert-danger">
              <span className="dl-alert-icon">⚠️</span>
              <div>
                <strong>Loss Warning:</strong> Current business loss is Rs.{" "}
                {formatAmount(Math.abs(profit))}.
              </div>
            </div>
          )}

          {pendingRepairs > 0 && (
            <div className="dl-alert dl-alert-warning">
              <span className="dl-alert-icon">🔧</span>
              <div>
                <strong>Repair Attention:</strong> {pendingRepairs} repair
                request(s) are still pending.
              </div>
            </div>
          )}
        </div>

        <div className="dl-kpi-grid">
          <KpiCard
            revealClass="dl-reveal dl-reveal-left dl-delay-1"
            title="Drivers"
            value={data.drivers.length}
            subtitle="Registered drivers"
            color="#2563eb"
            icon="👤"
            bg="#eff6ff"
            border="#bfdbfe"
          />

          <KpiCard
            revealClass="dl-reveal dl-reveal-right dl-delay-2"
            title="Cars"
            value={data.cars.length}
            subtitle="Fleet vehicles"
            color="#16a34a"
            icon="🚗"
            bg="#ecfdf5"
            border="#bbf7d0"
          />

          <KpiCard
            revealClass="dl-reveal dl-reveal-up dl-delay-3"
            title="Bookings"
            value={bookingSummary.total_requests}
            subtitle={`Rs. ${formatAmount(
              bookingSummary.total_booking_value
            )} total booking value`}
            color="#0f766e"
            icon="📅"
            bg="#f0fdfa"
            border="#99f6e4"
          />

          <KpiCard
            revealClass="dl-reveal dl-reveal-zoom dl-delay-4"
            title="Net Profit / Loss"
            value={`Rs. ${formatAmount(profit)}`}
            subtitle="Payments + completed bookings - expenses"
            color={profit >= 0 ? "#16a34a" : "#dc2626"}
            icon="💰"
            bg={profit >= 0 ? "#ecfdf5" : "#fef2f2"}
            border={profit >= 0 ? "#bbf7d0" : "#fecaca"}
          />
        </div>

        <div className="dl-section-grid dl-reveal dl-reveal-left dl-delay-1">
          <ChartCard
            title="Fleet Status"
            subtitle="Assigned vs available cars"
            icon="🚘"
          >
            <div className="dl-chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetChart}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={76}
                    label
                  >
                    <Cell fill="#2563eb" />
                    <Cell fill="#14b8a6" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Finance Overview"
            subtitle="Payments, booking revenue, expenses and result"
            icon="📊"
          >
            <div className="dl-chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeChart}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    fill="#0f766e"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Repair Status"
            subtitle="Completed vs pending"
            icon="🛠️"
          >
            <div className="dl-chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={repairChart}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={76}
                    label
                  >
                    <Cell fill="#16a34a" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="dl-info-panel-grid dl-reveal dl-reveal-right dl-delay-2">
          <InfoPanel
            title="DriveEase Booking Revenue"
            icon="📅"
            lines={[
              [
                "Total Booking Value",
                `Rs. ${formatAmount(bookingSummary.total_booking_value)}`,
                "#0f766e",
              ],
              [
                "Pending Value",
                `Rs. ${formatAmount(bookingSummary.pending_value)}`,
                "#f59e0b",
              ],
              [
                "Confirmed Earnings",
                `Rs. ${formatAmount(bookingSummary.confirmed_value)}`,
                "#2563eb",
              ],
              [
                "Completed Earnings",
                `Rs. ${formatAmount(bookingSummary.completed_earnings)}`,
                "#16a34a",
              ],
            ]}
          />

          <InfoPanel
            title="Payment Health"
            icon="💳"
            lines={[
              ["Paid Payments", paidPayments, "#16a34a"],
              ["Unpaid Payments", unpaidPayments, "#dc2626"],
              ["Total Records", data.payments.length, "#0f172a"],
            ]}
          />

          <InfoPanel
            title="Fleet Availability"
            icon="🚙"
            lines={[
              ["Available Cars", availableCars, "#16a34a"],
              ["Assigned Cars", activeAssignments, "#2563eb"],
              ["Total Cars", data.cars.length, "#0f172a"],
            ]}
          />

          <InfoPanel
            title="Repair Workload"
            icon="🔧"
            lines={[
              ["Completed Repairs", completedRepairs, "#16a34a"],
              ["Pending Repairs", pendingRepairs, "#f59e0b"],
              ["Total Repairs", data.repairs.length, "#0f172a"],
            ]}
          />
        </div>

        <div className="dl-two-grid dl-reveal dl-reveal-up dl-delay-3">
          <MiniTable
            title="Recent Payments"
            icon="🧾"
            rows={data.payments.slice(-5).reverse()}
            columns={["Amount", "Date", "Status"]}
            render={(p) => (
              <>
                <td>Rs. {formatAmount(p.amount)}</td>
                <td>{p.payment_date}</td>
                <td>
                  <StatusBadge
                    label={p.status}
                    type={
                      String(p.status).toLowerCase() === "paid"
                        ? "success"
                        : "danger"
                    }
                  />
                </td>
              </>
            )}
          />

          <MiniTable
            title="Recent Repair Requests"
            icon="🛠️"
            rows={data.repairs.slice(-5).reverse()}
            columns={["Issue", "Status", "Estimated Cost"]}
            render={(r) => (
              <>
                <td>{r.issue}</td>
                <td>
                  <StatusBadge
                    label={r.status}
                    type={
                      String(r.status).toLowerCase() === "completed"
                        ? "success"
                        : "warning"
                    }
                  />
                </td>
                <td>Rs. {formatAmount(r.estimated_cost)}</td>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({
  title,
  value,
  subtitle,
  color,
  icon,
  bg,
  border,
  revealClass = "",
}) => (
  <div className={`dl-kpi-card ${revealClass}`} style={{ color }}>
    <div className="dl-kpi-top">
      <div>
        <p className="dl-kpi-title">{title}</p>
        <h3 className="dl-kpi-value" style={{ color }}>
          {value}
        </h3>
      </div>

      <div
        className="dl-kpi-icon"
        style={{
          background: bg,
          color,
          border: `1px solid ${border}`,
        }}
      >
        {icon}
      </div>
    </div>

    <small className="dl-kpi-subtitle">{subtitle}</small>
  </div>
);

const ChartCard = ({ title, subtitle, icon, children }) => (
  <div className="dl-card">
    <div className="dl-card-head">
      <div>
        <h5 className="dl-card-title">{title}</h5>
        <p className="dl-card-subtitle">{subtitle}</p>
      </div>

      <div className="dl-card-soft-icon">{icon}</div>
    </div>

    {children}
  </div>
);

const InfoPanel = ({ title, icon, lines }) => (
  <div className="dl-card">
    <div className="dl-card-head">
      <div>
        <h5 className="dl-card-title">{title}</h5>
        <p className="dl-card-subtitle">Quick operational summary</p>
      </div>

      <div className="dl-card-soft-icon">{icon}</div>
    </div>

    <div className="dl-info-list">
      {lines.map(([label, value, color]) => (
        <div className="dl-info-row" key={label}>
          <span>{label}</span>
          <strong style={{ color }}>{value}</strong>
        </div>
      ))}
    </div>
  </div>
);

const MiniTable = ({ title, icon, rows, columns, render }) => (
  <div className="dl-card">
    <div className="dl-card-head">
      <div>
        <h5 className="dl-card-title">{title}</h5>
        <p className="dl-card-subtitle">Latest activity records</p>
      </div>

      <div className="dl-card-soft-icon">{icon}</div>
    </div>

    <div className="dl-table-wrap">
      <table className="table table-sm table-hover dl-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => <tr key={row.id}>{render(row)}</tr>)
          ) : (
            <tr>
              <td colSpan={columns.length} className="dl-empty-text">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const StatusBadge = ({ label, type }) => (
  <span className={`dl-badge dl-badge-${type}`}>{label}</span>
);

export default Dashboard;