// import React, { useEffect, useState } from "react";
// import { API_URL } from "../../helpers/apiConfig";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Cars = () => {
//   const [cars, setCars] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchCars();
//   }, []);

//   const fetchCars = async () => {
//     try {
//       const response = await axios.get(API_URL("/api/cars/"));
//       setCars(response);
//     } catch (error) {
//       console.error("Error fetching cars:", error);
//       setCars([]);
//     }
//   };

//   const deleteCar = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this car?")) return;

//     try {
//       await axios.delete(API_URL(`/api/cars/${id}/`));
//       alert("Car deleted successfully");
//       fetchCars();
//     } catch (error) {
//       console.error("Error deleting car:", error);
//       alert("Failed to delete car");
//     }
//   };

//   const filteredCars = cars.filter((car) =>
//     `${car.make} ${car.model} ${car.registration_number}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h4 className="mb-1">Car Management</h4>
//             <p className="text-muted mb-0">Manage vehicle records, condition and details.</p>
//           </div>

//           <Link to="/add-car" className="btn btn-primary">
//             Add Car
//           </Link>
//         </div>

//         <div className="card mb-4">
//           <div className="card-body">
//             <input
//               className="form-control"
//               placeholder="Search by make, model, or registration number"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-body">
//             <div className="table-responsive">
//               <table className="table table-bordered table-hover align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>#</th>
//                     <th>Car</th>
//                     <th>Registration</th>
//                     <th>Year</th>
//                     <th>Mileage</th>
//                     <th>Condition</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredCars.length > 0 ? (
//                     filteredCars.map((car, index) => (
//                       <tr key={car.id}>
//                         <td>{index + 1}</td>
//                         <td>
//                           <strong>{car.make} {car.model}</strong>
//                         </td>
//                         <td>{car.registration_number}</td>
//                         <td>{car.year}</td>
//                         <td>{car.mileage} km</td>
//                         <td>
//                           <span className="badge bg-info">
//                             {car.condition}
//                           </span>
//                         </td>
//                         <td>
//                           <Link
//                             to={`/edit-car/${car.id}`}
//                             className="btn btn-sm btn-warning me-2"
//                           >
//                             Edit
//                           </Link>

//                           <button
//                             className="btn btn-sm btn-danger"
//                             onClick={() => deleteCar(car.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="text-center">
//                         No cars found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Cars;

import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Cars.css";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    car: null,
    deleting: false,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const normalizeResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.data?.results)) return response.data.results;
    return [];
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get(API_URL("/api/cars/"));
      setCars(normalizeResponse(response));
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);

      showToast(
        "error",
        "Cars Load Failed",
        "Could not load car records. Please refresh and try again."
      );
    }
  };

  const openDeleteModal = (car) => {
    setDeleteModal({
      open: true,
      car,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      car: null,
      deleting: false,
    });
  };

  const confirmDeleteCar = async () => {
    if (!deleteModal.car?.id) return;

    setDeleteModal((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await axios.delete(API_URL(`/api/cars/${deleteModal.car.id}/`));

      closeDeleteModal();

      showToast(
        "success",
        "Car Deleted Successfully",
        "Vehicle record has been removed from DriveLedger."
      );

      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);

      setDeleteModal((prev) => ({
        ...prev,
        deleting: false,
      }));

      showToast(
        "error",
        "Delete Failed",
        "Car could not be deleted. Please try again."
      );
    }
  };

  const filteredCars = cars.filter((car) =>
    `${car.make || ""} ${car.model || ""} ${car.registration_number || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content driveledger-cars">
      {toast && (
        <div className={`car-toast car-toast-${toast.type}`}>
          <div className="car-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="car-modal-backdrop">
          <div className="car-modal-card">
            <div className="car-modal-icon">!</div>

            <h5>Delete Car Record?</h5>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteModal.car?.make} {deleteModal.car?.model}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="car-modal-actions">
              <button
                type="button"
                className="car-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="car-modal-delete"
                onClick={confirmDeleteCar}
                disabled={deleteModal.deleting}
              >
                {deleteModal.deleting ? "Deleting..." : "Delete Car"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="cars-hero cars-reveal cars-delay-1">
          <div>
            <div className="cars-hero-pill">
              <span className="dl-status-dot"></span>
              Vehicle Records
            </div>

            <h4>Car Management</h4>
            <p>
              Manage vehicle records, registration details, mileage and
              condition.
            </p>
          </div>

          <Link to="/add-car" className="cars-add-btn">
            + Add Car
          </Link>
        </div>

        <div className="cars-search-card cars-reveal cars-delay-2">
          <input
            className="cars-search-input"
            placeholder="Search by make, model, or registration number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cars-table-card cars-reveal cars-delay-3">
          <div className="cars-table-header">
            <div>
              <h5>Vehicle List</h5>
              <p className="text-muted mb-0">
                Showing {filteredCars.length} of {cars.length} car records
              </p>
            </div>

            <span className="cars-count">{cars.length} Total Cars</span>
          </div>

          <div className="cars-table-wrap">
            <table className="table table-hover align-middle cars-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Car</th>
                  <th>Registration</th>
                  <th>Year</th>
                  <th>Mileage</th>
                  <th>Condition</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCars.length > 0 ? (
                  filteredCars.map((car, index) => (
                    <tr key={car.id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="car-name">
                          {car.make} {car.model}
                        </div>
                        <div className="car-sub">Fleet vehicle</div>
                      </td>

                      <td>{car.registration_number}</td>
                      <td>{car.year}</td>
                      <td>{car.mileage} km</td>

                      <td>
                        <span className="condition-badge">
                          {car.condition}
                        </span>
                      </td>

                      <td>
                        <div className="cars-actions">
                          <Link
                            to={`/edit-car/${car.id}`}
                            className="cars-edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="cars-delete-btn"
                            onClick={() => openDeleteModal(car)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="cars-empty">
                      No cars found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="cars-mobile-list">
            {filteredCars.length > 0 ? (
              filteredCars.map((car, index) => (
                <div className="cars-mobile-card" key={car.id}>
                  <div className="cars-mobile-top">
                    <div>
                      <div className="car-name">
                        {index + 1}. {car.make} {car.model}
                      </div>
                      <div className="car-sub">{car.registration_number}</div>
                    </div>

                    <span className="condition-badge">{car.condition}</span>
                  </div>

                  <div className="cars-mobile-row">
                    <span>Year</span>
                    <strong>{car.year}</strong>
                  </div>

                  <div className="cars-mobile-row">
                    <span>Mileage</span>
                    <strong>{car.mileage} km</strong>
                  </div>

                  <div className="cars-actions">
                    <Link
                      to={`/edit-car/${car.id}`}
                      className="cars-edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="cars-delete-btn"
                      onClick={() => openDeleteModal(car)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="cars-empty">No cars found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;