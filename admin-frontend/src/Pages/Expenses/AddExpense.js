import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Expenses.css";

const AddExpense = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [existingExpenses, setExistingExpenses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    car: "",
    amount: "",
    expense_date: "",
    category: "",
    notes: "",
    invoice_receipt: null,
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

    if (type === "error") {
      setTimeout(() => {
        setToast(null);
      }, 3500);
    }
  };

  const fetchData = async () => {
    try {
      const [carsRes, expensesRes] = await Promise.all([
        axios.get(API_URL("/api/cars/")),
        axios.get(API_URL("/api/expenses/")),
      ]);

      setCars(normalizeResponse(carsRes));
      setExistingExpenses(normalizeResponse(expensesRes));
    } catch (error) {
      console.error("Error fetching expense form data:", error);

      setCars([]);
      setExistingExpenses([]);

      showToast(
        "error",
        "Data Load Failed",
        "Could not load cars and expenses. Please refresh and try again."
      );
    }
  };

  const validateExpenseForm = () => {
    const amount = Number(formData.amount);
    const today = new Date().toISOString().split("T")[0];

    if (!formData.car) {
      return "Car is required. Please select a car.";
    }

    if (!formData.expense_date) {
      return "Expense date is required. Please select expense date.";
    }

    if (formData.expense_date > today) {
      return "Expense date cannot be in the future.";
    }

    if (formData.amount === "" || formData.amount === null) {
      return "Amount is required. Please enter expense amount.";
    }

    if (Number.isNaN(amount)) {
      return "Amount must be a valid number.";
    }

    if (amount <= 0) {
      return "Amount must be greater than 0.";
    }

    if (!formData.category) {
      return "Expense category is required. Please select category.";
    }

    const allowedCategories = [
      "Fuel",
      "Maintenance",
      "Oil Change",
      "Repair",
      "Other",
    ];

    if (!allowedCategories.includes(formData.category)) {
      return "Expense category is invalid. Please select a valid category.";
    }

    const duplicateExpense = existingExpenses.some(
      (expense) =>
        Number(expense.car) === Number(formData.car) &&
        Number(expense.amount) === amount &&
        String(expense.expense_date).slice(0, 10) === formData.expense_date &&
        String(expense.category).toLowerCase() ===
          formData.category.toLowerCase()
    );

    if (duplicateExpense) {
      return "This expense already exists for the selected car, date, amount, and category.";
    }

    if (formData.invoice_receipt) {
      const allowedFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      const maxFileSize = 5 * 1024 * 1024;

      if (!allowedFileTypes.includes(formData.invoice_receipt.type)) {
        return "Invoice receipt must be JPG, JPEG, PNG, WEBP, or PDF.";
      }

      if (formData.invoice_receipt.size > maxFileSize) {
        return "Invoice receipt size must not exceed 5 MB.";
      }
    }

    return "";
  };

  const getExpenseErrorMessage = (error) => {
    const data = error.response?.data;
    const text = data ? JSON.stringify(data).toLowerCase() : "";

    if (text.includes("car")) {
      return "Car is invalid or required. Please select a valid car.";
    }

    if (text.includes("amount")) {
      return "Amount is invalid. Amount must be greater than 0.";
    }

    if (text.includes("expense_date") || text.includes("expense date")) {
      return "Expense date is invalid. Date cannot be in the future.";
    }

    if (text.includes("category")) {
      return "Expense category is invalid or required. Please select a valid category.";
    }

    if (
      text.includes("invoice_receipt") ||
      text.includes("invoice") ||
      text.includes("receipt")
    ) {
      return "Invoice receipt must be JPG, JPEG, PNG, WEBP, or PDF and must not exceed 5 MB.";
    }

    if (
      text.includes("duplicate") ||
      text.includes("already exists") ||
      text.includes("already")
    ) {
      return "This expense already exists for the selected car, date, amount, and category.";
    }

    return "Expense could not be added. Please check car, date, amount, category, and invoice file.";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({
        ...formData,
        [name]: files.length > 0 ? files[0] : null,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const cleanPayload = () => {
    const payload = new FormData();

    payload.append("car", formData.car);
    payload.append("amount", formData.amount);
    payload.append("expense_date", formData.expense_date);
    payload.append("category", formData.category);
    payload.append("notes", formData.notes || "");

    if (formData.invoice_receipt) {
      payload.append("invoice_receipt", formData.invoice_receipt);
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    const validationError = validateExpenseForm();

    if (validationError) {
      showToast("error", "Invalid Expense Form", validationError);
      return;
    }

    setSaving(true);

    try {
      await axios.post(API_URL("/api/expenses/"), cleanPayload(), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(
        "success",
        "Expense Added Successfully",
        "Expense entry has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/expenses");
      }, 1000);
    } catch (error) {
      console.error("Error adding expense:", error.response?.data || error);

      showToast(
        "error",
        "Add Expense Failed",
        getExpenseErrorMessage(error)
      );
    } finally {
      setSaving(false);
    }
  };

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

      <div className="container-fluid">
        <div className="expenses-hero expenses-reveal expenses-delay-1">
          <div>
            <div className="expenses-hero-pill">
              <span className="dl-status-dot"></span>
              New Expense Entry
            </div>

            <h4>Add Expense</h4>
            <p>
              Record car expenses with category, amount, date, notes and
              optional invoice/receipt proof.
            </p>
          </div>

          <Link to="/expenses" className="expense-form-back-btn">
            ← Back to Expenses
          </Link>
        </div>

        <div className="expense-form-card expenses-reveal expenses-delay-2">
          <div className="expense-form-section-title">
            <h5>Expense Information</h5>
            <p>
              Select the car and enter expense details. Invoice upload is
              optional but recommended.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="expense-form-label">Car</label>
                <select
                  name="car"
                  value={formData.car}
                  onChange={handleChange}
                  className="expense-form-select"
                  required
                >
                  <option value="">Select Car</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.make} {car.model} - {car.registration_number}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="Expense Date"
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleChange}
                required
              />

              <FormField
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter expense amount"
                required
              />

              <div className="col-md-6 mb-3">
                <label className="expense-form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="expense-form-select"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Oil Change">Oil Change</option>
                  <option value="Repair">Repair</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="expense-form-label">Invoice / Receipt</label>
                <input
                  type="file"
                  name="invoice_receipt"
                  onChange={handleChange}
                  className="expense-form-file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,.pdf"
                />
                <small className="expense-form-help">
                  Upload JPG, JPEG, PNG, WEBP, or PDF. Maximum size 5 MB.
                </small>
              </div>

              <div className="col-md-12 mb-3">
                <label className="expense-form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="expense-form-textarea"
                  rows="3"
                  placeholder="Optional expense notes"
                />
              </div>

              <div className="col-md-12">
                <div className="expense-form-actions">
                  <Link to="/expenses" className="expense-form-cancel-btn">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="expense-form-save-btn"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Expense"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  help = "",
}) => (
  <div className="col-md-6 mb-3">
    <label className="expense-form-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="expense-form-input"
      placeholder={placeholder}
      required={required}
    />
    {help && <small className="expense-form-help">{help}</small>}
  </div>
);

export default AddExpense;