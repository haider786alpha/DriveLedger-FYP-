import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AssignDriver = () => {
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);

  const [formData, setFormData] = useState({
    driver: "",
    car: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  useEffect(() => {
    fetchDrivers();
    fetchCars();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/drivers/");
      setDrivers(response);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers([]);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cars/");
      setCars(response);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
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

    const payload = {
      driver: formData.driver,
      car: formData.car,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      status: formData.status,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/assignments/", payload);
      alert("Car assigned successfully");
      navigate("/assignments");
    } catch (error) {
      console.error("Error assigning car:", error.response?.data || error);
      alert("Failed to assign car");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Assign Driver to Car</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Select Driver</label>
                  <select
                    name="driver"
                    value={formData.driver}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.user_name} - {driver.cnic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Select Car</label>
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
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <button type="submit" className="btn btn-success">
                    Assign Driver
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

export default AssignDriver;