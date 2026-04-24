import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  const [formData, setFormData] = useState({
    car: "",
    amount: "",
    expense_date: "",
    category: "",
    notes: "",
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cars/");
      setCars(response);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
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
      await axios.post("http://127.0.0.1:8000/api/expenses/", formData);
      alert("Expense added successfully");
      navigate("/expenses");
    } catch (error) {
      console.error("Error adding expense:", error.response?.data || error);
      alert("Failed to add expense");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Add Expense</h4>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Car</label>
                  <select name="car" value={formData.car} onChange={handleChange} className="form-select" required>
                    <option value="">Select Car</option>
                    {cars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.make} {car.model} - {car.registration_number}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Expense Date</label>
                  <input type="date" name="expense_date" value={formData.expense_date} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Amount</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="form-select" required>
                    <option value="">Select Category</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Oil Change">Oil Change</option>
                    <option value="Repair">Repair</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-12 mb-3">
                  <label>Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-control" rows="3"></textarea>
                </div>

                <div className="col-md-12">
                  <button type="submit" className="btn btn-success">
                    Save Expense
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

export default AddExpense;