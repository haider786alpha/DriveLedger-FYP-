import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Expenses.css";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [existingInvoiceUrl, setExistingInvoiceUrl] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const [carsRes, expenseRes] = await Promise.all([
        axios.get(API_URL("/api/cars/")),
        axios.get(API_URL(`/api/expenses/${id}/`)),
      ]);

      const data = expenseRes.data || expenseRes;

      setCars(normalizeResponse(carsRes));

      setFormData({
        car: data.car || "",
        amount: data.amount || "",
        expense_date: data.expense_date || "",
        category: data.category || "",
        notes: data.notes || "",
        invoice_receipt: null,
      });

      setExistingInvoiceUrl(data.invoice_receipt_url || "");
    } catch (error) {
      console.error("Error fetching expense:", error);

      setCars([]);

      showToast(
        "error",
        "Expense Load Failed",
        "Could not load expense details. Please go back and try again."
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

      await axios.patch(API_URL(`/api/expenses/${id}/`), payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(
        "success",
        "Expense Updated Successfully",
        "Expense entry has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/expenses");
      }, 1000);
    } catch (error) {
      console.error("Error updating expense:", error.response?.data || error);

      showToast(
        "error",
        "Update Failed",
        "Expense could not be updated. Please check the form and try again."
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
              Update Expense Entry
            </div>

            <h4>Edit Expense</h4>
            <p>
              Update car expense details, amount, category, notes and
              invoice/receipt proof.
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
              Review and update this expense record before saving changes.
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
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter expense amount"
                required
              />

              <FormField
                label="Expense Date"
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleChange}
                help="Your backend can auto-set the date when creating an expense."
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

                {existingInvoiceUrl ? (
                  <div className="expense-existing-preview">
                    <a
                      href={existingInvoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="expense-invoice-link"
                    >
                      View Current Invoice / Receipt
                    </a>
                  </div>
                ) : (
                  <small className="expense-form-help">
                    No invoice or receipt uploaded.
                  </small>
                )}
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
                    {saving ? "Updating..." : "Update Expense"}
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

export default EditExpense;