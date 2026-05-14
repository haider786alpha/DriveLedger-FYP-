// import React, { useEffect, useState } from "react";
// import { API_URL } from "../../helpers/apiConfig";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({
//     drivers: [],
//     cars: [],
//     assignments: [],
//     payments: [],
//     expenses: [],
//     repairs: [],
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const [drivers, cars, assignments, payments, expenses, repairs] =
//         await Promise.all([
//           axios.get(API_URL("/api/drivers/")),
//           axios.get(API_URL("/api/cars/")),
//           axios.get(API_URL("/api/assignments/")),
//           axios.get(API_URL("/api/payments/")),
//           axios.get(API_URL("/api/expenses/")),
//           axios.get(API_URL("/api/repairs/")),
//         ]);

//       setData({ drivers, cars, assignments, payments, expenses, repairs });
//     } catch (error) {
//   console.error("Dashboard error:", error);
// } finally {
//   setLoading(false);
// }
//   };

//   const totalPayments = data.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
//   const totalExpenses = data.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
//   const profit = totalPayments - totalExpenses;

//   const activeAssignments = data.assignments.filter((a) => a.status === "active").length;
//   const availableCars = Math.max(data.cars.length - activeAssignments, 0);
//   const pendingRepairs = data.repairs.filter((r) => r.status !== "completed").length;
//   const completedRepairs = data.repairs.filter((r) => r.status === "completed").length;

//   const paidPayments = data.payments.filter((p) => p.status === "paid").length;
//   const unpaidPayments = data.payments.filter((p) => p.status === "unpaid").length;

//   const fleetChart = [
//     { name: "Assigned Cars", value: activeAssignments },
//     { name: "Available Cars", value: availableCars },
//   ];

//   const financeChart = [
//     { name: "Payments", amount: totalPayments },
//     { name: "Expenses", amount: totalExpenses },
//     { name: "Profit/Loss", amount: profit },
//   ];

//   const repairChart = [
//     { name: "Completed", value: completedRepairs },
//     { name: "Pending", value: pendingRepairs },
//   ];

//   const COLORS = ["#0d6efd", "#20c997", "#ffc107", "#dc3545"];

//   if (loading) {
//   return (
//     <div className="page-content">
//       <div className="container-fluid text-center mt-5">
//         <h5>Loading Dashboard...</h5>
//       </div>
//     </div>
//   );
// }

//   return (
//     <div className="page-content">
//       <div className="container-fluid">

//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h4 className="mb-1">DriveLedger Command Center</h4>
//             <p className="text-muted mb-0">
//               Live fleet, finance, assignment and repair performance overview.
//             </p>
//           </div>
//         </div>

//         {profit < 0 && (
//           <div className="alert alert-danger">
//             <strong>Loss Warning:</strong> Current business loss is Rs. {Math.abs(profit)}.
//           </div>
//         )}

//         {pendingRepairs > 0 && (
//           <div className="alert alert-warning">
//             <strong>Repair Attention:</strong> {pendingRepairs} repair request(s) are still pending.
//           </div>
//         )}

//         <div className="row">
//           <KpiCard title="Drivers" value={data.drivers.length} subtitle="Registered drivers" color="primary" />
//           <KpiCard title="Cars" value={data.cars.length} subtitle="Fleet vehicles" color="success" />
//           <KpiCard title="Active Assignments" value={activeAssignments} subtitle="Currently assigned" color="info" />
//           <KpiCard title="Net Profit / Loss" value={`Rs. ${profit}`} subtitle="Payments - expenses" color={profit >= 0 ? "success" : "danger"} />
//         </div>

//         <div className="row mt-3">
//           <div className="col-md-4">
//             <ChartCard title="Fleet Status">
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie data={fleetChart} dataKey="value" nameKey="name" outerRadius={85} label>
//                     {fleetChart.map((_, index) => (
//                       <Cell key={index} fill={COLORS[index]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </div>

//           <div className="col-md-4">
//             <ChartCard title="Finance Overview">
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={financeChart}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="amount" fill="#0d6efd" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </div>

//           <div className="col-md-4">
//             <ChartCard title="Repair Status">
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie data={repairChart} dataKey="value" nameKey="name" outerRadius={85} label>
//                     {repairChart.map((_, index) => (
//                       <Cell key={index} fill={index === 0 ? "#198754" : "#ffc107"} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </div>
//         </div>

//         <div className="row mt-3">
//           <div className="col-md-4">
//             <InfoPanel
//               title="Payment Health"
//               lines={[
//                 ["Paid Payments", paidPayments, "text-success"],
//                 ["Unpaid Payments", unpaidPayments, "text-danger"],
//                 ["Total Records", data.payments.length, ""],
//               ]}
//             />
//           </div>

//           <div className="col-md-4">
//             <InfoPanel
//               title="Fleet Availability"
//               lines={[
//                 ["Available Cars", availableCars, "text-success"],
//                 ["Assigned Cars", activeAssignments, "text-primary"],
//                 ["Total Cars", data.cars.length, ""],
//               ]}
//             />
//           </div>

//           <div className="col-md-4">
//             <InfoPanel
//               title="Repair Workload"
//               lines={[
//                 ["Completed Repairs", completedRepairs, "text-success"],
//                 ["Pending Repairs", pendingRepairs, "text-warning"],
//                 ["Total Repairs", data.repairs.length, ""],
//               ]}
//             />
//           </div>
//         </div>

//         <div className="row mt-3">
//           <div className="col-md-6">
//             <MiniTable
//               title="Recent Payments"
//               rows={data.payments.slice(-5).reverse()}
//               columns={["Amount", "Date", "Status"]}
//               render={(p) => (
//                 <>
//                   <td>Rs. {p.amount}</td>
//                   <td>{p.payment_date}</td>
//                   <td>
//                     <span className={`badge ${p.status === "paid" ? "bg-success" : "bg-danger"}`}>
//                       {p.status}
//                     </span>
//                   </td>
//                 </>
//               )}
//             />
//           </div>

//           <div className="col-md-6">
//             <MiniTable
//               title="Recent Repair Requests"
//               rows={data.repairs.slice(-5).reverse()}
//               columns={["Issue", "Status", "Estimated Cost"]}
//               render={(r) => (
//                 <>
//                   <td>{r.issue}</td>
//                   <td>
//                     <span className={`badge ${r.status === "completed" ? "bg-success" : "bg-warning"}`}>
//                       {r.status}
//                     </span>
//                   </td>
//                   <td>Rs. {r.estimated_cost}</td>
//                 </>
//               )}
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// const KpiCard = ({ title, value, subtitle, color }) => (
//   <div className="col-md-3">
//     <div className="card h-100 shadow-sm">
//       <div className="card-body">
//         <p className="text-muted mb-1">{title}</p>
//         <h3 className={`text-${color}`}>{value}</h3>
//         <small className="text-muted">{subtitle}</small>
//       </div>
//     </div>
//   </div>
// );

// const ChartCard = ({ title, children }) => (
//   <div className="card h-100 shadow-sm">
//     <div className="card-body">
//       <h5>{title}</h5>
//       {children}
//     </div>
//   </div>
// );

// const InfoPanel = ({ title, lines }) => (
//   <div className="card h-100 shadow-sm">
//     <div className="card-body">
//       <h5>{title}</h5>
//       {lines.map(([label, value, color]) => (
//         <div className="d-flex justify-content-between mt-3" key={label}>
//           <span>{label}</span>
//           <strong className={color}>{value}</strong>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const MiniTable = ({ title, rows, columns, render }) => (
//   <div className="card h-100 shadow-sm">
//     <div className="card-body">
//       <h5>{title}</h5>
//       <div className="table-responsive">
//         <table className="table table-sm table-bordered table-hover mt-3">
//           <thead className="table-light">
//             <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
//           </thead>
//           <tbody>
//             {rows.length > 0 ? (
//               rows.map((row) => <tr key={row.id}>{render(row)}</tr>)
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

// export default Dashboard;



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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
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

  const profit = totalPayments - totalExpenses;

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
    { name: "Expenses", amount: totalExpenses },
    { name: "Profit", amount: profit },
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
                  repairs and overall business performance from one dashboard.
                </p>
              </div>
            </div>

            <div className="dl-hero-stats">
              <div className="dl-hero-mini">
                <span>Total Income</span>
                <strong>Rs. {totalPayments}</strong>
              </div>

              <div className="dl-hero-mini">
                <span>Total Expenses</span>
                <strong>Rs. {totalExpenses}</strong>
              </div>

              <div className="dl-hero-mini">
                <span>Net Result</span>
                <strong>Rs. {profit}</strong>
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
                {Math.abs(profit)}.
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
            title="Assignments"
            value={activeAssignments}
            subtitle="Currently assigned"
            color="#0891b2"
            icon="🔗"
            bg="#ecfeff"
            border="#a5f3fc"
          />

          <KpiCard
            revealClass="dl-reveal dl-reveal-zoom dl-delay-4"
            title="Net Profit / Loss"
            value={`Rs. ${profit}`}
            subtitle="Payments minus expenses"
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
            subtitle="Payments, expenses and result"
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
                    fill="#2563eb"
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

        <div className="dl-section-grid dl-reveal dl-reveal-right dl-delay-2">
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
                <td>Rs. {p.amount}</td>
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
                <td>Rs. {r.estimated_cost}</td>
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