// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Reports = () => {
//   const [data, setData] = useState({
//     drivers: [],
//     cars: [],
//     assignments: [],
//     payments: [],
//     expenses: [],
//     repairs: [],
//   });

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   const fetchReportData = async () => {
//     try {
//       const [drivers, cars, assignments, payments, expenses, repairs] =
//         await Promise.all([
//           axios.get("http://127.0.0.1:8000/api/drivers/"),
//           axios.get("http://127.0.0.1:8000/api/cars/"),
//           axios.get("http://127.0.0.1:8000/api/assignments/"),
//           axios.get("http://127.0.0.1:8000/api/payments/"),
//           axios.get("http://127.0.0.1:8000/api/expenses/"),
//           axios.get("http://127.0.0.1:8000/api/repairs/"),
//         ]);

//       setData({ drivers, cars, assignments, payments, expenses, repairs });
//     } catch (error) {
//       console.error("Reports error:", error);
//     }
//   };

//   const totalPayments = data.payments.reduce(
//     (sum, item) => sum + Number(item.amount || 0),
//     0
//   );

//   const totalExpenses = data.expenses.reduce(
//     (sum, item) => sum + Number(item.amount || 0),
//     0
//   );

//   const completedRepairCost = data.repairs
//     .filter((item) => item.status === "completed")
//     .reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);

//   const pendingRepairCost = data.repairs
//     .filter((item) => item.status !== "completed")
//     .reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);

//   const profit = totalPayments - totalExpenses;

//   const paidCount = data.payments.filter((p) => p.status === "paid").length;
//   const unpaidCount = data.payments.filter((p) => p.status === "unpaid").length;
//   const activeAssignments = data.assignments.filter((a) => a.status === "active").length;
//   const completedRepairs = data.repairs.filter((r) => r.status === "completed").length;
//   const pendingRepairs = data.repairs.filter((r) => r.status !== "completed").length;

//   const getMonthKey = (date) => {
//     const d = new Date(date);
//     return d.toLocaleString("default", { month: "short", year: "numeric" });
//   };

//   const monthlyReport = {};

//   data.payments.forEach((p) => {
//     const month = getMonthKey(p.payment_date);
//     if (!monthlyReport[month]) monthlyReport[month] = { income: 0, expense: 0 };
//     monthlyReport[month].income += Number(p.amount || 0);
//   });

//   data.expenses.forEach((e) => {
//     const month = getMonthKey(e.expense_date);
//     if (!monthlyReport[month]) monthlyReport[month] = { income: 0, expense: 0 };
//     monthlyReport[month].expense += Number(e.amount || 0);
//   });

//   const monthlyRows = Object.entries(monthlyReport).map(([month, value]) => ({
//     month,
//     income: value.income,
//     expense: value.expense,
//     profit: value.income - value.expense,
//   }));

//   const bestMonth = monthlyRows.reduce(
//     (best, item) => (!best || item.profit > best.profit ? item : best),
//     null
//   );

//   const worstMonth = monthlyRows.reduce(
//     (worst, item) => (!worst || item.profit < worst.profit ? item : worst),
//     null
//   );

//   const maxMonthlyValue =
//     Math.max(...monthlyRows.map((m) => Math.max(m.income, m.expense)), 1);

//   const financeTotal = totalPayments + totalExpenses;
//   const paymentWidth = financeTotal ? (totalPayments / financeTotal) * 100 : 0;
//   const expenseWidth = financeTotal ? (totalExpenses / financeTotal) * 100 : 0;

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h4 className="mb-1">Reports & Analytics</h4>
//             <p className="text-muted mb-0">
//               Monthly profit, financial health, repair risk, and operational summary.
//             </p>
//           </div>

//           <button className="btn btn-primary" onClick={() => window.print()}>
//             Print / Download Report
//           </button>
//         </div>

//         {profit < 0 && (
//           <div className="alert alert-danger">
//             <strong>Loss Alert:</strong> Your expenses are higher than payments. Current loss is Rs. {Math.abs(profit)}.
//           </div>
//         )}

//         {pendingRepairCost > 0 && (
//           <div className="alert alert-warning">
//             <strong>Repair Risk:</strong> Pending repair estimate is Rs. {pendingRepairCost}. This may affect future profit.
//           </div>
//         )}

//         <div className="row">
//           <ReportCard title="Total Drivers" value={data.drivers.length} />
//           <ReportCard title="Total Cars" value={data.cars.length} />
//           <ReportCard title="Active Assignments" value={activeAssignments} />
//           <ReportCard title="Pending Repairs" value={pendingRepairs} />
//         </div>

//         <div className="row mt-3">
//           <MoneyCard title="Total Payments" value={totalPayments} color="success" />
//           <MoneyCard title="Total Expenses" value={totalExpenses} color="danger" />
//           <MoneyCard title="Completed Repair Cost (Included)" value={completedRepairCost} color="warning" />
//           <MoneyCard title="Net Profit / Loss" value={profit} color={profit >= 0 ? "success" : "danger"} />
//         </div>

//         <div className="card mt-3">
//           <div className="card-body">
//             <h5>Financial Distribution</h5>
//             <p className="text-muted">
//               Profit uses payments minus total expenses. Completed repairs are already included in expenses.
//             </p>

//             <div className="progress" style={{ height: "30px" }}>
//               <div className="progress-bar bg-success" style={{ width: `${paymentWidth}%` }}>
//                 Payments
//               </div>
//               <div className="progress-bar bg-danger" style={{ width: `${expenseWidth}%` }}>
//                 Expenses
//               </div>
//             </div>

//             <div className="d-flex justify-content-between mt-3">
//               <span>Income: Rs. {totalPayments}</span>
//               <span>Costs: Rs. {totalExpenses}</span>
//             </div>
//           </div>
//         </div>

//         <div className="row mt-3">
//           <SummaryBox
//             title="Payment Status Summary"
//             lines={[
//               ["Paid Payments", paidCount, "text-success"],
//               ["Unpaid Payments", unpaidCount, "text-danger"],
//               ["Total Payment Records", data.payments.length, ""],
//             ]}
//           />

//           <SummaryBox
//             title="Monthly Performance"
//             lines={[
//               ["Best Month", bestMonth ? `${bestMonth.month} — Rs. ${bestMonth.profit}` : "-", "text-success"],
//               ["Weakest Month", worstMonth ? `${worstMonth.month} — Rs. ${worstMonth.profit}` : "-", "text-danger"],
//               ["Pending Repair Estimate", `Rs. ${pendingRepairCost}`, "text-warning"],
//             ]}
//           />
//         </div>

//         <div className="card mt-3">
//           <div className="card-body">
//             <h5>Monthly Profit Graph</h5>
//             <p className="text-muted">Green = income, red = expenses, final value = monthly profit/loss.</p>

//             {monthlyRows.length > 0 ? (
//               monthlyRows.map((month) => (
//                 <div key={month.month} className="mb-4">
//                   <div className="d-flex justify-content-between mb-1">
//                     <strong>{month.month}</strong>
//                     <strong className={month.profit >= 0 ? "text-success" : "text-danger"}>
//                       Rs. {month.profit}
//                     </strong>
//                   </div>

//                   <div className="progress mb-2" style={{ height: "22px" }}>
//                     <div
//                       className="progress-bar bg-success"
//                       style={{ width: `${(month.income / maxMonthlyValue) * 100}%` }}
//                     >
//                       Income Rs. {month.income}
//                     </div>
//                   </div>

//                   <div className="progress" style={{ height: "22px" }}>
//                     <div
//                       className="progress-bar bg-danger"
//                       style={{ width: `${(month.expense / maxMonthlyValue) * 100}%` }}
//                     >
//                       Expense Rs. {month.expense}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>No monthly data available.</p>
//             )}
//           </div>
//         </div>

//         <RecentTable
//           title="Recent Payments"
//           rows={data.payments.slice(-5).reverse()}
//           columns={["#", "Amount", "Date", "Status", "Remarks"]}
//           render={(item, index) => (
//             <>
//               <td>{index + 1}</td>
//               <td>Rs. {item.amount}</td>
//               <td>{item.payment_date}</td>
//               <td>
//                 <span className={`badge ${item.status === "paid" ? "bg-success" : "bg-danger"}`}>
//                   {item.status}
//                 </span>
//               </td>
//               <td>{item.remarks || "-"}</td>
//             </>
//           )}
//         />

//         <RecentTable
//           title="Recent Expenses"
//           rows={data.expenses.slice(-5).reverse()}
//           columns={["#", "Amount", "Date", "Category", "Notes"]}
//           render={(item, index) => (
//             <>
//               <td>{index + 1}</td>
//               <td>Rs. {item.amount}</td>
//               <td>{item.expense_date}</td>
//               <td>
//                 <span className="badge bg-info">{item.category}</span>
//               </td>
//               <td>{item.notes || "-"}</td>
//             </>
//           )}
//         />

//         <RecentTable
//           title="Recent Repairs"
//           rows={data.repairs.slice(-5).reverse()}
//           columns={["#", "Issue", "Priority", "Status", "Estimated Cost"]}
//           render={(item, index) => (
//             <>
//               <td>{index + 1}</td>
//               <td>{item.issue}</td>
//               <td>{item.priority}</td>
//               <td>
//                 <span className={`badge ${item.status === "completed" ? "bg-success" : "bg-warning"}`}>
//                   {item.status}
//                 </span>
//               </td>
//               <td>Rs. {item.estimated_cost}</td>
//             </>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// const ReportCard = ({ title, value }) => (
//   <div className="col-md-3">
//     <div className="card">
//       <div className="card-body text-center">
//         <p className="text-muted mb-1">{title}</p>
//         <h2>{value}</h2>
//       </div>
//     </div>
//   </div>
// );

// const MoneyCard = ({ title, value, color }) => (
//   <div className="col-md-3">
//     <div className="card">
//       <div className="card-body text-center">
//         <p className="text-muted mb-1">{title}</p>
//         <h4 className={`text-${color}`}>Rs. {value}</h4>
//       </div>
//     </div>
//   </div>
// );

// const SummaryBox = ({ title, lines }) => (
//   <div className="col-md-6">
//     <div className="card">
//       <div className="card-body">
//         <h5>{title}</h5>
//         {lines.map(([label, value, color]) => (
//           <div className="d-flex justify-content-between mt-3" key={label}>
//             <span>{label}</span>
//             <strong className={color}>{value}</strong>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// const RecentTable = ({ title, rows, columns, render }) => (
//   <div className="card mt-3">
//     <div className="card-body">
//       <h5>{title}</h5>

//       <div className="table-responsive">
//         <table className="table table-bordered table-hover align-middle mt-3">
//           <thead className="table-light">
//             <tr>
//               {columns.map((col) => (
//                 <th key={col}>{col}</th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {rows.length > 0 ? (
//               rows.map((item, index) => (
//                 <tr key={item.id}>{render(item, index)}</tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} className="text-center">
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// );

// export default Reports;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";

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
      const [driversRes, carsRes, assignmentsRes, paymentsRes, expensesRes, repairsRes] =
        await Promise.all([
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
    .reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);

  const pendingRepairCost = data.repairs
    .filter((item) => item.status !== "completed")
    .reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);

  const profit = totalPayments - totalExpenses;

  const paidCount = data.payments.filter((p) => p.status === "paid").length;
  const unpaidCount = data.payments.filter((p) => p.status === "unpaid").length;
  const activeAssignments = data.assignments.filter((a) => a.status === "active").length;
  const pendingRepairs = data.repairs.filter((r) => r.status !== "completed").length;

  const getMonthKey = (date) => {
    const d = new Date(date);
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

  const maxMonthlyValue =
    Math.max(...monthlyRows.map((m) => Math.max(m.income, m.expense)), 1);

  const financeTotal = totalPayments + totalExpenses;
  const paymentWidth = financeTotal ? (totalPayments / financeTotal) * 100 : 0;
  const expenseWidth = financeTotal ? (totalExpenses / financeTotal) * 100 : 0;

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Reports & Analytics</h4>
            <p className="text-muted mb-0">
              Monthly profit, financial health, repair risk, and operational summary.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => window.print()}>
            Print / Download Report
          </button>
        </div>

        {profit < 0 && (
          <div className="alert alert-danger">
            <strong>Loss Alert:</strong> Your expenses are higher than payments.
            Current loss is Rs. {Math.abs(profit)}.
          </div>
        )}

        {pendingRepairCost > 0 && (
          <div className="alert alert-warning">
            <strong>Repair Risk:</strong> Pending repair estimate is Rs.{" "}
            {pendingRepairCost}. This may affect future profit.
          </div>
        )}

        <div className="row">
          <ReportCard title="Total Drivers" value={data.drivers.length} />
          <ReportCard title="Total Cars" value={data.cars.length} />
          <ReportCard title="Active Assignments" value={activeAssignments} />
          <ReportCard title="Pending Repairs" value={pendingRepairs} />
        </div>

        <div className="row mt-3">
          <MoneyCard title="Total Payments" value={totalPayments} color="success" />
          <MoneyCard title="Total Expenses" value={totalExpenses} color="danger" />
          <MoneyCard
            title="Completed Repair Cost"
            value={completedRepairCost}
            color="warning"
          />
          <MoneyCard
            title="Net Profit / Loss"
            value={profit}
            color={profit >= 0 ? "success" : "danger"}
          />
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h5>Financial Distribution</h5>
            <p className="text-muted">
              Profit uses payments minus total expenses. Completed repairs are shown separately
              for repair cost visibility.
            </p>

            <div className="progress" style={{ height: "30px" }}>
              <div className="progress-bar bg-success" style={{ width: `${paymentWidth}%` }}>
                Payments
              </div>
              <div className="progress-bar bg-danger" style={{ width: `${expenseWidth}%` }}>
                Expenses
              </div>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <span>Income: Rs. {totalPayments}</span>
              <span>Costs: Rs. {totalExpenses}</span>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <SummaryBox
            title="Payment Status Summary"
            lines={[
              ["Paid Payments", paidCount, "text-success"],
              ["Unpaid Payments", unpaidCount, "text-danger"],
              ["Total Payment Records", data.payments.length, ""],
            ]}
          />

          <SummaryBox
            title="Monthly Performance"
            lines={[
              [
                "Best Month",
                bestMonth ? `${bestMonth.month} — Rs. ${bestMonth.profit}` : "-",
                "text-success",
              ],
              [
                "Weakest Month",
                worstMonth ? `${worstMonth.month} — Rs. ${worstMonth.profit}` : "-",
                "text-danger",
              ],
              ["Pending Repair Estimate", `Rs. ${pendingRepairCost}`, "text-warning"],
            ]}
          />
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h5>Monthly Profit Graph</h5>
            <p className="text-muted">
              Green = income, red = expenses, final value = monthly profit/loss.
            </p>

            {monthlyRows.length > 0 ? (
              monthlyRows.map((month) => (
                <div key={month.month} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <strong>{month.month}</strong>
                    <strong className={month.profit >= 0 ? "text-success" : "text-danger"}>
                      Rs. {month.profit}
                    </strong>
                  </div>

                  <div className="progress mb-2" style={{ height: "22px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${(month.income / maxMonthlyValue) * 100}%` }}
                    >
                      Income Rs. {month.income}
                    </div>
                  </div>

                  <div className="progress" style={{ height: "22px" }}>
                    <div
                      className="progress-bar bg-danger"
                      style={{ width: `${(month.expense / maxMonthlyValue) * 100}%` }}
                    >
                      Expense Rs. {month.expense}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No monthly data available.</p>
            )}
          </div>
        </div>

        <RecentTable
          title="Recent Payments"
          rows={data.payments.slice(-5).reverse()}
          columns={["#", "Amount", "Date", "Status", "Remarks"]}
          render={(item, index) => (
            <>
              <td>{index + 1}</td>
              <td>Rs. {item.amount}</td>
              <td>{item.payment_date}</td>
              <td>
                <span className={`badge ${item.status === "paid" ? "bg-success" : "bg-danger"}`}>
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
              <td>{item.expense_date}</td>
              <td>
                <span className="badge bg-info">{item.category}</span>
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
              <td>{item.priority}</td>
              <td>
                <span className={`badge ${item.status === "completed" ? "bg-success" : "bg-warning"}`}>
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

const ReportCard = ({ title, value }) => (
  <div className="col-md-3">
    <div className="card">
      <div className="card-body text-center">
        <p className="text-muted mb-1">{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  </div>
);

const MoneyCard = ({ title, value, color }) => (
  <div className="col-md-3">
    <div className="card">
      <div className="card-body text-center">
        <p className="text-muted mb-1">{title}</p>
        <h4 className={`text-${color}`}>Rs. {value}</h4>
      </div>
    </div>
  </div>
);

const SummaryBox = ({ title, lines }) => (
  <div className="col-md-6">
    <div className="card">
      <div className="card-body">
        <h5>{title}</h5>
        {lines.map(([label, value, color]) => (
          <div className="d-flex justify-content-between mt-3" key={label}>
            <span>{label}</span>
            <strong className={color}>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RecentTable = ({ title, rows, columns, render }) => (
  <div className="card mt-3">
    <div className="card-body">
      <h5>{title}</h5>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle mt-3">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((item, index) => (
                <tr key={item.id}>{render(item, index)}</tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Reports;