// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// const EditCar = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     make: "",
//     model: "",
//     year: "",
//     registration_number: "",
//     mileage: "",
//     condition: "",
//   });

//   useEffect(() => {
//     fetchCar();
//   }, []);

//   const fetchCar = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/cars/${id}/`);
//       const data = response.data || response;
//       setFormData(data);
//     } catch (error) {
//       console.error("Error fetching car:", error);
//       alert("Failed to load car");
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
//       await axios.put(`http://127.0.0.1:8000/api/cars/${id}/`, formData);
//       alert("Car updated successfully");
//       navigate("/cars");
//     } catch (error) {
//       console.error("Error updating car:", error.response?.data || error);
//       alert("Failed to update car");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <h4 className="mb-4">Edit Car</h4>

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
//                   <button type="submit" className="btn btn-primary">
//                     Update Car
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

// export default EditCar;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

const EditCar = () => {
  const { id } = useParams();
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

  useEffect(() => {
    fetchCar();
  }, []);

  const formatDate = (value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
  };

  const fetchCar = async () => {
    try {
      const response = await axios.get(API_URL(`/api/cars/${id}/`));
      const data = response.data || response;

      setFormData({
        make: data.make || "",
        model: data.model || "",
        year: data.year || "",
        registration_number: data.registration_number || "",
        mileage: data.mileage || "",
        condition: data.condition || "",
        notes: data.notes || "",
        last_service_date: formatDate(data.last_service_date),
        next_maintenance_date: formatDate(data.next_maintenance_date),
        current_mileage: data.current_mileage || "",
        insurance_expiry: formatDate(data.insurance_expiry),
        registration_expiry: formatDate(data.registration_expiry),
      });
    } catch (error) {
      console.error("Error fetching car:", error);
      alert("Failed to load car");
    }
  };

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
      await axios.put(API_URL(`/api/cars/${id}/`), cleanPayload(), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Car updated successfully");
      navigate("/cars");
    } catch (error) {
      console.error("Error updating car:", error.response?.data || error);
      alert("Failed to update car");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Car</h4>

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
                  <button type="submit" className="btn btn-primary">
                    Update Car
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

export default EditCar;