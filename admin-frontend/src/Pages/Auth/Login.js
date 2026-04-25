import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("LOGIN DATA:", formData);

    try {
      const response = await axios.post(
  "http://localhost:8000/api/token/",
  {
    username: formData.username.trim(),
    password: formData.password.trim(),
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

      // store tokens
      localStorage.setItem("access", response.access);
      localStorage.setItem("refresh", response.refresh);

    localStorage.setItem(
  "authUser",
  JSON.stringify({
    username: formData.username,
    token: response.access,
  })
);

      window.location.href = "http://localhost:3000/dashboard";
    } catch (error) {
  console.error("FULL ERROR:", error);
  alert(error.message);
}
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4">Login</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input
            name="username"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;