import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Assignments.css";

const AssignDriver = () => {
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
      const [driversRes, carsRes] = await Promise.all([
        axios.get(API_URL("/api/drivers/")),
        axios.get(API_URL("/api/cars/")),
      ]);

      setDrivers(normalizeResponse(driversRes));
      setCars(normalizeResponse(carsRes));
    } catch (error) {
      console.error("Error fetching form data:", error);
      setDrivers([]);
      setCars([]);

      showToast(
        "error",
        "Data Load Failed",
        "Could not load drivers and cars. Please refresh and try again."
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
      driver: formData.driver,
      car: formData.car,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      status: formData.status,
    };

    try {
      await axios.post(API_URL("/api/assignments/"), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      showToast(
        "success",
        "Car Assigned Successfully",
        "Driver and car assignment has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/assignments");
      }, 1000);
    } catch (error) {
      console.error("Error assigning car:", error.response?.data || error);

      showToast(
        "error",
        "Assignment Failed",
        "Car could not be assigned. Please check the form and try again."
      );
    } finally {
      setSaving(false);
    }
  };

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
              New Car Assignment
            </div>

            <h4>Assign Driver to Car</h4>
            <p>
              Select a driver, assign a vehicle, and set the assignment date and
              status.
            </p>
          </div>

          <Link to="/assignments" className="assignment-form-back-btn">
            ← Back to Assignments
          </Link>
        </div>

        <div className="assignment-form-card assignments-reveal assignments-delay-2">
          <div className="assignment-form-section-title">
            <h5>Assignment Information</h5>
            <p>Choose the driver and car details before saving assignment.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="assignment-form-label">Select Driver</label>
                <select
                  name="driver"
                  value={formData.driver}
                  onChange={handleChange}
                  className="assignment-form-select"
                  required
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.user_name || `Driver ${driver.id}`}{" "}
                      {driver.cnic ? `- ${driver.cnic}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="assignment-form-label">Select Car</label>
                <select
                  name="car"
                  value={formData.car}
                  onChange={handleChange}
                  className="assignment-form-select"
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
                label="Start Date"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />

              <FormField
                label="End Date"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />

              <div className="col-md-6 mb-3">
                <label className="assignment-form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="assignment-form-select"
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
                    {saving ? "Assigning..." : "Assign Driver"}
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
    />
  </div>
);

export default AssignDriver;