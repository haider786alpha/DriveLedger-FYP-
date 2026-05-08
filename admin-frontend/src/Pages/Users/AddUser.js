// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AddUser = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
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

//     try {
//       await axios.post("http://127.0.0.1:8000/api/users/", formData);
//       alert("User created successfully");
//       navigate("/users");
//     } catch (error) {
//       console.error("Create user error:", error.response?.data || error);
//       alert("Failed to create user");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <h4 className="mb-4">Add User</h4>

//         <div className="card">
//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label>Username</label>
//                 <input
//                   name="username"
//                   className="form-control"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label>Email</label>
//                 <input
//                   name="email"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   className="form-control"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <button className="btn btn-success">
//                 Create User
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddUser;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "driver",
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
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        is_staff: formData.user_type === "admin",
      };

      await axios.post(API_URL("/api/users/"), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(
        formData.user_type === "admin"
          ? "Admin user created successfully"
          : "Driver user created successfully"
      );

      navigate("/users");
    } catch (error) {
      console.error("Create user error:", error.response?.data || error);
      alert("Failed to create user");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add User</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Username</label>
                  <input
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>User Type</label>
                  <select
                    name="user_type"
                    className="form-select"
                    value={formData.user_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                  </select>
                  <small className="text-muted">
                    Driver users can access the driver panel only after a driver profile is created.
                    Admin users can access the admin panel.
                  </small>
                </div>

                <div className="col-md-12">
                  <button className="btn btn-success">
                    Create User
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="alert alert-info mt-4">
          <strong>Access Rule:</strong> Admin users are created with staff access.
          Driver users are created without staff access and must be linked in Driver Management.
        </div>
      </div>
    </div>
  );
};

export default AddUser;