// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { API_URL } from "../../helpers/apiConfig";
// import "./Cars.css";

// const AddCar = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     make: "",
//     model: "",
//     year: "",
//     registration_number: "",
//     mileage: "",
//     condition: "",
//     notes: "",
//     last_service_date: "",
//     next_maintenance_date: "",
//     current_mileage: "",
//     insurance_expiry: "",
//     registration_expiry: "",
//   });

//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState(null);

//   const showToast = (type, title, message) => {
//     setToast({ type, title, message });

//     if (type === "error") {
//       setTimeout(() => {
//         setToast(null);
//       }, 3500);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const cleanPayload = () => {
//     return {
//       ...formData,
//       notes: formData.notes || null,
//       last_service_date: formData.last_service_date || null,
//       next_maintenance_date: formData.next_maintenance_date || null,
//       current_mileage: formData.current_mileage || null,
//       insurance_expiry: formData.insurance_expiry || null,
//       registration_expiry: formData.registration_expiry || null,
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setToast(null);

//     try {
//       await axios.post(API_URL("/api/cars/"), cleanPayload(), {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       showToast(
//         "success",
//         "Car Added Successfully",
//         "New vehicle record has been saved in DriveLedger."
//       );

//       setTimeout(() => {
//         navigate("/cars");
//       }, 1000);
//     } catch (error) {
//       console.error("Error adding car:", error.response?.data || error);

//       showToast(
//         "error",
//         "Add Car Failed",
//         "Car could not be added. Please check the form and try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="page-content driveledger-cars">
//       {toast && (
//         <div className={`car-toast car-toast-${toast.type}`}>
//           <div className="car-toast-icon">
//             {toast.type === "success" ? "✓" : "!"}
//           </div>
//           <div>
//             <strong>{toast.title}</strong>
//             <span>{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="container-fluid">
//         <div className="cars-hero cars-reveal cars-delay-1">
//           <div>
//             <div className="cars-hero-pill">
//               <span className="dl-status-dot"></span>
//               New Vehicle Record
//             </div>

//             <h4>Add New Car</h4>
//             <p>
//               Register a new fleet vehicle with mileage, maintenance, insurance,
//               and registration details.
//             </p>
//           </div>

//           <Link to="/cars" className="car-form-back-btn">
//             ← Back to Cars
//           </Link>
//         </div>

//         <div className="car-form-card cars-reveal cars-delay-2">
//           <div className="car-form-section-title">
//             <h5>Vehicle Information</h5>
//             <p>Fill in the required details before saving the car record.</p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="row">
//               <FormField
//                 label="Make"
//                 name="make"
//                 value={formData.make}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Model"
//                 name="model"
//                 value={formData.model}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Year"
//                 type="number"
//                 name="year"
//                 value={formData.year}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Registration Number"
//                 name="registration_number"
//                 value={formData.registration_number}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Mileage"
//                 type="number"
//                 name="mileage"
//                 value={formData.mileage}
//                 onChange={handleChange}
//                 required
//               />

//               <FormField
//                 label="Current Mileage"
//                 type="number"
//                 name="current_mileage"
//                 value={formData.current_mileage}
//                 onChange={handleChange}
//                 placeholder="Optional current mileage"
//               />

//               <div className="col-md-6 mb-3">
//                 <label className="car-form-label">Condition</label>
//                 <select
//                   name="condition"
//                   value={formData.condition}
//                   onChange={handleChange}
//                   className="car-form-select"
//                   required
//                 >
//                   <option value="">Select condition</option>
//                   <option value="Good">Good</option>
//                   <option value="Average">Average</option>
//                   <option value="Needs Maintenance">Needs Maintenance</option>
//                 </select>
//               </div>

//               <FormField
//                 label="Last Service Date"
//                 type="date"
//                 name="last_service_date"
//                 value={formData.last_service_date}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Next Maintenance Date"
//                 type="date"
//                 name="next_maintenance_date"
//                 value={formData.next_maintenance_date}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Insurance Expiry"
//                 type="date"
//                 name="insurance_expiry"
//                 value={formData.insurance_expiry}
//                 onChange={handleChange}
//               />

//               <FormField
//                 label="Registration Expiry"
//                 type="date"
//                 name="registration_expiry"
//                 value={formData.registration_expiry}
//                 onChange={handleChange}
//               />

//               <div className="col-md-12 mb-3">
//                 <label className="car-form-label">Notes</label>
//                 <textarea
//                   name="notes"
//                   value={formData.notes}
//                   onChange={handleChange}
//                   className="car-form-textarea"
//                   rows="3"
//                   placeholder="Optional notes about this car"
//                 />
//               </div>

//               <div className="col-md-12">
//                 <div className="car-form-actions">
//                   <Link to="/cars" className="car-form-cancel-btn">
//                     Cancel
//                   </Link>

//                   <button
//                     type="submit"
//                     className="car-form-save-btn"
//                     disabled={saving}
//                   >
//                     {saving ? "Saving..." : "Save Car"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FormField = ({
//   label,
//   name,
//   value,
//   onChange,
//   type = "text",
//   required = false,
//   placeholder = "",
// }) => (
//   <div className="col-md-6 mb-3">
//     <label className="car-form-label">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="car-form-input"
//       required={required}
//       placeholder={placeholder}
//     />
//   </div>
// );

// export default AddCar;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";
import "./Cars.css";

const AddCar = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    registration_number: "",
    mileage: "",
    condition: "",
    notes: "",
    last_service_date: "",
    next_maintenance_date: "",
    current_mileage: "",
    insurance_expiry: "",
    registration_expiry: "",
  });

  const [existingCars, setExistingCars] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchExistingCars();
  }, []);

  const normalizeResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.results)) return data.data.results;
    return [];
  };

  const fetchExistingCars = async () => {
    try {
      const response = await axios.get(API_URL("/api/cars/"));
      setExistingCars(normalizeResponse(response.data));
    } catch (error) {
      console.log("Cars list could not be loaded:", error.message);
      setExistingCars([]);
    }
  };

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    if (type === "error") {
      setTimeout(() => {
        setToast(null);
      }, 3500);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateCarForm = () => {
    const make = formData.make.trim();
    const model = formData.model.trim();
    const registrationNumber = formData.registration_number.trim().toUpperCase();
    const year = Number(formData.year);
    const mileage = Number(formData.mileage);
    const currentMileage = Number(formData.current_mileage);
    const currentYear = new Date().getFullYear();

    if (!make) {
      return "Make is required. Please enter car make.";
    }

    if (make.length < 2) {
      return "Make must be at least 2 characters long.";
    }

    if (!model) {
      return "Model is required. Please enter car model.";
    }

    if (!formData.year) {
      return "Year is required. Please enter car year.";
    }

    if (Number.isNaN(year)) {
      return "Year must be a valid number.";
    }

    if (year < 1980) {
      return "Year cannot be less than 1980.";
    }

    if (year > currentYear + 1) {
      return "Year cannot be in the far future.";
    }

    if (!registrationNumber) {
      return "Registration number is required. Please enter registration number.";
    }

    const registrationAlreadyExists = existingCars.some(
      (car) =>
        car.registration_number &&
        car.registration_number.trim().toUpperCase() === registrationNumber
    );

    if (registrationAlreadyExists) {
      return "This registration number is already registered. Please enter a different registration number.";
    }

    if (formData.mileage === "" || formData.mileage === null) {
      return "Mileage is required. Please enter mileage.";
    }

    if (Number.isNaN(mileage)) {
      return "Mileage must be a valid number.";
    }

    if (mileage < 0) {
      return "Mileage cannot be negative.";
    }

    if (formData.current_mileage !== "" && formData.current_mileage !== null) {
      if (Number.isNaN(currentMileage)) {
        return "Current mileage must be a valid number.";
      }

      if (currentMileage < 0) {
        return "Current mileage cannot be negative.";
      }

      if (currentMileage < mileage) {
        return "Current mileage cannot be less than mileage.";
      }
    }

    if (!formData.condition) {
      return "Condition is required. Please select car condition.";
    }

    const allowedConditions = ["Good", "Average", "Needs Maintenance"];

    if (!allowedConditions.includes(formData.condition)) {
      return "Condition is invalid. Please select a valid car condition.";
    }

    if (formData.last_service_date && formData.next_maintenance_date) {
      if (formData.next_maintenance_date < formData.last_service_date) {
        return "Next maintenance date cannot be before last service date.";
      }
    }

    const today = new Date().toISOString().split("T")[0];

    if (formData.insurance_expiry && formData.insurance_expiry < today) {
      return "Insurance expiry date cannot be in the past.";
    }

    if (formData.registration_expiry && formData.registration_expiry < today) {
      return "Registration expiry date cannot be in the past.";
    }

    return "";
  };

  const getCarErrorMessage = (error) => {
    const data = error.response?.data;
    const text = data ? JSON.stringify(data).toLowerCase() : "";

    if (text.includes("registration")) {
      return "This registration number is already registered. Please enter a different registration number.";
    }

    if (text.includes("make")) {
      return "Make is invalid. Please enter a valid car make.";
    }

    if (text.includes("model")) {
      return "Model is invalid. Please enter a valid car model.";
    }

    if (text.includes("year")) {
      return "Year is invalid. Please enter a valid car year.";
    }

    if (text.includes("mileage")) {
      return "Mileage is invalid. Mileage values cannot be negative.";
    }

    if (text.includes("condition")) {
      return "Condition is invalid. Please select a valid car condition.";
    }

    if (text.includes("insurance")) {
      return "Insurance expiry date is invalid. It cannot be in the past.";
    }

    if (text.includes("maintenance")) {
      return "Next maintenance date cannot be before last service date.";
    }

    return "Car could not be added. Please check registration number, year, mileage, condition, and dates.";
  };

  const cleanPayload = () => {
    return {
      ...formData,
      make: formData.make.trim(),
      model: formData.model.trim(),
      registration_number: formData.registration_number.trim().toUpperCase(),
      notes: formData.notes || null,
      last_service_date: formData.last_service_date || null,
      next_maintenance_date: formData.next_maintenance_date || null,
      current_mileage: formData.current_mileage || null,
      insurance_expiry: formData.insurance_expiry || null,
      registration_expiry: formData.registration_expiry || null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    const validationError = validateCarForm();

    if (validationError) {
      showToast("error", "Invalid Car Form", validationError);
      return;
    }

    setSaving(true);

    try {
      await axios.post(API_URL("/api/cars/"), cleanPayload(), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      showToast(
        "success",
        "Car Added Successfully",
        "New vehicle record has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/cars");
      }, 1000);
    } catch (error) {
      console.error("Error adding car:", error.response?.data || error);

      showToast(
        "error",
        "Add Car Failed",
        getCarErrorMessage(error)
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content driveledger-cars">
      {toast && (
        <div className={`car-toast car-toast-${toast.type}`}>
          <div className="car-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="cars-hero cars-reveal cars-delay-1">
          <div>
            <div className="cars-hero-pill">
              <span className="dl-status-dot"></span>
              New Vehicle Record
            </div>

            <h4>Add New Car</h4>
            <p>
              Register a new fleet vehicle with mileage, maintenance, insurance,
              and registration details.
            </p>
          </div>

          <Link to="/cars" className="car-form-back-btn">
            ← Back to Cars
          </Link>
        </div>

        <div className="car-form-card cars-reveal cars-delay-2">
          <div className="car-form-section-title">
            <h5>Vehicle Information</h5>
            <p>Fill in the required details before saving the car record.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <FormField
                label="Make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
              />

              <FormField
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />

              <FormField
                label="Year"
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />

              <FormField
                label="Registration Number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
              />

              <FormField
                label="Mileage"
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
              />

              <FormField
                label="Current Mileage"
                type="number"
                name="current_mileage"
                value={formData.current_mileage}
                onChange={handleChange}
                placeholder="Optional current mileage"
              />

              <div className="col-md-6 mb-3">
                <label className="car-form-label">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="car-form-select"
                  required
                >
                  <option value="">Select condition</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Needs Maintenance">Needs Maintenance</option>
                </select>
              </div>

              <FormField
                label="Last Service Date"
                type="date"
                name="last_service_date"
                value={formData.last_service_date}
                onChange={handleChange}
              />

              <FormField
                label="Next Maintenance Date"
                type="date"
                name="next_maintenance_date"
                value={formData.next_maintenance_date}
                onChange={handleChange}
              />

              <FormField
                label="Insurance Expiry"
                type="date"
                name="insurance_expiry"
                value={formData.insurance_expiry}
                onChange={handleChange}
              />

              <FormField
                label="Registration Expiry"
                type="date"
                name="registration_expiry"
                value={formData.registration_expiry}
                onChange={handleChange}
              />

              <div className="col-md-12 mb-3">
                <label className="car-form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="car-form-textarea"
                  rows="3"
                  placeholder="Optional notes about this car"
                />
              </div>

              <div className="col-md-12">
                <div className="car-form-actions">
                  <Link to="/cars" className="car-form-cancel-btn">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="car-form-save-btn"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Car"}
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
    <label className="car-form-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="car-form-input"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

export default AddCar;