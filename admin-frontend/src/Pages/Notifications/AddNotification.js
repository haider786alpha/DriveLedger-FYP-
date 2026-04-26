import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddNotification = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notification_type: "info",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/notifications/", formData);
      alert("Notification created successfully");
      navigate("/notifications");
    } catch (error) {
      console.error("Create notification error:", error.response?.data || error);
      alert("Failed to create notification");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Create Notification</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Title</label>
                <input
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label>Type</label>
                <select
                  name="notification_type"
                  className="form-select"
                  value={formData.notification_type}
                  onChange={handleChange}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                </select>
              </div>

              <button className="btn btn-success">
                Save Notification
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNotification;