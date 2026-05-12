import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

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
    actual_cost: "",
    notes: "",
    bill_receipt: null,
  });

  const [existingBillUrl, setExistingBillUrl] = useState("");

  useEffect(() => {
    fetchCars();
    fetchRepair();
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

  const fetchRepair = async () => {
    try {
      const response = await axios.get(API_URL(`/api/repairs/${id}/`));
      const data = response.data || response;

      setFormData({
        car: data.car || "",
        issue: data.issue || "",
        priority: data.priority || "medium",
        status: data.status || "pending",
        reported_date: data.reported_date || "",
        estimated_cost: data.estimated_cost || "",
        actual_cost: data.actual_cost || "",
        notes: data.notes || "",
        bill_receipt: null,
      });

      setExistingBillUrl(data.bill_receipt_url || "");
    } catch (error) {
      console.error("Error fetching repair:", error);
      alert("Failed to load repair");
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
      payload.append("issue", formData.issue);
      payload.append("priority", formData.priority);
      payload.append("status", formData.status);
      payload.append("reported_date", formData.reported_date);
      payload.append("estimated_cost", formData.estimated_cost || 0);
      payload.append("actual_cost", formData.actual_cost || 0);
      payload.append("notes", formData.notes || "");

      if (formData.bill_receipt) {
        payload.append("bill_receipt", formData.bill_receipt);
      }

      await axios.patch(API_URL(`/api/repairs/${id}/`), payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
                  <label>Reported Date</label>
                  <input
                    type="date"
                    name="reported_date"
                    value={formData.reported_date}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Issue</label>
                  <input
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Describe repair issue"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Estimated Cost</label>
                  <input
                    type="number"
                    name="estimated_cost"
                    value={formData.estimated_cost}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Actual Cost</label>
                  <input
                    type="number"
                    name="actual_cost"
                    value={formData.actual_cost}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Actual repair cost"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Bill / Receipt</label>
                  <input
                    type="file"
                    name="bill_receipt"
                    onChange={handleChange}
                    className="form-control"
                    accept="image/*,.pdf"
                  />

                  {existingBillUrl ? (
                    <div className="mt-2">
                      <a
                        href={existingBillUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Current Bill / Receipt
                      </a>
                    </div>
                  ) : (
                    <small className="text-muted d-block mt-1">
                      No bill or receipt uploaded.
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
                    placeholder="Optional repair notes"
                  ></textarea>
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