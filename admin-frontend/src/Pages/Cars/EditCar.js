import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
  });

  useEffect(() => {
    fetchCar();
  }, []);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/cars/${id}/`);
      const data = response.data || response;
      setFormData(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://127.0.0.1:8000/api/cars/${id}/`, formData);
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
                  <input name="make" value={formData.make} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Model</label>
                  <input name="model" value={formData.model} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Year</label>
                  <input type="number" name="year" value={formData.year} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Registration Number</label>
                  <input name="registration_number" value={formData.registration_number} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Mileage</label>
                  <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="form-select" required>
                    <option value="">Select condition</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Needs Maintenance">Needs Maintenance</option>
                  </select>
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