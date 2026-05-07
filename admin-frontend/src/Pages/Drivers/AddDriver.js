import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDriver = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user: "",
    cnic: "",
    license_number: "",
    address: "",
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
      await axios.post("http://127.0.0.1:8000/api/drivers/", formData);
      alert("Driver added successfully");
      navigate("/drivers");
    } catch (error) {
  console.error("FULL ERROR:", error);
  alert("Failed to add driver");
}
//     catch (error) {
//   console.error("FULL ERROR:", error);
//   console.log("ERROR DATA:", error.response?.data);
//   alert("Failed to add driver");
// }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add New Driver</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>User ID</label>
                  <input
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter user id from Django users"
                    required
                  />
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
                  <button type="submit" className="btn btn-success">
                    Save Driver
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