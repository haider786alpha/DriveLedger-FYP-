// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// const EditDriver = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     user: "",
//     cnic: "",
//     license_number: "",
//     address: "",
//   });

//   useEffect(() => {
//     fetchDriver();
//   }, []);

//   const fetchDriver = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/drivers/${id}/`);
//       const data = response.data || response;

//       setFormData({
//         user: data.user,
//         cnic: data.cnic,
//         license_number: data.license_number,
//         address: data.address,
//       });
//     } catch (error) {
//       console.error("Error fetching driver:", error);
//       alert("Failed to load driver");
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
//       await axios.put(`http://127.0.0.1:8000/api/drivers/${id}/`, formData);
//       alert("Driver updated successfully");
//       navigate("/drivers");
//     } catch (error) {
//       console.error("Error updating driver:", error.response?.data || error);
//       alert("Failed to update driver");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <h4 className="mb-4">Edit Driver</h4>

//         <div className="card">
//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label>User ID</label>
//                   <input
//                     type="number"
//                     name="user"
//                     value={formData.user}
//                     onChange={handleChange}
//                     className="form-control"
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
//                     required
//                   />
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
//                   <button type="submit" className="btn btn-primary">
//                     Update Driver
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

// export default EditDriver;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../helpers/apiConfig";

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user: "",
    cnic: "",
    license_number: "",
    address: "",
    profile_photo: null,
    license_copy: null,
  });

  const [existingFiles, setExistingFiles] = useState({
    profile_photo_url: "",
    license_copy_url: "",
  });

  useEffect(() => {
    fetchDriver();
  }, []);

  const fetchDriver = async () => {
    try {
      const response = await axios.get(API_URL(`/api/drivers/${id}/`));
      const data = response.data || response;

      setFormData({
        user: data.user || "",
        cnic: data.cnic || "",
        license_number: data.license_number || "",
        address: data.address || "",
        profile_photo: null,
        license_copy: null,
      });

      setExistingFiles({
        profile_photo_url: data.profile_photo_url || "",
        license_copy_url: data.license_copy_url || "",
      });
    } catch (error) {
      console.error("Error fetching driver:", error);
      alert("Failed to load driver");
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

      // payload.append("user", formData.user);
      payload.append("cnic", formData.cnic);
      payload.append("license_number", formData.license_number);
      payload.append("address", formData.address);

      if (formData.profile_photo) {
        payload.append("profile_photo", formData.profile_photo);
      }

      if (formData.license_copy) {
        payload.append("license_copy", formData.license_copy);
      }

      await axios.patch(API_URL(`/api/drivers/${id}/`), payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Driver updated successfully");
      navigate("/drivers");
    } catch (error) {
      console.error("Error updating driver:", error.response?.data || error);
      alert("Failed to update driver");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Driver</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>User ID</label>
                  <input
  type="number"
  name="user"
  value={formData.user}
  className="form-control"
  disabled
/>
                </div>

                <div className="col-md-6 mb-3">
                  <label>CNIC</label>
                  <input
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    className="form-control"
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

                  {existingFiles.profile_photo_url ? (
                    <div className="mt-2">
                      <img
                        src={existingFiles.profile_photo_url}
                        alt="Driver profile"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </div>
                  ) : (
                    <small className="text-muted d-block mt-1">
                      No profile photo uploaded.
                    </small>
                  )}
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

                  {existingFiles.license_copy_url ? (
                    <div className="mt-2">
                      <a
                        href={existingFiles.license_copy_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Current License Copy
                      </a>
                    </div>
                  ) : (
                    <small className="text-muted d-block mt-1">
                      No license copy uploaded.
                    </small>
                  )}
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
                  <button type="submit" className="btn btn-primary">
                    Update Driver
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

export default EditDriver;