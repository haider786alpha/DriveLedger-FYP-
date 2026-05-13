import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditAssignment = () => {
  const { id } = useParams();
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentRes, driversRes, carsRes] = await Promise.all([
        axios.get(API_URL(`/api/assignments/${id}/`)),
        axios.get(API_URL("/api/drivers/")),
        axios.get(API_URL("/api/cars/")),
      ]);

      setFormData({
        driver: assignmentRes.driver || "",
        car: assignmentRes.car || "",
        start_date: assignmentRes.start_date || "",
        end_date: assignmentRes.end_date || "",
        status: assignmentRes.status || "active",
      });

      setDrivers(driversRes);
      setCars(carsRes);
    } catch (error) {
      console.error("Edit assignment load error:", error);
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
      await axios.put(
        API_URL(`/api/assignments/${id}/`),
        formData
      );

      alert("Assignment updated successfully");
      navigate("/assignments");
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      alert("Failed to update assignment");
    }
  };

  const isActiveAssignment = formData.status === "active";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Assignment</h4>

        {isActiveAssignment && (
          <div className="alert alert-warning">
            Active assignments are locked. You can only update end date or status.
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Driver</label>
                  <select
                    name="driver"
                    className="form-select"
                    value={formData.driver}
                    onChange={handleChange}
                    disabled={isActiveAssignment}
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.user_name || `Driver ${d.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Car</label>
                  <select
                    name="car"
                    className="form-select"
                    value={formData.car}
                    onChange={handleChange}
                    disabled={isActiveAssignment}
                  >
                    <option value="">Select Car</option>
                    {cars.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.make} {c.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    className="form-control"
                    value={formData.start_date}
                    onChange={handleChange}
                    disabled={isActiveAssignment}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    className="form-control"
                    value={formData.end_date || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-success">Update Assignment</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAssignment;