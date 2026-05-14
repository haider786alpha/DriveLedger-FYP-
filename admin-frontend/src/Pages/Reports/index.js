import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";
import "./Reports.css";

const Reports = () => {
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

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
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

  const totalPayments = data.payments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpenses = data.expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const completedRepairCost = data.repairs
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + Number(item.actual_cost || item.estimated_cost || 0), 0);

  const pendingRepairCost = data.repairs
    .filter((item) => item.status !== "completed")
    .reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);

  const profit = totalPayments - totalExpenses;

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
    if (!monthlyReport[month]) monthlyReport[month] = { income: 0, expense: 0 };
    monthlyReport[month].income += Number(p.amount || 0);
  });

  data.expenses.forEach((e) => {
    const month = getMonthKey(e.expense_date);
    if (!monthlyReport[month]) monthlyReport[month] = { income: 0, expense: 0 };
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

  const financeTotal = totalPayments + totalExpenses;
  const paymentWidth = financeTotal ? (totalPayments / financeTotal) * 100 : 0;
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
              Monthly profit, financial health, repair risk, payment status and
              operational summary.
            </p>
          </div>

          <button className="reports-print-btn" onClick={() => window.print()}>
            Print / Download Report
          </button>
        </div>

        {profit < 0 && (
          <ReportAlert
            type="danger"
            title="Loss Alert"
            message={`Your expenses are higher than payments. Current loss is Rs. ${Math.abs(
              profit
            )}.`}
          />
        )}

        {pendingRepairCost > 0 && (
          <ReportAlert
            type="warning"
            title="Repair Risk"
            message={`Pending repair estimate is Rs. ${pendingRepairCost}. This may affect future profit.`}
          />
        )}

        <div className="row g-3 reports-reveal reports-delay-2">
          <ReportCard title="Total Drivers" value={data.drivers.length} />
          <ReportCard title="Total Cars" value={data.cars.length} />
          <ReportCard title="Active Assignments" value={activeAssignments} />
          <ReportCard title="Pending Repairs" value={pendingRepairs} />
        </div>

        <div className="row g-3 mt-1 reports-reveal reports-delay-3">
          <MoneyCard title="Total Payments" value={totalPayments} tone="positive" />
          <MoneyCard title="Total Expenses" value={totalExpenses} tone="negative" />
          <MoneyCard
            title="Completed Repair Cost"
            value={completedRepairCost}
            tone="warning"
          />
          <MoneyCard
            title="Net Profit / Loss"
            value={profit}
            tone={profit >= 0 ? "positive" : "negative"}
          />
        </div>

        <div className="report-card reports-reveal reports-delay-3">
          <div className="report-card-head">
            <div>
              <h5>Financial Distribution</h5>
              <p>
                Profit uses payments minus total expenses. Completed repairs are
                shown separately for repair cost visibility.
              </p>
            </div>
          </div>

          <div className="report-distribution">
            <div
              className="report-distribution-income"
              style={{ width: `${paymentWidth}%` }}
            >
              Payments
            </div>

            <div
              className="report-distribution-expense"
              style={{ width: `${expenseWidth}%` }}
            >
              Expenses
            </div>
          </div>

          <div className="report-distribution-footer">
            <span>Income: Rs. {totalPayments}</span>
            <span>Costs: Rs. {totalExpenses}</span>
          </div>
        </div>

        <div className="row g-3 mt-1 reports-reveal reports-delay-4">
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
                  ? `${bestMonth.month} — Rs. ${bestMonth.profit}`
                  : "-",
                "report-positive",
              ],
              [
                "Weakest Month",
                worstMonth
                  ? `${worstMonth.month} — Rs. ${worstMonth.profit}`
                  : "-",
                "report-negative",
              ],
              [
                "Pending Repair Estimate",
                `Rs. ${pendingRepairCost}`,
                "report-warning",
              ],
            ]}
          />
        </div>

        <div className="report-card">
          <div className="report-card-head">
            <div>
              <h5>Monthly Profit Graph</h5>
              <p>Green = income, red = expenses, final value = monthly profit/loss.</p>
            </div>
          </div>

          {monthlyRows.length > 0 ? (
            monthlyRows.map((month) => (
              <div key={month.month} className="report-month-row">
                <div className="report-month-top">
                  <strong>{month.month}</strong>
                  <strong
                    className={
                      month.profit >= 0 ? "report-positive" : "report-negative"
                    }
                  >
                    Rs. {month.profit}
                  </strong>
                </div>

                <div className="report-bar-track">
                  <div
                    className="report-bar report-bar-income"
                    style={{
                      width: `${(month.income / maxMonthlyValue) * 100}%`,
                    }}
                  >
                    Income Rs. {month.income}
                  </div>
                </div>

                <div className="report-bar-track">
                  <div
                    className="report-bar report-bar-expense"
                    style={{
                      width: `${(month.expense / maxMonthlyValue) * 100}%`,
                    }}
                  >
                    Expense Rs. {month.expense}
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
              <td>Rs. {item.amount}</td>
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
              <td>Rs. {item.amount}</td>
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
              <td>Rs. {item.estimated_cost}</td>
            </>
          )}
        />
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

const ReportCard = ({ title, value }) => (
  <div className="col-xl-3 col-md-6">
    <div className="report-kpi-card">
      <div className="report-kpi-label">{title}</div>
      <h2 className="report-kpi-value">{value}</h2>
    </div>
  </div>
);

const MoneyCard = ({ title, value, tone }) => {
  const toneClass =
    tone === "positive"
      ? "report-positive"
      : tone === "negative"
      ? "report-negative"
      : "report-warning";

  return (
    <div className="col-xl-3 col-md-6">
      <div className="report-money-card">
        <div className="report-money-label">{title}</div>
        <h4 className={`report-money-value ${toneClass}`}>Rs. {value}</h4>
      </div>
    </div>
  );
};

const SummaryBox = ({ title, lines }) => (
  <div className="col-md-6">
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
  <div className="report-card">
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
            rows.map((item, index) => <tr key={item.id}>{render(item, index)}</tr>)
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