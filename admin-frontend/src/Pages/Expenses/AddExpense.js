import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Expenses.css";

const AddExpense = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
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
    fetchCars();
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

  const fetchCars = async () => {
    try {
      const response = await axios.get(API_URL("/api/cars/"));
      setCars(normalizeResponse(response));
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);

      showToast(
        "error",
        "Cars Load Failed",
        "Could not load car records. Please refresh and try again."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const payload = new FormData();

      payload.append("car", formData.car);
      payload.append("amount", formData.amount);
      payload.append("category", formData.category);
      payload.append("notes", formData.notes || "");

      if (formData.expense_date) {
        payload.append("expense_date", formData.expense_date);
      }

      if (formData.invoice_receipt) {
        payload.append("invoice_receipt", formData.invoice_receipt);
      }

      await axios.post(API_URL("/api/expenses/"), payload, {
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
        "Expense could not be added. Please check the form and try again."
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
                help="If left empty, backend will use today's date."
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
                  accept="image/*,.pdf"
                />
                <small className="expense-form-help">
                  Upload expense invoice or receipt image/PDF.
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