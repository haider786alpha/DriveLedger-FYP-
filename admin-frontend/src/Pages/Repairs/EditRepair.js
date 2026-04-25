import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditRepair = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  const [formData, setFormData] = useState({
    car: "",
    issue: "",
    priority: "medium",
    status: "pending",
    reported_date: "",
    estimated_cost: "",
    notes: "",
  });

  useEffect(() => {
    fetchCars();
    fetchRepair();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cars/");
      setCars(response);
    } catch {
      setCars([]);
    }
  };

  const fetchRepair = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/repairs/${id}/`);
      const data = response.data || response;
      setFormData({
        car: data.car,
        issue: data.issue,
        priority: data.priority,
        status: data.status,
        reported_date: data.reported_date,
        estimated_cost: data.estimated_cost,
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Error fetching repair:", error);
      alert("Failed to load repair");
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
      await axios.put(`http://127.0.0.1:8000/api/repairs/${id}/`, formData);
      alert("Repair updated successfully");
      navigate("/repairs");
    } catch (error) {
      console.error("Error updating repair:", error.response?.data || error);
      alert("Failed to update repair");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Repair</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Car</label>
                  <select name="car" value={formData.car} onChange={handleChange} className="form-select" required>
                    <option value="">Select Car</option>
                    {cars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.make} {car.model} - {car.registration_number}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Reported Date</label>
                  <input type="date" name="reported_date" value={formData.reported_date} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Issue</label>
                  <input name="issue" value={formData.issue} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="form-select">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Estimated Cost</label>
                  <input type="number" name="estimated_cost" value={formData.estimated_cost} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-control" rows="3"></textarea>
                </div>

                <div className="col-md-12">
                  <button type="submit" className="btn btn-primary">
                    Update Repair
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

export default EditRepair;