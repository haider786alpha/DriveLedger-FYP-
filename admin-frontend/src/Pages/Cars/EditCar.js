import React from "react";
import { useParams } from "react-router-dom";

const EditCar = () => {
  const { id } = useParams();

  const car = {
    make: "Toyota",
    model: "Corolla",
    year: "2020",
    registration: "ABC-123",
    mileage: "45000",
    condition: "Good",
    lastServiceDate: "2026-04-10",
    nextMaintenanceDate: "2026-06-10",
    insuranceExpiry: "2026-12-31",
    registrationExpiry: "2026-11-30",
    notes: "Company fleet car",
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">Edit Car (ID: {id})</h4>

        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Make</label>
                <input defaultValue={car.make} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Model</label>
                <input defaultValue={car.model} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Year</label>
                <input defaultValue={car.year} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Registration Number</label>
                <input defaultValue={car.registration} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Mileage</label>
                <input defaultValue={car.mileage} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Condition</label>
                <select defaultValue={car.condition} className="form-select">
                  <option>Good</option>
                  <option>Average</option>
                  <option>Needs Maintenance</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Last Service Date</label>
                <input type="date" defaultValue={car.lastServiceDate} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Next Maintenance Date</label>
                <input type="date" defaultValue={car.nextMaintenanceDate} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Insurance Expiry</label>
                <input type="date" defaultValue={car.insuranceExpiry} className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Registration Expiry</label>
                <input type="date" defaultValue={car.registrationExpiry} className="form-control" />
              </div>

              <div className="col-md-12 mb-3">
                <label>Notes</label>
                <textarea defaultValue={car.notes} className="form-control" rows="3"></textarea>
              </div>

              <div className="col-md-12">
                <button className="btn btn-primary">Update Car</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCar;