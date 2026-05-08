// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// const EditUser = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//   });

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`);
//       const data = res.data || res;

//       setFormData({
//         username: data.username,
//         email: data.email || "",
//       });
//     } catch (error) {
//       console.error("Fetch user error:", error);
//       alert("Failed to load user");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.patch(`http://127.0.0.1:8000/api/users/${id}/`, formData);
//       alert("User updated successfully");
//       navigate("/users");
//     } catch (error) {
//       console.error("Update user error:", error.response?.data || error);
//       alert("Failed to update user");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <h4 className="mb-4">Edit User</h4>

//         <div className="card">
//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label>Username</label>
//                 <input
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label>Email</label>
//                 <input
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="form-control"
//                 />
//               </div>

//               <button className="btn btn-primary">
//                 Update User
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditUser;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    user_type: "driver",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(API_URL(`/api/users/${id}/`));
      const data = res.data || res;

      setFormData({
        username: data.username || "",
        email: data.email || "",
        user_type: data.is_staff ? "admin" : "driver",
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
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        is_staff: formData.user_type === "admin",
      };

      await axios.patch(API_URL(`/api/users/${id}/`), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

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
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter email"
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
                    Admin users can access admin panel. Driver users can access driver panel after driver profile is created.
                  </small>
                </div>

                <div className="col-md-12">
                  <button className="btn btn-primary">
                    Update User
                  </button>

                  <button
                    type="button"
                    className="btn btn-light ms-2"
                    onClick={() => navigate("/users")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="alert alert-warning mt-4">
          <strong>Important:</strong> Do not mark driver accounts as Admin unless they should access the admin panel.
        </div>
      </div>
    </div>
  );
};

export default EditUser;