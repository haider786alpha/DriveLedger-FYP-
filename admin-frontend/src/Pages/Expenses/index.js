import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Expenses.css";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [cars, setCars] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    expense: null,
    deleting: false,
  });

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

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
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

      showToast(
        "error",
        "Expenses Load Failed",
        "Could not load expense records. Please refresh and try again."
      );
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

  const getAssignmentIdForExpense = (carId, expenseDate) => {
    const matchedAssignment = assignments.find((assignment) => {
      const sameCar = Number(assignment.car) === Number(carId);
      const expense = new Date(expenseDate);
      const start = new Date(assignment.start_date);
      const end = assignment.end_date ? new Date(assignment.end_date) : null;

      return sameCar && expense >= start && (!end || expense <= end);
    });

    return matchedAssignment ? `Assignment ID #${matchedAssignment.id}` : "No matching assignment";
  };

  const openDeleteModal = (expense) => {
    setDeleteModal({
      open: true,
      expense,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      expense: null,
      deleting: false,
    });
  };

  const confirmDeleteExpense = async () => {
    if (!deleteModal.expense?.id) return;

    setDeleteModal((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await axios.delete(API_URL(`/api/expenses/${deleteModal.expense.id}/`));

      closeDeleteModal();

      showToast(
        "success",
        "Expense Deleted Successfully",
        "Expense entry has been removed from DriveLedger."
      );

      fetchData();
    } catch (error) {
      console.error("Error deleting expense:", error);

      setDeleteModal((prev) => ({
        ...prev,
        deleting: false,
      }));

      showToast(
        "error",
        "Delete Failed",
        "Expense could not be deleted. Please try again."
      );
    }
  };

  const filteredExpenses = expenses.filter((exp) =>
    `${getCarName(exp.car)} ${getDriverNameForExpense(
      exp.car,
      exp.expense_date
    )} ${getAssignmentIdForExpense(exp.car, exp.expense_date)} ${
      exp.amount || ""
    } ${exp.expense_date || ""} ${exp.category || ""} ${exp.notes || ""} ${
      exp.invoice_receipt_url ? "invoice receipt uploaded" : "no invoice"
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const invoiceCount = expenses.filter((exp) => exp.invoice_receipt_url).length;

  return (
    <div className="page-content driveledger-expenses">
      {toast && (
        <div className={`expense-toast expense-toast-${toast.type}`}>
          <div className="expense-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="expense-modal-backdrop">
          <div className="expense-modal-card">
            <div className="expense-modal-icon">!</div>

            <h5>Delete Expense Entry?</h5>

            <p>
              Are you sure you want to delete expense of{" "}
              <strong>Rs. {deleteModal.expense?.amount}</strong>? This action
              cannot be undone.
            </p>

            <div className="expense-modal-actions">
              <button
                type="button"
                className="expense-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="expense-modal-delete"
                onClick={confirmDeleteExpense}
                disabled={deleteModal.deleting}
              >
                {deleteModal.deleting ? "Deleting..." : "Delete Expense"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="expenses-hero expenses-reveal expenses-delay-1">
          <div>
            <div className="expenses-hero-pill">
              <span className="dl-status-dot"></span>
              Fleet Expense Tracking
            </div>

            <h4>Expenses</h4>
            <p>
              Track car expenses with assigned driver details, matching
              assignment information and invoice/receipt records.
            </p>
          </div>

          <Link to="/add-expense" className="expenses-add-btn">
            + Add Expense
          </Link>
        </div>

        <div className="expenses-search-card expenses-reveal expenses-delay-2">
          <input
            className="expenses-search-input"
            placeholder="Search by car, driver, assignment ID, category, amount, date, notes, or invoice status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="expenses-table-card expenses-reveal expenses-delay-3">
          <div className="expenses-table-header">
            <div>
              <h5>Expense List</h5>
              <p className="text-muted mb-0">
                Showing {filteredExpenses.length} of {expenses.length} expense
                records
              </p>
            </div>

            <span className="expenses-count">
              Rs. {totalExpenses} · {invoiceCount} Invoice Uploaded
            </span>
          </div>

          <div className="expenses-table-wrap">
            <table className="table table-hover align-middle expenses-table">
              <thead>
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

                      <td>
                        <div className="expense-car">{getCarName(exp.car)}</div>
                        <div className="expense-sub">
                          {getAssignmentIdForExpense(exp.car, exp.expense_date)}
                        </div>
                      </td>

                      <td>
                        <div className="expense-driver">
                          {getDriverNameForExpense(exp.car, exp.expense_date)}
                        </div>
                      </td>

                      <td>
                        <span className="expense-amount">Rs. {exp.amount}</span>
                      </td>

                      <td>
                        <span className="expense-date">
                          {exp.expense_date || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="expense-category-badge">
                          {exp.category}
                        </span>
                      </td>

                      <td>
                        {exp.invoice_receipt_url ? (
                          <a
                            href={exp.invoice_receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="expense-invoice-link"
                          >
                            View Invoice
                          </a>
                        ) : (
                          <span className="expense-muted-badge">
                            Not Uploaded
                          </span>
                        )}
                      </td>

                      <td className="expense-notes">{exp.notes || "-"}</td>

                      <td>
                        <div className="expenses-actions">
                          <Link
                            to={`/edit-expense/${exp.id}`}
                            className="expenses-edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="expenses-delete-btn"
                            onClick={() => openDeleteModal(exp)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="expenses-empty">
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="expenses-mobile-list">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp, index) => (
                <div className="expenses-mobile-card" key={exp.id}>
                  <div className="expenses-mobile-top">
                    <div>
                      <div className="expense-car">
                        {index + 1}. {getCarName(exp.car)}
                      </div>
                      <div className="expense-sub">
                        {getAssignmentIdForExpense(exp.car, exp.expense_date)}
                      </div>
                      <div className="expense-sub">
                        {getDriverNameForExpense(exp.car, exp.expense_date)}
                      </div>
                    </div>

                    <span className="expense-category-badge">
                      {exp.category}
                    </span>
                  </div>

                  <div className="expenses-mobile-row">
                    <span>Amount</span>
                    <strong>Rs. {exp.amount}</strong>
                  </div>

                  <div className="expenses-mobile-row">
                    <span>Date</span>
                    <strong>{exp.expense_date || "-"}</strong>
                  </div>

                  <div className="expenses-mobile-row">
                    <span>Invoice</span>
                    <strong>
                      {exp.invoice_receipt_url ? (
                        <a
                          href={exp.invoice_receipt_url}
                          target="_blank"
                          rel="noreferrer"
                          className="expense-invoice-link"
                        >
                          View
                        </a>
                      ) : (
                        "Not Uploaded"
                      )}
                    </strong>
                  </div>

                  <div className="expenses-mobile-row">
                    <span>Notes</span>
                    <strong>{exp.notes || "-"}</strong>
                  </div>

                  <div className="expenses-actions">
                    <Link
                      to={`/edit-expense/${exp.id}`}
                      className="expenses-edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="expenses-delete-btn"
                      onClick={() => openDeleteModal(exp)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="expenses-empty">No expenses found</div>
            )}
          </div>

          <div className="expenses-alert">
            <div className="expenses-alert-icon">i</div>
            <div>
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