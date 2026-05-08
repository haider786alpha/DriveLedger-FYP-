// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// const EditExpense = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [cars, setCars] = useState([]);
//   const [formData, setFormData] = useState({
//     car: "",
//     amount: "",
//     expense_date: "",
//     category: "",
//     notes: "",
//   });

//   useEffect(() => {
//     fetchCars();
//     fetchExpense();
//   }, []);

//   const fetchCars = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/cars/");
//       setCars(response);
//     } catch (error) {
//       setCars([]);
//     }
//   };

//   const fetchExpense = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/expenses/${id}/`);
//       const data = response.data || response;

//       setFormData({
//         car: data.car,
//         amount: data.amount,
//         expense_date: data.expense_date,
//         category: data.category,
//         notes: data.notes || "",
//       });
//     } catch (error) {
//       alert("Failed to load expense");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.put(`http://127.0.0.1:8000/api/expenses/${id}/`, formData);
//       alert("Expense updated successfully");
//       navigate("/expenses");
//     } catch (error) {
//       console.error("Error updating expense:", error.response?.data || error);
//       alert("Failed to update expense");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <h4 className="mb-4">Edit Expense</h4>

//         <div className="card">
//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label>Car</label>
//                   <select
//                     name="car"
//                     value={formData.car}
//                     onChange={handleChange}
//                     className="form-select"
//                     required
//                   >
//                     <option value="">Select Car</option>
//                     {cars.map((car) => (
//                       <option key={car.id} value={car.id}>
//                         {car.make} {car.model} - {car.registration_number}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Amount</label>
//                   <input
//                     type="number"
//                     name="amount"
//                     value={formData.amount}
//                     onChange={handleChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Expense Date</label>
//                   <input
//                     type="date"
//                     name="expense_date"
//                     value={formData.expense_date}
//                     onChange={handleChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Category</label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     className="form-select"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     <option value="Fuel">Fuel</option>
//                     <option value="Maintenance">Maintenance</option>
//                     <option value="Oil Change">Oil Change</option>
//                     <option value="Repair">Repair</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div className="col-md-12 mb-3">
//                   <label>Notes</label>
//                   <textarea
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleChange}
//                     className="form-control"
//                     rows="3"
//                   ></textarea>
//                 </div>

//                 <div className="col-md-12">
//                   <button type="submit" className="btn btn-primary">
//                     Update Expense
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default EditExpense;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [existingInvoiceUrl, setExistingInvoiceUrl] = useState("");

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
    fetchExpense();
  }, []);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get(API_URL("/api/cars/"));
      setCars(normalizeResponse(response));
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    }
  };

  const fetchExpense = async () => {
    try {
      const response = await axios.get(API_URL(`/api/expenses/${id}/`));
      const data = response.data || response;

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
      alert("Failed to load expense");
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

      alert("Expense updated successfully");
      navigate("/expenses");
    } catch (error) {
      console.error("Error updating expense:", error.response?.data || error);
      alert("Failed to update expense");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Expense</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Car</label>
                  <select
                    name="car"
                    value={formData.car}
                    onChange={handleChange}
                    className="form-select"
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

                <div className="col-md-6 mb-3">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Expense Date</label>
                  <input
                    type="date"
                    name="expense_date"
                    value={formData.expense_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <small className="text-muted">
                    Your backend currently auto-sets the date when an expense is created.
                  </small>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
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
                  <label>Invoice / Receipt</label>
                  <input
                    type="file"
                    name="invoice_receipt"
                    onChange={handleChange}
                    className="form-control"
                    accept="image/*,.pdf"
                  />

                  {existingInvoiceUrl ? (
                    <div className="mt-2">
                      <a
                        href={existingInvoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Current Invoice / Receipt
                      </a>
                    </div>
                  ) : (
                    <small className="text-muted d-block mt-1">
                      No invoice or receipt uploaded.
                    </small>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Optional expense notes"
                  ></textarea>
                </div>

                <div className="col-md-12">
                  <button type="submit" className="btn btn-primary">
                    Update Expense
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditExpense;