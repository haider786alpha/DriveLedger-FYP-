import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

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

  const deleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/cars/${id}/`);
      alert("Car deleted successfully");
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car");
    }
  };

  const filteredCars = cars.filter((car) =>
    `${car.make} ${car.model} ${car.registration_number}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Car Management</h4>
            <p className="text-muted mb-0">Manage vehicle records, condition and details.</p>
          </div>

          <Link to="/add-car" className="btn btn-primary">
            Add Car
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <input
              className="form-control"
              placeholder="Search by make, model, or registration number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
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
                          <strong>{car.make} {car.model}</strong>
                        </td>
                        <td>{car.registration_number}</td>
                        <td>{car.year}</td>
                        <td>{car.mileage} km</td>
                        <td>
                          <span className="badge bg-info">
                            {car.condition}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/edit-car/${car.id}`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteCar(car.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No cars found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cars;


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Cars = () => {
//   const [cars, setCars] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchCars();
//   }, []);

//   const normalizeResponse = (res) => {
//     if (Array.isArray(res)) return res;
//     if (Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.results)) return res.results;
//     if (Array.isArray(res?.data?.results)) return res.data.results;
//     return [];
//   };

//   const fetchCars = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/cars/");
//       setCars(normalizeResponse(response));
//     } catch (error) {
//       console.error("Error fetching cars:", error);
//       setCars([]);
//     }
//   };

//   const deleteCar = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this car?")) return;

//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/cars/${id}/`);
//       alert("Car deleted successfully");
//       fetchCars();
//     } catch (error) {
//       console.error("Error deleting car:", error);
//       alert("Failed to delete car");
//     }
//   };

//   const filteredCars = cars.filter((car) =>
//     `${car.make || ""} ${car.model || ""} ${car.registration_number || ""}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h4 className="mb-1">Car Management</h4>
//             <p className="text-muted mb-0">
//               Manage vehicle records, condition and details.
//             </p>
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
//                           <strong>
//                             {car.make} {car.model}
//                           </strong>
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