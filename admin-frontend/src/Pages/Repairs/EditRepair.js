import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Repairs.css";

const EditRepair = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [existingRepairs, setExistingRepairs] = useState([]);
  const [existingBillUrl, setExistingBillUrl] = useState("");
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

  const formatDate = (value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
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
      const [carsRes, repairRes, repairsRes] = await Promise.all([
        axios.get(API_URL("/api/cars/")),
        axios.get(API_URL(`/api/repairs/${id}/`)),
        axios.get(API_URL("/api/repairs/")),
      ]);

      const data = repairRes.data || repairRes;

      setCars(normalizeResponse(carsRes));
      setExistingRepairs(normalizeResponse(repairsRes));

      setFormData({
        car: data.car || "",
        issue: data.issue || "",
        priority: data.priority || "medium",
        status: data.status || "pending",
        reported_date: formatDate(data.reported_date),
        estimated_cost: data.estimated_cost || "",
        actual_cost: data.actual_cost || "",
        notes: data.notes || "",
        bill_receipt: null,
      });

      setExistingBillUrl(data.bill_receipt_url || "");
    } catch (error) {
      console.error("Error fetching repair:", error);

      setCars([]);
      setExistingRepairs([]);

      showToast(
        "error",
        "Repair Load Failed",
        "Could not load repair details. Please go back and try again."
      );
    }
  };

  const validateRepairForm = () => {
    const issue = formData.issue.trim();
    const reportedDate = formData.reported_date;
    const estimatedCost = Number(formData.estimated_cost);
    const actualCost = Number(formData.actual_cost);
    const today = new Date().toISOString().split("T")[0];

    if (!formData.car) {
      return "Car is required. Please select a car.";
    }

    if (!reportedDate) {
      return "Reported date is required. Please select reported date.";
    }

    if (reportedDate > today) {
      return "Reported date cannot be in the future.";
    }

    if (!issue) {
      return "Repair issue is required. Please describe the repair issue.";
    }

    if (issue.length < 5) {
      return "Repair issue must be at least 5 characters long.";
    }

    const allowedPriorities = ["low", "medium", "high"];

    if (!formData.priority) {
      return "Priority is required. Please select repair priority.";
    }

    if (!allowedPriorities.includes(formData.priority)) {
      return "Priority is invalid. Please select Low, Medium, or High.";
    }

    const allowedStatuses = ["pending", "in_progress", "completed"];

    if (!formData.status) {
      return "Repair status is required. Please select repair status.";
    }

    if (!allowedStatuses.includes(formData.status)) {
      return "Repair status is invalid. Please select Pending, In Progress, or Completed.";
    }

    if (formData.estimated_cost === "" || formData.estimated_cost === null) {
      return "Estimated cost is required. Please enter estimated repair cost.";
    }

    if (Number.isNaN(estimatedCost)) {
      return "Estimated cost must be a valid number.";
    }

    if (estimatedCost < 0) {
      return "Estimated cost cannot be negative.";
    }

    if (formData.actual_cost !== "" && formData.actual_cost !== null) {
      if (Number.isNaN(actualCost)) {
        return "Actual cost must be a valid number.";
      }

      if (actualCost < 0) {
        return "Actual cost cannot be negative.";
      }
    }

    if (formData.status === "completed") {
      if (formData.actual_cost === "" || formData.actual_cost === null) {
        return "Actual cost is required when repair is completed.";
      }
    }

    const duplicateOpenRepair = existingRepairs.some(
      (repair) =>
        Number(repair.id) !== Number(id) &&
        Number(repair.car) === Number(formData.car) &&
        String(repair.issue).trim().toLowerCase() === issue.toLowerCase() &&
        String(repair.status).toLowerCase() !== "completed"
    );

    if (formData.status !== "completed" && duplicateOpenRepair) {
      return "This car already has an open repair with the same issue.";
    }

    if (formData.bill_receipt) {
      const allowedFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      const maxFileSize = 5 * 1024 * 1024;

      if (!allowedFileTypes.includes(formData.bill_receipt.type)) {
        return "Bill receipt must be JPG, JPEG, PNG, WEBP, or PDF.";
      }

      if (formData.bill_receipt.size > maxFileSize) {
        return "Bill receipt size must not exceed 5 MB.";
      }
    }

    return "";
  };

  const getRepairErrorMessage = (error) => {
    const data = error.response?.data;
    const text = data ? JSON.stringify(data).toLowerCase() : "";

    if (text.includes("car")) {
      return "Car is invalid or required. Please select a valid car.";
    }

    if (text.includes("issue")) {
      return "Repair issue is invalid. Issue must be at least 5 characters long.";
    }

    if (text.includes("priority")) {
      return "Priority is invalid. Please select Low, Medium, or High.";
    }

    if (text.includes("status")) {
      return "Repair status is invalid. Please select a valid status.";
    }

    if (text.includes("reported_date") || text.includes("reported date")) {
      return "Reported date is invalid. Reported date cannot be in the future.";
    }

    if (text.includes("estimated_cost") || text.includes("estimated cost")) {
      return "Estimated cost is invalid. Estimated cost cannot be negative.";
    }

    if (text.includes("actual_cost") || text.includes("actual cost")) {
      return "Actual cost is invalid or required when repair is completed.";
    }

    if (
      text.includes("bill_receipt") ||
      text.includes("bill") ||
      text.includes("receipt")
    ) {
      return "Bill receipt must be JPG, JPEG, PNG, WEBP, or PDF and must not exceed 5 MB.";
    }

    if (
      text.includes("duplicate") ||
      text.includes("already exists") ||
      text.includes("open repair") ||
      text.includes("same issue")
    ) {
      return "This car already has an open repair with the same issue.";
    }

    return "Repair record could not be updated. Please check car, issue, date, cost, status, and bill file.";
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
    payload.append("issue", formData.issue.trim());
    payload.append("priority", formData.priority);
    payload.append("status", formData.status);
    payload.append("reported_date", formData.reported_date);
    payload.append("estimated_cost", formData.estimated_cost);
    payload.append("notes", formData.notes || "");

    if (formData.actual_cost !== "" && formData.actual_cost !== null) {
      payload.append("actual_cost", formData.actual_cost);
    }

    if (formData.bill_receipt) {
      payload.append("bill_receipt", formData.bill_receipt);
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    const validationError = validateRepairForm();

    if (validationError) {
      showToast("error", "Invalid Repair Form", validationError);
      return;
    }

    setSaving(true);

    try {
      await axios.patch(API_URL(`/api/repairs/${id}/`), cleanPayload(), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(
        "success",
        "Repair Updated Successfully",
        "Repair record has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/repairs");
      }, 1000);
    } catch (error) {
      console.error("Error updating repair:", error.response?.data || error);

      showToast(
        "error",
        "Update Failed",
        getRepairErrorMessage(error)
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
              Update Repair Record
            </div>

            <h4>Edit Repair</h4>
            <p>
              Update repair issue, priority, status, costs, notes and
              bill/receipt proof.
            </p>
          </div>

          <Link to="/repairs" className="repair-form-back-btn">
            ← Back to Repairs
          </Link>
        </div>

        <div className="repair-form-card repairs-reveal repairs-delay-2">
          <div className="repair-form-section-title">
            <h5>Repair Information</h5>
            <p>Review and update this repair record before saving changes.</p>
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
                placeholder="Required if status is completed"
              />

              <div className="col-md-6 mb-3">
                <label className="repair-form-label">Bill / Receipt</label>
                <input
                  type="file"
                  name="bill_receipt"
                  onChange={handleChange}
                  className="repair-form-file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,.pdf"
                />

                {existingBillUrl ? (
                  <div className="repair-existing-preview">
                    <a
                      href={existingBillUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="repair-bill-link"
                    >
                      View Current Bill / Receipt
                    </a>
                  </div>
                ) : (
                  <small className="repair-form-help">
                    No bill or receipt uploaded. Upload JPG, JPEG, PNG, WEBP, or
                    PDF. Maximum size 5 MB.
                  </small>
                )}
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
                    {saving ? "Updating..." : "Update Repair"}
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

export default EditRepair;