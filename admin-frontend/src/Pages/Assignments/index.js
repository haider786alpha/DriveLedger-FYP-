// import React from "react";

// const Assignments = () => {
//   const assignments = [
//     {
//       id: 1,
//       driver: "Ali Khan",
//       car: "Toyota Corolla",
//       registration: "ABC-123",
//       startDate: "2026-04-01",
//       endDate: "-",
//       status: "Active",
//     },
//     {
//       id: 2,
//       driver: "Usman Tariq",
//       car: "Honda City",
//       registration: "ICT-456",
//       startDate: "2026-03-20",
//       endDate: "-",
//       status: "Active",
//     },
//     {
//       id: 3,
//       driver: "Bilal Ahmed",
//       car: "Suzuki WagonR",
//       registration: "RWP-789",
//       startDate: "2026-02-10",
//       endDate: "2026-03-15",
//       status: "Completed",
//     },
//   ];

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 className="mb-0">Car Assignments</h4>
//           <button className="btn btn-primary">Assign Car</button>
//         </div>

//         <div className="card mb-4">
//           <div className="card-body">
//             <div className="row g-3">
//               <div className="col-md-4">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search by driver name"
//                 />
//               </div>
//               <div className="col-md-3">
//                 <select className="form-select">
//                   <option>Filter by Status</option>
//                   <option>Active</option>
//                   <option>Completed</option>
//                 </select>
//               </div>
//             </div>
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
//                     <th>Registration No</th>
//                     <th>Start Date</th>
//                     <th>End Date</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {assignments.map((item) => (
//                     <tr key={item.id}>
//                       <td>{item.id}</td>
//                       <td>{item.driver}</td>
//                       <td>{item.car}</td>
//                       <td>{item.registration}</td>
//                       <td>{item.startDate}</td>
//                       <td>{item.endDate}</td>
//                       <td>
//                         <span
//                           className={`badge ${
//                             item.status === "Active"
//                               ? "bg-success"
//                               : "bg-secondary"
//                           }`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>
//                       <td>
//                         <button className="btn btn-sm btn-info me-2">
//                           View
//                         </button>
//                         <button className="btn btn-sm btn-warning me-2">
//                           Edit
//                         </button>
//                         <button className="btn btn-sm btn-danger">
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
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

import React from "react";
import { Link } from "react-router-dom";

const Assignments = () => {
  const assignments = [
    {
      id: 1,
      driver: "Ali Khan",
      car: "Toyota Corolla",
      registration: "ABC-123",
      startDate: "2026-04-01",
      endDate: "-",
      status: "Active",
    },
    {
      id: 2,
      driver: "Usman Tariq",
      car: "Honda City",
      registration: "ICT-456",
      startDate: "2026-03-20",
      endDate: "-",
      status: "Active",
    },
    {
      id: 3,
      driver: "Bilal Ahmed",
      car: "Suzuki WagonR",
      registration: "RWP-789",
      startDate: "2026-02-10",
      endDate: "2026-03-15",
      status: "Completed",
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Car Assignments</h4>
          <Link to="/assign-driver" className="btn btn-primary">
            Assign Car
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by driver name"
                />
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Filter by Status</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
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
                    <th>Registration No</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.driver}</td>
                      <td>{item.car}</td>
                      <td>{item.registration}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
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