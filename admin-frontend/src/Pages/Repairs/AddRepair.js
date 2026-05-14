import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Repairs.css";

const AddRepair = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    car: "",
    issue: "",
    priority: "medium",
    status: "pending",
    reported_date: "",
    estimated_cost: "",
    actual_cost: "",
    notes: "",
    bill_receipt: null,
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
      payload.append("issue", formData.issue);
      payload.append("priority", formData.priority);
      payload.append("status", formData.status);
      payload.append("reported_date", formData.reported_date);
      payload.append("estimated_cost", formData.estimated_cost || 0);
      payload.append("actual_cost", formData.actual_cost || 0);
      payload.append("notes", formData.notes || "");

      if (formData.bill_receipt) {
        payload.append("bill_receipt", formData.bill_receipt);
      }

      await axios.post(API_URL("/api/repairs/"), payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(
        "success",
        "Repair Request Created",
        "Repair request has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/repairs");
      }, 1000);
    } catch (error) {
      console.error("Error creating repair:", error.response?.data || error);

      showToast(
        "error",
        "Create Repair Failed",
        "Repair request could not be created. Please check the form and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content driveledger-repairs">
      {toast && (
        <div className={`repair-toast repair-toast-${toast.type}`}>
          <div className="repair-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="repairs-hero repairs-reveal repairs-delay-1">
          <div>
            <div className="repairs-hero-pill">
              <span className="dl-status-dot"></span>
              New Repair Request
            </div>

            <h4>Create Repair Request</h4>
            <p>
              Record vehicle repair issue, priority, status, estimated cost and
              optional bill/receipt proof.
            </p>
          </div>

          <Link to="/repairs" className="repair-form-back-btn">
            ← Back to Repairs
          </Link>
        </div>

        <div className="repair-form-card repairs-reveal repairs-delay-2">
          <div className="repair-form-section-title">
            <h5>Repair Information</h5>
            <p>
              Select vehicle and enter repair details before saving the request.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="repair-form-label">Car</label>
                <select
                  name="car"
                  value={formData.car}
                  onChange={handleChange}
                  className="repair-form-select"
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
                label="Reported Date"
                type="date"
                name="reported_date"
                value={formData.reported_date}
                onChange={handleChange}
                required
              />

              <div className="col-md-12 mb-3">
                <label className="repair-form-label">Issue</label>
                <input
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  className="repair-form-input"
                  placeholder="Describe repair issue"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="repair-form-label">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="repair-form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="repair-form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="repair-form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <FormField
                label="Estimated Cost"
                type="number"
                name="estimated_cost"
                value={formData.estimated_cost}
                onChange={handleChange}
                placeholder="Estimated repair cost"
                required
              />

              <FormField
                label="Actual Cost"
                type="number"
                name="actual_cost"
                value={formData.actual_cost}
                onChange={handleChange}
                placeholder="Actual repair cost if available"
              />

              <div className="col-md-6 mb-3">
                <label className="repair-form-label">Bill / Receipt</label>
                <input
                  type="file"
                  name="bill_receipt"
                  onChange={handleChange}
                  className="repair-form-file"
                  accept="image/*,.pdf"
                />
                <small className="repair-form-help">
                  Upload repair bill or receipt image/PDF.
                </small>
              </div>

              <div className="col-md-12 mb-3">
                <label className="repair-form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="repair-form-textarea"
                  rows="3"
                  placeholder="Optional repair notes"
                />
              </div>

              <div className="col-md-12">
                <div className="repair-form-actions">
                  <Link to="/repairs" className="repair-form-cancel-btn">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="repair-form-save-btn"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Repair Request"}
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
}) => (
  <div className="col-md-6 mb-3">
    <label className="repair-form-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="repair-form-input"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default AddRepair;