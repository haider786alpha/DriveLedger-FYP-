import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Assignments.css";

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    driver: "",
    car: "",
    start_date: "",
    end_date: "",
    status: "active",
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
      const [assignmentRes, driversRes, carsRes] = await Promise.all([
        axios.get(API_URL(`/api/assignments/${id}/`)),
        axios.get(API_URL("/api/drivers/")),
        axios.get(API_URL("/api/cars/")),
      ]);

      const assignmentData = assignmentRes.data || assignmentRes;

      setFormData({
        driver: assignmentData.driver || "",
        car: assignmentData.car || "",
        start_date: assignmentData.start_date || "",
        end_date: assignmentData.end_date || "",
        status: assignmentData.status || "active",
      });

      setDrivers(normalizeResponse(driversRes));
      setCars(normalizeResponse(carsRes));
    } catch (error) {
      console.error("Edit assignment load error:", error);

      showToast(
        "error",
        "Assignment Load Failed",
        "Could not load assignment details. Please go back and try again."
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    const payload = {
      ...formData,
      end_date: formData.end_date || null,
    };

    try {
      await axios.put(API_URL(`/api/assignments/${id}/`), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      showToast(
        "success",
        "Assignment Updated Successfully",
        "Assignment details have been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/assignments");
      }, 1000);
    } catch (error) {
      console.error("Update error:", error.response?.data || error);

      showToast(
        "error",
        "Update Failed",
        "Assignment could not be updated. Please check the form and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const isActiveAssignment = formData.status === "active";

  return (
    <div className="page-content driveledger-assignments">
      {toast && (
        <div className={`assignment-toast assignment-toast-${toast.type}`}>
          <div className="assignment-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="assignments-hero assignments-reveal assignments-delay-1">
          <div>
            <div className="assignments-hero-pill">
              <span className="dl-status-dot"></span>
              Update Assignment
            </div>

            <h4>Edit Assignment</h4>
            <p>
              Update assignment end date or complete an active driver-car
              assignment.
            </p>
          </div>

          <Link to="/assignments" className="assignment-form-back-btn">
            ← Back to Assignments
          </Link>
        </div>

        {isActiveAssignment && (
          <div className="assignment-lock-alert assignments-reveal assignments-delay-2">
            <div className="assignment-lock-icon">!</div>
            <div>
              <strong>Active Assignment Locked:</strong> Driver, car and start
              date cannot be changed while the assignment is active. You can only
              update end date or status.
            </div>
          </div>
        )}

        <div className="assignment-form-card assignments-reveal assignments-delay-3">
          <div className="assignment-form-section-title">
            <h5>Assignment Information</h5>
            <p>Review and update this assignment before saving changes.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="assignment-form-label">Driver</label>
                <select
                  name="driver"
                  className="assignment-form-select"
                  value={formData.driver}
                  onChange={handleChange}
                  disabled={isActiveAssignment}
                  required
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user_name || `Driver ${d.id}`}
                    </option>
                  ))}
                </select>
                {isActiveAssignment && (
                  <small className="assignment-form-help">
                    Locked because assignment is currently active.
                  </small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="assignment-form-label">Car</label>
                <select
                  name="car"
                  className="assignment-form-select"
                  value={formData.car}
                  onChange={handleChange}
                  disabled={isActiveAssignment}
                  required
                >
                  <option value="">Select Car</option>
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.make} {c.model}{" "}
                      {c.registration_number ? `- ${c.registration_number}` : ""}
                    </option>
                  ))}
                </select>
                {isActiveAssignment && (
                  <small className="assignment-form-help">
                    Locked because assignment is currently active.
                  </small>
                )}
              </div>

              <FormField
                label="Start Date"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                disabled={isActiveAssignment}
                required
                help={
                  isActiveAssignment
                    ? "Locked because assignment is currently active."
                    : ""
                }
              />

              <FormField
                label="End Date"
                type="date"
                name="end_date"
                value={formData.end_date || ""}
                onChange={handleChange}
              />

              <div className="col-md-6 mb-3">
                <label className="assignment-form-label">Status</label>
                <select
                  name="status"
                  className="assignment-form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="col-md-12">
                <div className="assignment-form-actions">
                  <Link to="/assignments" className="assignment-form-cancel-btn">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="assignment-form-save-btn"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Assignment"}
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
  disabled = false,
  help = "",
}) => (
  <div className="col-md-6 mb-3">
    <label className="assignment-form-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="assignment-form-input"
      required={required}
      disabled={disabled}
    />
    {help && <small className="assignment-form-help">{help}</small>}
  </div>
);

export default EditAssignment;