import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, driversRes, carsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/assignments/"),
        axios.get("http://127.0.0.1:8000/api/drivers/"),
        axios.get("http://127.0.0.1:8000/api/cars/"),
      ]);

      setAssignments(assignmentsRes);
      setDrivers(driversRes);
      setCars(carsRes);
    } catch (error) {
      console.error("Error fetching assignments data:", error);
      setAssignments([]);
      setDrivers([]);
      setCars([]);
    }
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find((d) => Number(d.id) === Number(driverId));
    return driver ? driver.user_name || `Driver ${driverId}` : `Driver ${driverId}`;
  };

  const getCarName = (carId) => {
    const car = cars.find((c) => Number(c.id) === Number(carId));
    return car ? `${car.make} ${car.model} - ${car.registration_number}` : `Car ${carId}`;
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Are you sure you want to remove this assignment?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/assignments/${id}/`);
      alert("Assignment removed successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to remove assignment");
    }
  };

  const filteredAssignments = assignments.filter((item) =>
    `${getDriverName(item.driver)} ${getCarName(item.car)} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Car Assignments</h4>
            <p className="text-muted mb-0">Track which driver is assigned to which car.</p>
          </div>

          <Link to="/assign-driver" className="btn btn-primary">
            Assign Car
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <input
              className="form-control"
              placeholder="Search by driver, car, registration number, or status"
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
                    <th>Driver</th>
                    <th>Car</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{getDriverName(item.driver)}</strong>
                        </td>
                        <td>{getCarName(item.car)}</td>
                        <td>{item.start_date}</td>
                        <td>{item.end_date || "-"}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === "active" ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                         <Link
                          to={`/edit-assignment/${item.id}`}
                          className="btn btn-sm btn-warning me-2"
                         >
                          Edit
                         </Link>

                       <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteAssignment(item.id)}
                       >
                         Remove
                       </button>
                       </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No assignments found
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

export default Assignments;


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Assignments = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [cars, setCars] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const normalizeResponse = (res) => {
//     if (Array.isArray(res)) return res;
//     if (Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.results)) return res.results;
//     if (Array.isArray(res?.data?.results)) return res.data.results;
//     return [];
//   };

//   const fetchData = async () => {
//     try {
//       const [assignmentsRes, driversRes, carsRes] = await Promise.all([
//         axios.get("http://127.0.0.1:8000/api/assignments/"),
//         axios.get("http://127.0.0.1:8000/api/drivers/"),
//         axios.get("http://127.0.0.1:8000/api/cars/"),
//       ]);

//       setAssignments(normalizeResponse(assignmentsRes));
//       setDrivers(normalizeResponse(driversRes));
//       setCars(normalizeResponse(carsRes));
//     } catch (error) {
//       console.error("Error fetching assignments data:", error);
//       setAssignments([]);
//       setDrivers([]);
//       setCars([]);
//     }
//   };

//   const getDriverName = (driverId) => {
//     const driver = drivers.find((d) => Number(d.id) === Number(driverId));
//     return driver
//       ? driver.user_name || `Driver ${driverId}`
//       : `Driver ${driverId}`;
//   };

//   const getCarName = (carId) => {
//     const car = cars.find((c) => Number(c.id) === Number(carId));
//     return car
//       ? `${car.make} ${car.model} - ${car.registration_number}`
//       : `Car ${carId}`;
//   };

//   const deleteAssignment = async (id) => {
//     if (!window.confirm("Are you sure you want to remove this assignment?")) return;

//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/assignments/${id}/`);
//       alert("Assignment removed successfully");
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting assignment:", error);
//       alert("Failed to remove assignment");
//     }
//   };

//   const filteredAssignments = assignments.filter((item) =>
//     `${getDriverName(item.driver)} ${getCarName(item.car)} ${item.status || ""}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h4 className="mb-1">Car Assignments</h4>
//             <p className="text-muted mb-0">
//               Track which driver is assigned to which car.
//             </p>
//           </div>

//           <Link to="/assign-driver" className="btn btn-primary">
//             Assign Car
//           </Link>
//         </div>

//         <div className="card mb-4">
//           <div className="card-body">
//             <input
//               className="form-control"
//               placeholder="Search by driver, car, registration number, or status"
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
//                     <th>Driver</th>
//                     <th>Car</th>
//                     <th>Start Date</th>
//                     <th>End Date</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredAssignments.length > 0 ? (
//                     filteredAssignments.map((item, index) => (
//                       <tr key={item.id}>
//                         <td>{index + 1}</td>
//                         <td>
//                           <strong>{getDriverName(item.driver)}</strong>
//                         </td>
//                         <td>{getCarName(item.car)}</td>
//                         <td>{item.start_date}</td>
//                         <td>{item.end_date || "-"}</td>
//                         <td>
//                           <span
//                             className={`badge ${
//                               item.status === "active"
//                                 ? "bg-success"
//                                 : "bg-secondary"
//                             }`}
//                           >
//                             {item.status}
//                           </span>
//                         </td>
//                         <td>
//                           <Link
//                             to={`/edit-assignment/${item.id}`}
//                             className="btn btn-sm btn-warning me-2"
//                           >
//                             Edit
//                           </Link>

//                           <button
//                             className="btn btn-sm btn-danger"
//                             onClick={() => deleteAssignment(item.id)}
//                           >
//                             Remove
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="text-center">
//                         No assignments found
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

// export default Assignments;