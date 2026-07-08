// import React, { useEffect, useState } from "react";
// import { API_URL } from "../../helpers/apiConfig";
// import axios from "axios";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import "./Payments.css";

// const EditPayment = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [assignments, setAssignments] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [cars, setCars] = useState([]);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState(null);

//   const [formData, setFormData] = useState({
//     assignment: "",
//     amount: "",
//     payment_date: "",
//     status: "paid",
//     remarks: "",
//   });

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const normalizeResponse = (res) => {
//     if (Array.isArray(res)) return res;
//     if (Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.results)) return res.results;
//     if (Array.isArray(res?.data?.results)) return res.data.results;
//     return [];
//   };

//   const showToast = (type, title, message) => {
//     setToast({ type, title, message });

//     if (type === "error") {
//       setTimeout(() => {
//         setToast(null);
//       }, 3500);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const [paymentRes, assignmentsRes, driversRes, carsRes] =
//         await Promise.all([
//           axios.get(API_URL(`/api/payments/${id}/`)),
//           axios.get(API_URL("/api/assignments/")),
//           axios.get(API_URL("/api/drivers/")),
//           axios.get(API_URL("/api/cars/")),
//         ]);

//       const data = paymentRes.data || paymentRes;

//       setFormData({
//         assignment: data.assignment || "",
//         amount: data.amount || "",
//         payment_date: data.payment_date || "",
//         status: data.status || "paid",
//         remarks: data.remarks || "",
//       });

//       setAssignments(normalizeResponse(assignmentsRes));
//       setDrivers(normalizeResponse(driversRes));
//       setCars(normalizeResponse(carsRes));
//     } catch (error) {
//       console.error("Error fetching payment:", error);

//       showToast(
//         "error",
//         "Payment Load Failed",
//         "Could not load payment details. Please go back and try again."
//       );
//     }
//   };

//   const getDriverName = (driverId) => {
//     const driver = drivers.find((item) => Number(item.id) === Number(driverId));
//     return driver
//       ? driver.user_name || `Driver ${driverId}`
//       : `Driver ${driverId}`;
//   };

//   const getCarName = (carId) => {
//     const car = cars.find((item) => Number(item.id) === Number(carId));
//     return car
//       ? `${car.make} ${car.model} - ${car.registration_number}`
//       : `Car ${carId}`;
//   };

//   const getAssignmentOptionLabel = (assignment, index) => {
//     const driverName = getDriverName(assignment.driver);
//     const carName = getCarName(assignment.car);

//     return `Assignment No. ${index + 1} · Assignment ID #${
//       assignment.id
//     } · ${driverName} · ${carName}`;
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setToast(null);

//     const payload = {
//       assignment: formData.assignment,
//       amount: formData.amount,
//       payment_date: formData.payment_date,
//       status: formData.status,
//       remarks: formData.remarks,
//     };

//     try {
//       await axios.put(API_URL(`/api/payments/${id}/`), payload, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       showToast(
//         "success",
//         "Payment Updated Successfully",
//         "Payment entry has been saved in DriveLedger."
//       );

//       setTimeout(() => {
//         navigate("/payments");
//       }, 1000);
//     } catch (error) {
//       console.error("Error updating payment:", error.response?.data || error);

//       showToast(
//         "error",
//         "Update Failed",
//         "Payment could not be updated. Please check the form and try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="page-content driveledger-payments">
//       {toast && (
//         <div className={`payment-toast payment-toast-${toast.type}`}>
//           <div className="payment-toast-icon">
//             {toast.type === "success" ? "✓" : "!"}
//           </div>
//           <div>
//             <strong>{toast.title}</strong>
//             <span>{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="container-fluid">
//         <div className="payments-hero payments-reveal payments-delay-1">
//           <div>
//             <div className="payments-hero-pill">
//               <span className="dl-status-dot"></span>
//               Update Payment Entry
//             </div>

//             <h4>Edit Payment</h4>
//             <p>
//               Update assignment, amount, payment date, status, and payment
//               remarks.
//             </p>
//           </div>

//           <Link to="/payments" className="payment-form-back-btn">
//             ← Back to Payments
//           </Link>
//         </div>

//         <div className="payment-form-card payments-reveal payments-delay-2">
//           <div className="payment-form-section-title">
//             <h5>Payment Information</h5>
//             <p>
//               Review and update the payment details before saving changes.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="row">
//               <div className="col-md-12 mb-3">
//                 <label className="payment-form-label">Assignment</label>
//                 <select
//                   name="assignment"
//                   value={formData.assignment}
//                   onChange={handleChange}
//                   className="payment-form-select"
//                   required
//                 >
//                   <option value="">Select Assignment</option>
//                   {assignments.map((item, index) => (
//                     <option key={item.id} value={item.id}>
//                       {getAssignmentOptionLabel(item, index)}
//                     </option>
//                   ))}
//                 </select>
//                 <small className="payment-form-help">
//                   Match this with the Car Assignments page using Assignment ID.
//                 </small>
//               </div>

//               <FormField
//                 label="Amount"
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 placeholder="Enter payment amount"
//                 required
//               />

//               <FormField
//                 label="Payment Date"
//                 type="date"
//                 name="payment_date"
//                 value={formData.payment_date}
//                 onChange={handleChange}
//                 required
//               />

//               <div className="col-md-6 mb-3">
//                 <label className="payment-form-label">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="payment-form-select"
//                   required
//                 >
//                   <option value="paid">Paid</option>
//                   <option value="unpaid">Unpaid</option>
//                 </select>
//               </div>

//               <div className="col-md-12 mb-3">
//                 <label className="payment-form-label">Remarks</label>
//                 <textarea
//                   name="remarks"
//                   value={formData.remarks}
//                   onChange={handleChange}
//                   className="payment-form-textarea"
//                   rows="3"
//                   placeholder="Optional payment remarks"
//                 />
//               </div>

//               <div className="col-md-12">
//                 <div className="payment-form-actions">
//                   <Link to="/payments" className="payment-form-cancel-btn">
//                     Cancel
//                   </Link>

//                   <button
//                     type="submit"
//                     className="payment-form-save-btn"
//                     disabled={saving}
//                   >
//                     {saving ? "Updating..." : "Update Payment"}
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
//     <label className="payment-form-label">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="payment-form-input"
//       placeholder={placeholder}
//       required={required}
//     />
//   </div>
// );

// export default EditPayment;

import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Payments.css";

const EditPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [existingPayments, setExistingPayments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    assignment: "",
    amount: "",
    payment_date: "",
    status: "paid",
    remarks: "",
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
      const [paymentRes, assignmentsRes, driversRes, carsRes, paymentsRes] =
        await Promise.all([
          axios.get(API_URL(`/api/payments/${id}/`)),
          axios.get(API_URL("/api/assignments/")),
          axios.get(API_URL("/api/drivers/")),
          axios.get(API_URL("/api/cars/")),
          axios.get(API_URL("/api/payments/")),
        ]);

      const data = paymentRes.data || paymentRes;

      setFormData({
        assignment: data.assignment || "",
        amount: data.amount || "",
        payment_date: formatDate(data.payment_date),
        status: data.status || "paid",
        remarks: data.remarks || "",
      });

      setAssignments(normalizeResponse(assignmentsRes));
      setDrivers(normalizeResponse(driversRes));
      setCars(normalizeResponse(carsRes));
      setExistingPayments(normalizeResponse(paymentsRes));
    } catch (error) {
      console.error("Error fetching payment:", error);

      setAssignments([]);
      setDrivers([]);
      setCars([]);
      setExistingPayments([]);

      showToast(
        "error",
        "Payment Load Failed",
        "Could not load payment details. Please go back and try again."
      );
    }
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find((item) => Number(item.id) === Number(driverId));
    return driver
      ? driver.user_name || `Driver ${driverId}`
      : `Driver ${driverId}`;
  };

  const getCarName = (carId) => {
    const car = cars.find((item) => Number(item.id) === Number(carId));
    return car
      ? `${car.make} ${car.model} - ${car.registration_number}`
      : `Car ${carId}`;
  };

  const getAssignmentOptionLabel = (assignment, index) => {
    const driverName = getDriverName(assignment.driver);
    const carName = getCarName(assignment.car);

    return `Assignment No. ${index + 1} · Assignment ID #${
      assignment.id
    } · ${driverName} · ${carName}`;
  };

  const getSelectedAssignment = () => {
    return assignments.find(
      (item) => Number(item.id) === Number(formData.assignment)
    );
  };

  const validatePaymentForm = () => {
    const amount = Number(formData.amount);
    const selectedAssignment = getSelectedAssignment();

    if (!formData.assignment) {
      return "Assignment is required. Please select an assignment.";
    }

    if (!selectedAssignment) {
      return "Selected assignment is invalid. Please select a valid assignment.";
    }

    if (formData.amount === "" || formData.amount === null) {
      return "Amount is required. Please enter payment amount.";
    }

    if (Number.isNaN(amount)) {
      return "Amount must be a valid number.";
    }

    if (amount <= 0) {
      return "Amount must be greater than 0.";
    }

    if (!formData.payment_date) {
      return "Payment date is required. Please select payment date.";
    }

    if (selectedAssignment.start_date) {
      const assignmentStartDate = String(selectedAssignment.start_date).slice(
        0,
        10
      );

      if (formData.payment_date < assignmentStartDate) {
        return "Payment date cannot be before assignment start date.";
      }
    }

    if (selectedAssignment.end_date) {
      const assignmentEndDate = String(selectedAssignment.end_date).slice(0, 10);

      if (formData.payment_date > assignmentEndDate) {
        return "Payment date cannot be after assignment end date.";
      }
    }

    if (!formData.status) {
      return "Payment status is required. Please select payment status.";
    }

    const allowedStatuses = ["paid", "unpaid"];

    if (!allowedStatuses.includes(formData.status)) {
      return "Payment status must be paid or unpaid.";
    }

    const duplicatePayment = existingPayments.some(
      (payment) =>
        Number(payment.id) !== Number(id) &&
        Number(payment.assignment) === Number(formData.assignment) &&
        String(payment.payment_date).slice(0, 10) === formData.payment_date &&
        Number(payment.amount) === amount
    );

    if (duplicatePayment) {
      return "This payment already exists for the selected assignment, date, and amount.";
    }

    return "";
  };

  const getPaymentErrorMessage = (error) => {
    const data = error.response?.data;
    const text = data ? JSON.stringify(data).toLowerCase() : "";

    if (text.includes("assignment")) {
      return "Assignment is invalid or required. Please select a valid assignment.";
    }

    if (text.includes("amount")) {
      return "Amount is invalid. Amount must be greater than 0.";
    }

    if (text.includes("payment_date") || text.includes("payment date")) {
      return "Payment date is invalid. Please check assignment start and end dates.";
    }

    if (text.includes("status")) {
      return "Payment status is invalid. Please select paid or unpaid.";
    }

    if (
      text.includes("duplicate") ||
      text.includes("already exists") ||
      text.includes("already")
    ) {
      return "This payment already exists for the selected assignment, date, and amount.";
    }

    return "Payment could not be updated. Please check assignment, amount, payment date, and status.";
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cleanPayload = () => {
    return {
      assignment: formData.assignment,
      amount: formData.amount,
      payment_date: formData.payment_date,
      status: formData.status,
      remarks: formData.remarks || null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    const validationError = validatePaymentForm();

    if (validationError) {
      showToast("error", "Invalid Payment Form", validationError);
      return;
    }

    setSaving(true);

    try {
      await axios.put(API_URL(`/api/payments/${id}/`), cleanPayload(), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      showToast(
        "success",
        "Payment Updated Successfully",
        "Payment entry has been saved in DriveLedger."
      );

      setTimeout(() => {
        navigate("/payments");
      }, 1000);
    } catch (error) {
      console.error("Error updating payment:", error.response?.data || error);

      showToast(
        "error",
        "Update Failed",
        getPaymentErrorMessage(error)
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content driveledger-payments">
      {toast && (
        <div className={`payment-toast payment-toast-${toast.type}`}>
          <div className="payment-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="payments-hero payments-reveal payments-delay-1">
          <div>
            <div className="payments-hero-pill">
              <span className="dl-status-dot"></span>
              Update Payment Entry
            </div>

            <h4>Edit Payment</h4>
            <p>
              Update assignment, amount, payment date, status, and payment
              remarks.
            </p>
          </div>

          <Link to="/payments" className="payment-form-back-btn">
            ← Back to Payments
          </Link>
        </div>

        <div className="payment-form-card payments-reveal payments-delay-2">
          <div className="payment-form-section-title">
            <h5>Payment Information</h5>
            <p>
              Review and update the payment details before saving changes.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="payment-form-label">Assignment</label>
                <select
                  name="assignment"
                  value={formData.assignment}
                  onChange={handleChange}
                  className="payment-form-select"
                  required
                >
                  <option value="">Select Assignment</option>
                  {assignments.map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {getAssignmentOptionLabel(item, index)}
                    </option>
                  ))}
                </select>
                <small className="payment-form-help">
                  Match this with the Car Assignments page using Assignment ID.
                </small>
              </div>

              <FormField
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter payment amount"
                required
              />

              <FormField
                label="Payment Date"
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                required
              />

              <div className="col-md-6 mb-3">
                <label className="payment-form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="payment-form-select"
                  required
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label className="payment-form-label">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="payment-form-textarea"
                  rows="3"
                  placeholder="Optional payment remarks"
                />
              </div>

              <div className="col-md-12">
                <div className="payment-form-actions">
                  <Link to="/payments" className="payment-form-cancel-btn">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="payment-form-save-btn"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Payment"}
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
    <label className="payment-form-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="payment-form-input"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default EditPayment;