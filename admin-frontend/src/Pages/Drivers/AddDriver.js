// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from "../../helpers/apiConfig";

// const AddDriver = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     user: "",
//     cnic: "",
//     license_number: "",
//     address: "",
//     profile_photo: null,
//     license_copy: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (files && files.length > 0) {
//       setFormData({
//         ...formData,
//         [name]: files[0],
//       });
//       return;
//     }

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = new FormData();

//       payload.append("user", formData.user);
//       payload.append("cnic", formData.cnic);
//       payload.append("license_number", formData.license_number);
//       payload.append("address", formData.address);

//       if (formData.profile_photo) {
//         payload.append("profile_photo", formData.profile_photo);
//       }

//       if (formData.license_copy) {
//         payload.append("license_copy", formData.license_copy);
//       }

//       await axios.post(API_URL("/api/drivers/"), payload, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Driver added successfully");
//       navigate("/drivers");
//     } catch (error) {
//       console.error("FULL ERROR:", error.response?.data || error);
//       alert("Failed to add driver");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <h4 className="mb-4">Add New Driver</h4>

//         <div className="card">
//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label>User ID</label>
//                   <input
//                     name="user"
//                     value={formData.user}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="Enter user id from Django users"
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>CNIC</label>
//                   <input
//                     name="cnic"
//                     value={formData.cnic}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="XXXXX-XXXXXXX-X"
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>License Number</label>
//                   <input
//                     name="license_number"
//                     value={formData.license_number}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="License number"
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>Profile Photo</label>
//                   <input
//                     type="file"
//                     name="profile_photo"
//                     onChange={handleChange}
//                     className="form-control"
//                     accept="image/*"
//                   />
//                   <small className="text-muted">
//                     Upload driver profile photo.
//                   </small>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label>License Copy</label>
//                   <input
//                     type="file"
//                     name="license_copy"
//                     onChange={handleChange}
//                     className="form-control"
//                     accept="image/*,.pdf"
//                   />
//                   <small className="text-muted">
//                     Upload license image or PDF.
//                   </small>
//                 </div>

//                 <div className="col-md-12 mb-3">
//                   <label>Address</label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     className="form-control"
//                     rows="3"
//                     required
//                   ></textarea>
//                 </div>

//                 <div className="col-md-12">
//                   <button type="submit" className="btn btn-success">
//                     Save Driver
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AddDriver;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

const AddDriver = () => {
  const navigate = useNavigate();

  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [formData, setFormData] = useState({
    user: "",
    cnic: "",
    license_number: "",
    address: "",
    profile_photo: null,
    license_copy: null,
  });

  useEffect(() => {
    fetchAvailableDriverUsers();
  }, []);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchAvailableDriverUsers = async () => {
    try {
      setLoadingUsers(true);

      const [usersRes, driversRes] = await Promise.all([
        axios.get(API_URL("/api/users/")),
        axios.get(API_URL("/api/drivers/")),
      ]);

      const users = normalizeResponse(usersRes);
      const drivers = normalizeResponse(driversRes);

      const linkedUserIds = drivers.map((driver) => Number(driver.user));

      const driverUsersOnly = users.filter(
        (user) =>
          !user.is_staff &&
          !linkedUserIds.includes(Number(user.id))
      );

      setAvailableUsers(driverUsersOnly);
    } catch (error) {
      console.error("Fetch available driver users error:", error);
      setAvailableUsers([]);
    } finally {
      setLoadingUsers(false);
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

    if (!formData.user) {
      alert("Please select a driver user.");
      return;
    }

    try {
      const payload = new FormData();

      payload.append("user", formData.user);
      payload.append("cnic", formData.cnic);
      payload.append("license_number", formData.license_number);
      payload.append("address", formData.address);

      if (formData.profile_photo) {
        payload.append("profile_photo", formData.profile_photo);
      }

      if (formData.license_copy) {
        payload.append("license_copy", formData.license_copy);
      }

      await axios.post(API_URL("/api/drivers/"), payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Driver added successfully");
      navigate("/drivers");
    } catch (error) {
      console.error("FULL ERROR:", error.response?.data || error);
      alert("Failed to add driver");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add New Driver</h4>

        <div className="alert alert-info">
          First create a user with <strong>User Type = Driver</strong> in User Management.
          Then select that user here to create the driver profile.
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Select Driver User</label>
                  <select
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    className="form-select"
                    required
                    disabled={loadingUsers}
                  >
                    <option value="">
                      {loadingUsers ? "Loading driver users..." : "Select driver user"}
                    </option>

                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} {user.email ? `- ${user.email}` : ""}
                      </option>
                    ))}
                  </select>

                  <small className="text-muted">
                    Only driver users who are not already linked to a driver profile are shown.
                  </small>

                  {!loadingUsers && availableUsers.length === 0 && (
                    <div className="text-danger mt-2" style={{ fontSize: "13px" }}>
                      No available driver users found. Create a Driver user first in User Management.
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>CNIC</label>
                  <input
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="XXXXX-XXXXXXX-X"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>License Number</label>
                  <input
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="License number"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Profile Photo</label>
                  <input
                    type="file"
                    name="profile_photo"
                    onChange={handleChange}
                    className="form-control"
                    accept="image/*"
                  />
                  <small className="text-muted">
                    Upload driver profile photo.
                  </small>
                </div>

                <div className="col-md-6 mb-3">
                  <label>License Copy</label>
                  <input
                    type="file"
                    name="license_copy"
                    onChange={handleChange}
                    className="form-control"
                    accept="image/*,.pdf"
                  />
                  <small className="text-muted">
                    Upload license image or PDF.
                  </small>
                </div>

                <div className="col-md-12 mb-3">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="col-md-12">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loadingUsers || availableUsers.length === 0}
                  >
                    Save Driver
                  </button>

                  <button
                    type="button"
                    className="btn btn-light ms-2"
                    onClick={() => navigate("/users")}
                  >
                    Create Driver User
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

export default AddDriver;