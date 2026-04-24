import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/expenses/");
      setExpenses(response);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    }
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm("Delete this expense?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`);
      alert("Expense deleted");
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Expenses</h4>

          <Link to="/add-expense" className="btn btn-primary">
            Add Expense
          </Link>
        </div>

        <div className="card">
          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Car ID</th>
                  <th>Amount</th>
                  <th>Expense Date</th>
                  <th>Category</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(expenses) && expenses.length > 0 ? (
                  expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>{exp.id}</td>
                      <td>{exp.car}</td>
                      <td>Rs. {exp.amount}</td>
                      <td>{exp.expense_date}</td>
                      <td>{exp.category}</td>
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
                    <td colSpan="7" className="text-center">
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
  );
};

export default Expenses;