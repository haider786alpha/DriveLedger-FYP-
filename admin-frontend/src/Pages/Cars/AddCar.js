// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AddCar = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     make: "",
//     model: "",
//     year: "",
//     registration_number: "",
//     mileage: "",
//     condition: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post("http://127.0.0.1:8000/api/cars/", formData);
//       alert("Car added successfully");
//       navigate("/cars");
//     } catch (error) {
//       console.error("Error adding car:", error.response?.data || error);
//       alert("Failed to add car");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <h4 className="mb-4">Add New Car</h4>

//         <div className="card">
//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label>Make</label>
//                   <input name="make" value={formData.make} onChange={handleChange} className="form-control" required />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Model</label>
//                   <input name="model" value={formData.model} onChange={handleChange} className="form-control" required />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Year</label>
//                   <input type="number" name="year" value={formData.year} onChange={handleChange} className="form-control" required />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Registration Number</label>
//                   <input name="registration_number" value={formData.registration_number} onChange={handleChange} className="form-control" required />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Mileage</label>
//                   <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="form-control" required />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Condition</label>
//                   <select name="condition" value={formData.condition} onChange={handleChange} className="form-select" required>
//                     <option value="">Select condition</option>
//                     <option value="Good">Good</option>
//                     <option value="Average">Average</option>
//                     <option value="Needs Maintenance">Needs Maintenance</option>
//                   </select>
//                 </div>

//                 <div className="col-md-12">
//                   <button type="submit" className="btn btn-success">
//                     Save Car
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

// export default AddCar;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cleanPayload = () => {
    return {
      ...formData,
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

    try {
      await axios.post(API_URL("/api/cars/"), cleanPayload(), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Car added successfully");
      navigate("/cars");
    } catch (error) {
      console.error("Error adding car:", error.response?.data || error);
      alert("Failed to add car");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add New Car</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Make</label>
                  <input
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Model</label>
                  <input
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Registration Number</label>
                  <input
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Mileage</label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Current Mileage</label>
                  <input
                    type="number"
                    name="current_mileage"
                    value={formData.current_mileage}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Optional current mileage"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Needs Maintenance">Needs Maintenance</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Last Service Date</label>
                  <input
                    type="date"
                    name="last_service_date"
                    value={formData.last_service_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Next Maintenance Date</label>
                  <input
                    type="date"
                    name="next_maintenance_date"
                    value={formData.next_maintenance_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Insurance Expiry</label>
                  <input
                    type="date"
                    name="insurance_expiry"
                    value={formData.insurance_expiry}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Registration Expiry</label>
                  <input
                    type="date"
                    name="registration_expiry"
                    value={formData.registration_expiry}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Optional notes"
                  />
                </div>

                <div className="col-md-12">
                  <button type="submit" className="btn btn-success">
                    Save Car
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

export default AddCar;