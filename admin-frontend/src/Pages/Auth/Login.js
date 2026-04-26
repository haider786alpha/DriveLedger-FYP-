// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("LOGIN DATA:", formData);

//     try {
//       const response = await axios.post(
//   "http://localhost:8000/api/token/",
//   {
//     username: formData.username.trim(),
//     password: formData.password.trim(),
//   },
//   {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }
// );

//       // store tokens
//       localStorage.setItem("access", response.access);
//       localStorage.setItem("refresh", response.refresh);

//     localStorage.setItem(
//   "authUser",
//   JSON.stringify({
//     username: formData.username,
//     token: response.access,
//   })
// );

//       window.location.href = "http://localhost:3000/dashboard";
//     } catch (error) {
//   console.error("FULL ERROR:", error);
//   alert(error.message);
// }
//   };

//   return (
//     <div className="container mt-5" style={{ maxWidth: "400px" }}>
//       <h3 className="mb-4">Login</h3>

//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label>Username</label>
//           <input
//             name="username"
//             className="form-control"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             className="form-control"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button className="btn btn-primary w-100">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/",
        {
          username: formData.username.trim(),
          password: formData.password.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("access", response.access);
      localStorage.setItem("refresh", response.refresh);
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          username: formData.username,
          token: response.access,
          rememberMe,
        })
      );

      window.location.href = "http://localhost:3000/dashboard";
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setErrorMsg("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(20,184,166,0.25), transparent 35%), linear-gradient(135deg, #020617 0%, #0f172a 45%, #0f766e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        className="row w-100 overflow-hidden"
        style={{
          maxWidth: "1050px",
          borderRadius: "28px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          className="col-md-6 d-none d-md-flex flex-column justify-content-between text-white p-5"
          style={{
            background:
              "linear-gradient(160deg, #020617 0%, #0f172a 55%, #134e4a 100%)",
          }}
        >
          <div>
            <div
              className="mb-4 d-inline-flex align-items-center justify-content-center"
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "18px",
                background: "#0ea5a4",
                boxShadow: "0 12px 30px rgba(14,165,164,0.35)",
                fontSize: "26px",
                fontWeight: "800",
              }}
            >
              D
            </div>

            <h1 className="fw-bold mb-3" style={{ color: "#ffffff" }}>
              DriveLedger
            </h1>

            <p className="fs-5 mb-4" style={{ color: "#cbd5e1" }}>
              Smart fleet, driver, payment and repair management system.
            </p>

            <div className="mt-4">
              <Feature text="Manage drivers and vehicle records" />
              <Feature text="Track payments, expenses and profit" />
              <Feature text="Monitor assignments, repairs and reports" />
            </div>
          </div>

          <div
            className="mt-5 p-3"
            style={{
              borderRadius: "18px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <small style={{ color: "#cbd5e1" }}>
              Secure admin access for DriveLedger operations.
            </small>
          </div>
        </div>

        <div className="col-md-6 bg-white p-5">
          <div className="mb-4">
            <h3 className="fw-bold mb-1">Admin Login</h3>
            <p className="text-muted mb-0">
              Sign in to manage your DriveLedger system.
            </p>
          </div>

          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                name="username"
                className="form-control form-control-lg"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <div className="input-group input-group-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
            </div>

            <button
              className="btn btn-lg w-100 text-white"
              disabled={loading}
              style={{
                backgroundColor: "#0ea5a4",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(14,165,164,0.35)",
              }}
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
            </button>
          </form>

          <p className="text-center text-muted mt-4 mb-0">
            © 2026 DriveLedger Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ text }) => (
  <div className="d-flex align-items-center mb-3">
    <span
      className="me-3 d-inline-flex align-items-center justify-content-center"
      style={{
        width: "26px",
        height: "26px",
        borderRadius: "50%",
        background: "rgba(14,165,164,0.2)",
        color: "#5eead4",
        fontWeight: "bold",
      }}
    >
      ✓
    </span>
    <span style={{ color: "#e2e8f0" }}>{text}</span>
  </div>
);

export default Login;