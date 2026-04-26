import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`);
      const data = res.data || res;

      setFormData({
        username: data.username,
        email: data.email || "",
      });
    } catch (error) {
      console.error("Fetch user error:", error);
      alert("Failed to load user");
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
      await axios.patch(`http://127.0.0.1:8000/api/users/${id}/`, formData);
      alert("User updated successfully");
      navigate("/users");
    } catch (error) {
      console.error("Update user error:", error.response?.data || error);
      alert("Failed to update user");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit User</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <button className="btn btn-primary">
                Update User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;