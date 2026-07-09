import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    payment: null,
    deleting: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchData = async () => {
    try {
      const [paymentsRes, assignmentsRes, driversRes, carsRes] =
        await Promise.all([
          axios.get(API_URL("/api/payments/")),
          axios.get(API_URL("/api/assignments/")),
          axios.get(API_URL("/api/drivers/")),
          axios.get(API_URL("/api/cars/")),
        ]);

      setPayments(normalizeResponse(paymentsRes));
      setAssignments(normalizeResponse(assignmentsRes));
      setDrivers(normalizeResponse(driversRes));
      setCars(normalizeResponse(carsRes));
    } catch (error) {
      console.error("Error fetching payments data:", error);

      setPayments([]);
      setAssignments([]);
      setDrivers([]);
      setCars([]);

      showToast(
        "error",
        "Payments Load Failed",
        "Could not load payment records. Please refresh and try again."
      );
    }
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find((item) => Number(item.id) === Number(driverId));

    return driver
      ? driver.user_name || `Driver ${driverId}`
      : `Driver ${driverId}`;
  };

  const getCarName = (carId) => {
    const car = cars.find((item) => Number(item.id) === Number(carId));

    return car
      ? `${car.make} ${car.model} - ${car.registration_number}`
      : `Car ${carId}`;
  };

  const getAssignmentDetails = (assignmentId) => {
    const assignmentIndex = assignments.findIndex(
      (item) => Number(item.id) === Number(assignmentId)
    );

    const assignment = assignments[assignmentIndex];

    if (!assignment) {
      return {
        assignmentNo: "-",
        driverName: "Unknown Driver",
        carName: "Unknown Car",
        assignmentLabel: `Assignment ID #${assignmentId}`,
      };
    }

    return {
      assignmentNo: assignmentIndex + 1,
      driverName: getDriverName(assignment.driver),
      carName: getCarName(assignment.car),
      assignmentLabel: `Assignment ID #${assignment.id}`,
    };
  };

  const openDeleteModal = (payment) => {
    setDeleteModal({
      open: true,
      payment,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      payment: null,
      deleting: false,
    });
  };

  const confirmDeletePayment = async () => {
    if (!deleteModal.payment?.id) return;

    setDeleteModal((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await axios.delete(API_URL(`/api/payments/${deleteModal.payment.id}/`));

      closeDeleteModal();

      showToast(
        "success",
        "Payment Deleted Successfully",
        "Payment entry has been removed from DriveLedger."
      );

      fetchData();
    } catch (error) {
      console.error("Error deleting payment:", error);

      setDeleteModal((prev) => ({
        ...prev,
        deleting: false,
      }));

      showToast(
        "error",
        "Delete Failed",
        "Payment could not be deleted. Please try again."
      );
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const details = getAssignmentDetails(payment.assignment);

    return `${details.assignmentNo} ${details.driverName} ${details.carName} ${
      details.assignmentLabel
    } ${payment.amount || ""} ${payment.payment_date || ""} ${
      payment.status || ""
    } ${payment.remarks || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const paidPayments = payments.filter(
    (payment) => String(payment.status).toLowerCase() === "paid"
  ).length;

  const unpaidPayments = payments.filter(
    (payment) => String(payment.status).toLowerCase() !== "paid"
  ).length;

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  return (
    <div className="page-content driveledger-payments">
      {toast && (
        <div className={`payment-toast payment-toast-${toast.type}`}>
          <div className="payment-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="payment-modal-backdrop">
          <div className="payment-modal-card">
            <div className="payment-modal-icon">!</div>

            <h5>Delete Payment Entry?</h5>

            <p>
              Are you sure you want to delete payment of{" "}
              <strong>Rs. {deleteModal.payment?.amount}</strong>? This action
              cannot be undone.
            </p>

            <div className="payment-modal-actions">
              <button
                type="button"
                className="payment-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="payment-modal-delete"
                onClick={confirmDeletePayment}
                disabled={deleteModal.deleting}
              >
                {deleteModal.deleting ? "Deleting..." : "Delete Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="payments-hero payments-reveal payments-delay-1">
          <div>
            <div className="payments-hero-pill">
              <span className="dl-status-dot"></span>
              Driver Payment Tracking
            </div>

            <h4>Payments</h4>
            <p>
              Manage driver payment entries, payment status, remarks and total
              collection records.
            </p>
          </div>

          <Link to="/add-payment" className="payments-add-btn">
            + Add Payment Entry
          </Link>
        </div>

        <div className="payments-search-card payments-reveal payments-delay-2">
          <input
            className="payments-search-input"
            placeholder="Search by assignment no, driver, car, amount, date, status, or remarks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="payments-table-card payments-reveal payments-delay-3">
          <div className="payments-table-header">
            <div>
              <h5>Payment List</h5>
              <p className="text-muted mb-0">
                Showing {filteredPayments.length} of {payments.length} payment
                records
              </p>
            </div>

            <span className="payments-count">
              Rs. {totalAmount} · {paidPayments} Paid · {unpaidPayments} Unpaid
            </span>
          </div>

          <div className="payments-table-wrap">
            <table className="table table-hover align-middle payments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Assignment Details</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => {
                    const details = getAssignmentDetails(payment.assignment);

                    return (
                      <tr key={payment.id}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="payment-assignment">
                            Assignment No. {details.assignmentNo}
                          </div>
                          <div className="payment-sub">
                            {details.driverName}
                          </div>
                          <div className="payment-sub">{details.carName}</div>
                          <div className="payment-sub">
                            {details.assignmentLabel}
                          </div>
                        </td>

                        <td>
                          <span className="payment-amount">
                            Rs. {payment.amount}
                          </span>
                        </td>

                        <td>
                          <span className="payment-date">
                            {payment.payment_date || "-"}
                          </span>
                        </td>

                        <td>
                          <PaymentStatus status={payment.status} />
                        </td>

                        <td className="payment-remarks">
                          {payment.remarks || "-"}
                        </td>

                        <td>
                          <div className="payments-actions">
                            <Link
                              to={`/edit-payment/${payment.id}`}
                              className="payments-edit-btn"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="payments-delete-btn"
                              onClick={() => openDeleteModal(payment)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="payments-empty">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="payments-mobile-list">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => {
                const details = getAssignmentDetails(payment.assignment);

                return (
                  <div className="payments-mobile-card" key={payment.id}>
                    <div className="payments-mobile-top">
                      <div>
                        <div className="payment-assignment">
                          Payment {index + 1} · Assignment No.{" "}
                          {details.assignmentNo}
                        </div>
                        <div className="payment-sub">
                          {details.driverName}
                        </div>
                        <div className="payment-sub">{details.carName}</div>
                        <div className="payment-sub">
                          {details.assignmentLabel}
                        </div>
                      </div>

                      <PaymentStatus status={payment.status} />
                    </div>

                    <div className="payments-mobile-row">
                      <span>Amount</span>
                      <strong>Rs. {payment.amount}</strong>
                    </div>

                    <div className="payments-mobile-row">
                      <span>Date</span>
                      <strong>{payment.payment_date || "-"}</strong>
                    </div>

                    <div className="payments-mobile-row">
                      <span>Remarks</span>
                      <strong>{payment.remarks || "-"}</strong>
                    </div>

                    <div className="payments-actions">
                      <Link
                        to={`/edit-payment/${payment.id}`}
                        className="payments-edit-btn"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="payments-delete-btn"
                        onClick={() => openDeleteModal(payment)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="payments-empty">No payments found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentStatus = ({ status }) => {
  const isPaid = String(status).toLowerCase() === "paid";

  return (
    <span
      className={`payment-badge ${
        isPaid ? "payment-badge-paid" : "payment-badge-unpaid"
      }`}
    >
      {status || "unpaid"}
    </span>
  );
};

export default Payments;