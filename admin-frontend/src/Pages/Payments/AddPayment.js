import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPayment = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);

  const [formData, setFormData] = useState({
    assignment: "",
    amount: "",
    payment_date: "",
    status: "paid",
    remarks: "",
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(API_URL("/api/assignments/"));
      setAssignments(response);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAssignments([]);
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
      await axios.post(API_URL("/api/payments/"), formData);
      alert("Payment added successfully");
      navigate("/payments");
    } catch (error) {
      console.error("Error adding payment:", error.response?.data || error);
      alert("Failed to add payment");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add Payment Entry</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Assignment</label>
                  <select
                    name="assignment"
                    value={formData.assignment}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Assignment</option>
                    {assignments.map((item) => (
                      <option key={item.id} value={item.id}>
                        Assignment #{item.id} - Driver {item.driver} - Car {item.car}
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
                  <label>Payment Date</label>
                  <input
                    type="date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={handleChange}
                    className="form-control"
                    required
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
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="col-md-12 mb-3">
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                  ></textarea>
                </div>

                <div className="col-md-12">
                  <button type="submit" className="btn btn-success">
                    Save Payment
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

export default AddPayment;