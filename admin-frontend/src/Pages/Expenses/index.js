// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const Expenses = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [cars, setCars] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [expensesRes, carsRes, assignmentsRes, driversRes] =
//         await Promise.all([
//           axios.get("http://127.0.0.1:8000/api/expenses/"),
//           axios.get("http://127.0.0.1:8000/api/cars/"),
//           axios.get("http://127.0.0.1:8000/api/assignments/"),
//           axios.get("http://127.0.0.1:8000/api/drivers/"),
//         ]);

//       setExpenses(expensesRes);
//       setCars(carsRes);
//       setAssignments(assignmentsRes);
//       setDrivers(driversRes);
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//       setExpenses([]);
//       setCars([]);
//       setAssignments([]);
//       setDrivers([]);
//     }
//   };

//   const getCarName = (carId) => {
//     const car = cars.find((c) => Number(c.id) === Number(carId));
//     return car
//       ? `${car.make} ${car.model} - ${car.registration_number}`
//       : `Car ${carId}`;
//   };

//   const getDriverNameForExpense = (carId, expenseDate) => {
//     const matchedAssignment = assignments.find((assignment) => {
//       const sameCar = Number(assignment.car) === Number(carId);
//       const expense = new Date(expenseDate);
//       const start = new Date(assignment.start_date);
//       const end = assignment.end_date ? new Date(assignment.end_date) : null;

//       return sameCar && expense >= start && (!end || expense <= end);
//     });

//     if (!matchedAssignment) return "No assigned driver";

//     const driver = drivers.find(
//       (d) => Number(d.id) === Number(matchedAssignment.driver)
//     );

//     return driver ? driver.user_name || `Driver ${driver.id}` : "Unknown Driver";
//   };

//   const deleteExpense = async (id) => {
//     if (!window.confirm("Delete this expense?")) return;

//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`);
//       alert("Expense deleted");
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       alert("Failed to delete expense");
//     }
//   };

//   const filteredExpenses = expenses.filter((exp) =>
//     `${getCarName(exp.car)} ${getDriverNameForExpense(
//       exp.car,
//       exp.expense_date
//     )} ${exp.amount} ${exp.expense_date} ${exp.category} ${exp.notes}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h4 className="mb-1">Expenses</h4>
//             <p className="text-muted mb-0">
//               Track car expenses with assigned driver details.
//             </p>
//           </div>

//           <Link to="/add-expense" className="btn btn-primary">
//             Add Expense
//           </Link>
//         </div>

//         <div className="card mb-4">
//           <div className="card-body">
//             <input
//               className="form-control"
//               placeholder="Search by car, driver, category, amount, date, or notes"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-body">
//             <div className="table-responsive">
//               <table className="table table-bordered table-hover align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>#</th>
//                     <th>Car</th>
//                     <th>Driver</th>
//                     <th>Amount</th>
//                     <th>Expense Date</th>
//                     <th>Category</th>
//                     <th>Notes</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredExpenses.length > 0 ? (
//                     filteredExpenses.map((exp, index) => (
//                       <tr key={exp.id}>
//                         <td>{index + 1}</td>
//                         <td>{getCarName(exp.car)}</td>
//                         <td>
//                           <strong>
//                             {getDriverNameForExpense(exp.car, exp.expense_date)}
//                           </strong>
//                         </td>
//                         <td>
//                           <strong>Rs. {exp.amount}</strong>
//                         </td>
//                         <td>{exp.expense_date}</td>
//                         <td>
//                           <span className="badge bg-info">{exp.category}</span>
//                         </td>
//                         <td>{exp.notes || "-"}</td>
//                         <td>
//                           <Link
//                             to={`/edit-expense/${exp.id}`}
//                             className="btn btn-sm btn-warning me-2"
//                           >
//                             Edit
//                           </Link>

//                           <button
//                             className="btn btn-sm btn-danger"
//                             onClick={() => deleteExpense(exp.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="8" className="text-center">
//                         No expenses found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Expenses;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [cars, setCars] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchData = async () => {
    try {
      const [expensesRes, carsRes, assignmentsRes, driversRes] =
        await Promise.all([
          axios.get(API_URL("/api/expenses/")),
          axios.get(API_URL("/api/cars/")),
          axios.get(API_URL("/api/assignments/")),
          axios.get(API_URL("/api/drivers/")),
        ]);

      setExpenses(normalizeResponse(expensesRes));
      setCars(normalizeResponse(carsRes));
      setAssignments(normalizeResponse(assignmentsRes));
      setDrivers(normalizeResponse(driversRes));
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
      setCars([]);
      setAssignments([]);
      setDrivers([]);
    }
  };

  const getCarName = (carId) => {
    const car = cars.find((c) => Number(c.id) === Number(carId));

    return car
      ? `${car.make} ${car.model} - ${car.registration_number}`
      : `Car ${carId}`;
  };

  const getDriverNameForExpense = (carId, expenseDate) => {
    const matchedAssignment = assignments.find((assignment) => {
      const sameCar = Number(assignment.car) === Number(carId);
      const expense = new Date(expenseDate);
      const start = new Date(assignment.start_date);
      const end = assignment.end_date ? new Date(assignment.end_date) : null;

      return sameCar && expense >= start && (!end || expense <= end);
    });

    if (!matchedAssignment) return "No assigned driver";

    const driver = drivers.find(
      (d) => Number(d.id) === Number(matchedAssignment.driver)
    );

    return driver ? driver.user_name || `Driver ${driver.id}` : "Unknown Driver";
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await axios.delete(API_URL(`/api/expenses/${id}/`));
      alert("Expense deleted");
      fetchData();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    }
  };

  const filteredExpenses = expenses.filter((exp) =>
    `${getCarName(exp.car)} ${getDriverNameForExpense(
      exp.car,
      exp.expense_date
    )} ${exp.amount} ${exp.expense_date} ${exp.category} ${exp.notes || ""} ${
      exp.invoice_receipt_url ? "invoice receipt uploaded" : "no invoice"
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Expenses</h4>
            <p className="text-muted mb-0">
              Track car expenses with assigned driver details and invoice/receipt records.
            </p>
          </div>

          <Link to="/add-expense" className="btn btn-primary">
            Add Expense
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <input
              className="form-control"
              placeholder="Search by car, driver, category, amount, date, notes, or invoice status"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Car</th>
                    <th>Driver</th>
                    <th>Amount</th>
                    <th>Expense Date</th>
                    <th>Category</th>
                    <th>Invoice / Receipt</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((exp, index) => (
                      <tr key={exp.id}>
                        <td>{index + 1}</td>

                        <td>{getCarName(exp.car)}</td>

                        <td>
                          <strong>
                            {getDriverNameForExpense(exp.car, exp.expense_date)}
                          </strong>
                        </td>

                        <td>
                          <strong>Rs. {exp.amount}</strong>
                        </td>

                        <td>{exp.expense_date}</td>

                        <td>
                          <span className="badge bg-info">{exp.category}</span>
                        </td>

                        <td>
                          {exp.invoice_receipt_url ? (
                            <a
                              href={exp.invoice_receipt_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              View Invoice
                            </a>
                          ) : (
                            <span className="badge bg-secondary">
                              Not Uploaded
                            </span>
                          )}
                        </td>

                        <td style={{ maxWidth: "260px", wordBreak: "break-word" }}>
                          {exp.notes || "-"}
                        </td>

                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <Link
                              to={`/edit-expense/${exp.id}`}
                              className="btn btn-sm btn-warning"
                            >
                              Edit
                            </Link>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteExpense(exp.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No expenses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="alert alert-info mt-3 mb-0">
              Invoice/receipt upload is optional, but recommended for fuel,
              maintenance, repair, and other expense proof.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;