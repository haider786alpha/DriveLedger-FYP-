// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Dashboard = () => {
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
//           axios.get("http://127.0.0.1:8000/api/drivers/"),
//           axios.get("http://127.0.0.1:8000/api/cars/"),
//           axios.get("http://127.0.0.1:8000/api/assignments/"),
//           axios.get("http://127.0.0.1:8000/api/payments/"),
//           axios.get("http://127.0.0.1:8000/api/expenses/"),
//           axios.get("http://127.0.0.1:8000/api/repairs/"),
//         ]);

//       setData({ drivers, cars, assignments, payments, expenses, repairs });
//     } catch (error) {
//       console.error("Dashboard error:", error);
//     }
//   };

//   const totalPayments = data.payments.reduce(
//     (sum, p) => sum + Number(p.amount || 0),
//     0
//   );

//   const totalExpenses = data.expenses.reduce(
//     (sum, e) => sum + Number(e.amount || 0),
//     0
//   );

//   const paidPayments = data.payments.filter((p) => p.status === "paid").length;
//   const unpaidPayments = data.payments.filter((p) => p.status === "unpaid").length;
//   const activeAssignments = data.assignments.filter((a) => a.status === "active").length;
//   const pendingRepairs = data.repairs.filter((r) => r.status !== "completed").length;
//   const profit = totalPayments - totalExpenses;

//   const paymentPercent =
//     totalPayments + totalExpenses > 0
//       ? Math.round((totalPayments / (totalPayments + totalExpenses)) * 100)
//       : 0;

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h4 className="mb-1">DriveLedger Dashboard</h4>
//             <p className="text-muted mb-0">
//               Overview of drivers, vehicles, assignments, payments and repairs.
//             </p>
//           </div>
//         </div>

//         <div className="row">
//           <StatCard title="Drivers" value={data.drivers.length} color="primary" />
//           <StatCard title="Cars" value={data.cars.length} color="success" />
//           <StatCard title="Active Assignments" value={activeAssignments} color="info" />
//           <StatCard title="Pending Repairs" value={pendingRepairs} color="warning" />
//         </div>

//         <div className="row mt-3">
//           <MoneyCard title="Total Payments" value={totalPayments} color="success" />
//           <MoneyCard title="Total Expenses" value={totalExpenses} color="danger" />
//           <MoneyCard title="Net Profit" value={profit} color={profit >= 0 ? "success" : "danger"} />
//         </div>

//         <div className="row mt-3">
//           <div className="col-md-6">
//             <div className="card">
//               <div className="card-body">
//                 <h5>Payment Status</h5>
//                 <div className="d-flex justify-content-between mt-3">
//                   <span>Paid</span>
//                   <strong>{paidPayments}</strong>
//                 </div>
//                 <div className="progress mt-2">
//                   <div className="progress-bar bg-success" style={{ width: `${paidPayments * 20}%` }} />
//                 </div>

//                 <div className="d-flex justify-content-between mt-3">
//                   <span>Unpaid</span>
//                   <strong>{unpaidPayments}</strong>
//                 </div>
//                 <div className="progress mt-2">
//                   <div className="progress-bar bg-danger" style={{ width: `${unpaidPayments * 20}%` }} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-6">
//             <div className="card">
//               <div className="card-body">
//                 <h5>Payments vs Expenses</h5>
//                 <p className="text-muted">Financial health overview</p>

//                 <div className="progress" style={{ height: "28px" }}>
//                   <div
//                     className="progress-bar bg-success"
//                     style={{ width: `${paymentPercent}%` }}
//                   >
//                     Payments
//                   </div>
//                   <div
//                     className="progress-bar bg-danger"
//                     style={{ width: `${100 - paymentPercent}%` }}
//                   >
//                     Expenses
//                   </div>
//                 </div>

//                 <div className="d-flex justify-content-between mt-3">
//                   <span>Rs. {totalPayments}</span>
//                   <span>Rs. {totalExpenses}</span>
//                 </div>
//               </div>
//             </div>
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
//              title="Recent Repair Requests"
//              rows={data.repairs.slice(-5).reverse()}
//              columns={["Issue", "Status", "Estimated Cost"]}
//               render={(r) => (
//                 <>
//                   <td>{r.issue}</td>
//                   <td>
//                     <span className="badge bg-warning">{r.status}</span>
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

// const StatCard = ({ title, value, color }) => (
//   <div className="col-md-3">
//     <div className="card">
//       <div className="card-body text-center">
//         <p className="text-muted mb-1">{title}</p>
//         <h2 className={`text-${color}`}>{value}</h2>
//       </div>
//     </div>
//   </div>
// );

// const MoneyCard = ({ title, value, color }) => (
//   <div className="col-md-4">
//     <div className="card">
//       <div className="card-body text-center">
//         <p className="text-muted mb-1">{title}</p>
//         <h3 className={`text-${color}`}>Rs. {value}</h3>
//       </div>
//     </div>
//   </div>
// );

// const MiniTable = ({ title, rows, columns, render }) => (
//   <div className="card">
//     <div className="card-body">
//       <h5>{title}</h5>
//       <div className="table-responsive">
//         <table className="table table-sm table-bordered mt-3">
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

  const fetchDashboardData = async () => {
    try {
      const [drivers, cars, assignments, payments, expenses, repairs] =
        await Promise.all([
          axios.get("http://127.0.0.1:8000/api/drivers/"),
          axios.get("http://127.0.0.1:8000/api/cars/"),
          axios.get("http://127.0.0.1:8000/api/assignments/"),
          axios.get("http://127.0.0.1:8000/api/payments/"),
          axios.get("http://127.0.0.1:8000/api/expenses/"),
          axios.get("http://127.0.0.1:8000/api/repairs/"),
        ]);

      setData({ drivers, cars, assignments, payments, expenses, repairs });
    } catch (error) {
  console.error("Dashboard error:", error);
} finally {
  setLoading(false);
}
  };

  const totalPayments = data.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const profit = totalPayments - totalExpenses;

  const activeAssignments = data.assignments.filter((a) => a.status === "active").length;
  const availableCars = Math.max(data.cars.length - activeAssignments, 0);
  const pendingRepairs = data.repairs.filter((r) => r.status !== "completed").length;
  const completedRepairs = data.repairs.filter((r) => r.status === "completed").length;

  const paidPayments = data.payments.filter((p) => p.status === "paid").length;
  const unpaidPayments = data.payments.filter((p) => p.status === "unpaid").length;

  const fleetChart = [
    { name: "Assigned Cars", value: activeAssignments },
    { name: "Available Cars", value: availableCars },
  ];

  const financeChart = [
    { name: "Payments", amount: totalPayments },
    { name: "Expenses", amount: totalExpenses },
    { name: "Profit/Loss", amount: profit },
  ];

  const repairChart = [
    { name: "Completed", value: completedRepairs },
    { name: "Pending", value: pendingRepairs },
  ];

  const COLORS = ["#0d6efd", "#20c997", "#ffc107", "#dc3545"];

  if (loading) {
  return (
    <div className="page-content">
      <div className="container-fluid text-center mt-5">
        <h5>Loading Dashboard...</h5>
      </div>
    </div>
  );
}

  return (
    <div className="page-content">
      <div className="container-fluid">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">DriveLedger Command Center</h4>
            <p className="text-muted mb-0">
              Live fleet, finance, assignment and repair performance overview.
            </p>
          </div>
        </div>

        {profit < 0 && (
          <div className="alert alert-danger">
            <strong>Loss Warning:</strong> Current business loss is Rs. {Math.abs(profit)}.
          </div>
        )}

        {pendingRepairs > 0 && (
          <div className="alert alert-warning">
            <strong>Repair Attention:</strong> {pendingRepairs} repair request(s) are still pending.
          </div>
        )}

        <div className="row">
          <KpiCard title="Drivers" value={data.drivers.length} subtitle="Registered drivers" color="primary" />
          <KpiCard title="Cars" value={data.cars.length} subtitle="Fleet vehicles" color="success" />
          <KpiCard title="Active Assignments" value={activeAssignments} subtitle="Currently assigned" color="info" />
          <KpiCard title="Net Profit / Loss" value={`Rs. ${profit}`} subtitle="Payments - expenses" color={profit >= 0 ? "success" : "danger"} />
        </div>

        <div className="row mt-3">
          <div className="col-md-4">
            <ChartCard title="Fleet Status">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={fleetChart} dataKey="value" nameKey="name" outerRadius={85} label>
                    {fleetChart.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="col-md-4">
            <ChartCard title="Finance Overview">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={financeChart}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="col-md-4">
            <ChartCard title="Repair Status">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={repairChart} dataKey="value" nameKey="name" outerRadius={85} label>
                    {repairChart.map((_, index) => (
                      <Cell key={index} fill={index === 0 ? "#198754" : "#ffc107"} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-4">
            <InfoPanel
              title="Payment Health"
              lines={[
                ["Paid Payments", paidPayments, "text-success"],
                ["Unpaid Payments", unpaidPayments, "text-danger"],
                ["Total Records", data.payments.length, ""],
              ]}
            />
          </div>

          <div className="col-md-4">
            <InfoPanel
              title="Fleet Availability"
              lines={[
                ["Available Cars", availableCars, "text-success"],
                ["Assigned Cars", activeAssignments, "text-primary"],
                ["Total Cars", data.cars.length, ""],
              ]}
            />
          </div>

          <div className="col-md-4">
            <InfoPanel
              title="Repair Workload"
              lines={[
                ["Completed Repairs", completedRepairs, "text-success"],
                ["Pending Repairs", pendingRepairs, "text-warning"],
                ["Total Repairs", data.repairs.length, ""],
              ]}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <MiniTable
              title="Recent Payments"
              rows={data.payments.slice(-5).reverse()}
              columns={["Amount", "Date", "Status"]}
              render={(p) => (
                <>
                  <td>Rs. {p.amount}</td>
                  <td>{p.payment_date}</td>
                  <td>
                    <span className={`badge ${p.status === "paid" ? "bg-success" : "bg-danger"}`}>
                      {p.status}
                    </span>
                  </td>
                </>
              )}
            />
          </div>

          <div className="col-md-6">
            <MiniTable
              title="Recent Repair Requests"
              rows={data.repairs.slice(-5).reverse()}
              columns={["Issue", "Status", "Estimated Cost"]}
              render={(r) => (
                <>
                  <td>{r.issue}</td>
                  <td>
                    <span className={`badge ${r.status === "completed" ? "bg-success" : "bg-warning"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>Rs. {r.estimated_cost}</td>
                </>
              )}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const KpiCard = ({ title, value, subtitle, color }) => (
  <div className="col-md-3">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <p className="text-muted mb-1">{title}</p>
        <h3 className={`text-${color}`}>{value}</h3>
        <small className="text-muted">{subtitle}</small>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="card h-100 shadow-sm">
    <div className="card-body">
      <h5>{title}</h5>
      {children}
    </div>
  </div>
);

const InfoPanel = ({ title, lines }) => (
  <div className="card h-100 shadow-sm">
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
);

const MiniTable = ({ title, rows, columns, render }) => (
  <div className="card h-100 shadow-sm">
    <div className="card-body">
      <h5>{title}</h5>
      <div className="table-responsive">
        <table className="table table-sm table-bordered table-hover mt-3">
          <thead className="table-light">
            <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => <tr key={row.id}>{render(row)}</tr>)
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

export default Dashboard;