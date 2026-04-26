// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const Expenses = () => {
//   const [expenses, setExpenses] = useState([]);

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/expenses/");
//       setExpenses(response);
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//       setExpenses([]);
//     }
//   };

//   const deleteExpense = async (id) => {
//     const confirmDelete = window.confirm("Delete this expense?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`);
//       alert("Expense deleted");
//       fetchExpenses();
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       alert("Failed to delete expense");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 className="mb-0">Expenses</h4>

//           <Link to="/add-expense" className="btn btn-primary">
//             Add Expense
//           </Link>
//         </div>

//         <div className="card">
//           <div className="card-body">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Car ID</th>
//                   <th>Amount</th>
//                   <th>Expense Date</th>
//                   <th>Category</th>
//                   <th>Notes</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {Array.isArray(expenses) && expenses.length > 0 ? (
//                   expenses.map((exp) => (
//                     <tr key={exp.id}>
//                       <td>{exp.id}</td>
//                       <td>{exp.car}</td>
//                       <td>Rs. {exp.amount}</td>
//                       <td>{exp.expense_date}</td>
//                       <td>{exp.category}</td>
//                       <td>{exp.notes || "-"}</td>

//                       <td>
//                         <Link
//                           to={`/edit-expense/${exp.id}`}
//                           className="btn btn-sm btn-warning me-2"
//                         >
//                           Edit
//                         </Link>

//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => deleteExpense(exp.id)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       No expenses found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
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

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [cars, setCars] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesRes, carsRes, assignmentsRes, driversRes] =
        await Promise.all([
          axios.get("http://127.0.0.1:8000/api/expenses/"),
          axios.get("http://127.0.0.1:8000/api/cars/"),
          axios.get("http://127.0.0.1:8000/api/assignments/"),
          axios.get("http://127.0.0.1:8000/api/drivers/"),
        ]);

      setExpenses(expensesRes);
      setCars(carsRes);
      setAssignments(assignmentsRes);
      setDrivers(driversRes);
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
      await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`);
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
    )} ${exp.amount} ${exp.expense_date} ${exp.category} ${exp.notes}`
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
              Track car expenses with assigned driver details.
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
              placeholder="Search by car, driver, category, amount, date, or notes"
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
                        <td>{exp.notes || "-"}</td>
                        <td>
                          <Link
                            to={`/edit-expense/${exp.id}`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteExpense(exp.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No expenses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;