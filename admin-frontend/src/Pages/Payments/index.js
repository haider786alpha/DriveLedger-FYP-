// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Payments = () => {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/payments/");
//       setPayments(response);
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       setPayments([]);
//     }
//   };

//   const deletePayment = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this payment?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/payments/${id}/`);
//       alert("Payment deleted successfully");
//       fetchPayments();
//     } catch (error) {
//       console.error("Error deleting payment:", error);
//       alert("Failed to delete payment");
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 className="mb-0">Payments</h4>

//           <Link to="/add-payment" className="btn btn-primary">
//             Add Payment Entry
//           </Link>
//         </div>

//         <div className="card">
//           <div className="card-body">
//             <div className="table-responsive">
//               <table className="table table-bordered table-hover align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>#</th>
//                     <th>Assignment ID</th>
//                     <th>Amount</th>
//                     <th>Payment Date</th>
//                     <th>Status</th>
//                     <th>Remarks</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {Array.isArray(payments) && payments.length > 0 ? (
//                     payments.map((payment) => (
//                       <tr key={payment.id}>
//                         <td>{payment.id}</td>
//                         <td>{payment.assignment}</td>
//                         <td>Rs. {payment.amount}</td>
//                         <td>{payment.payment_date}</td>
//                         <td>
//                           <span
//                             className={`badge ${
//                               payment.status === "paid" ? "bg-success" : "bg-danger"
//                             }`}
//                           >
//                             {payment.status}
//                           </span>
//                         </td>
//                         <td>{payment.remarks || "-"}</td>
//                         <td>
//                           <Link
//                             to={`/edit-payment/${payment.id}`}
//                             className="btn btn-sm btn-warning me-2"
//                           >
//                             Edit
//                           </Link>

//                           <button
//                             className="btn btn-sm btn-danger"
//                             onClick={() => deletePayment(payment.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="text-center">
//                         No payments found
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

// export default Payments;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/payments/");
      setPayments(response);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/payments/${id}/`);
      alert("Payment deleted successfully");
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment");
    }
  };

  const filteredPayments = payments.filter((payment) =>
    `${payment.assignment} ${payment.amount} ${payment.payment_date} ${payment.status} ${payment.remarks}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Payments</h4>
            <p className="text-muted mb-0">Manage driver payment records and statuses.</p>
          </div>

          <Link to="/add-payment" className="btn btn-primary">
            Add Payment Entry
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <input
              className="form-control"
              placeholder="Search by assignment, amount, date, status, or remarks"
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
                    <th>Assignment</th>
                    <th>Amount</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment, index) => (
                      <tr key={payment.id}>
                        <td>{index + 1}</td>
                        <td>Assignment #{payment.assignment}</td>
                        <td>
                          <strong>Rs. {payment.amount}</strong>
                        </td>
                        <td>{payment.payment_date}</td>
                        <td>
                          <span
                            className={`badge ${
                              payment.status === "paid" ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td>{payment.remarks || "-"}</td>
                        <td>
                          <Link
                            to={`/edit-payment/${payment.id}`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deletePayment(payment.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No payments found
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

export default Payments;