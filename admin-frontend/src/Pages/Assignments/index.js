import React, { useEffect, useState } from "react";
import { API_URL } from "../../helpers/apiConfig";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Assignments.css";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    assignment: null,
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
      const [assignmentsRes, driversRes, carsRes] = await Promise.all([
        axios.get(API_URL("/api/assignments/")),
        axios.get(API_URL("/api/drivers/")),
        axios.get(API_URL("/api/cars/")),
      ]);

      setAssignments(normalizeResponse(assignmentsRes));
      setDrivers(normalizeResponse(driversRes));
      setCars(normalizeResponse(carsRes));
    } catch (error) {
      console.error("Error fetching assignments data:", error);
      setAssignments([]);
      setDrivers([]);
      setCars([]);

      showToast(
        "error",
        "Assignments Load Failed",
        "Could not load assignments data. Please refresh and try again."
      );
    }
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find((d) => Number(d.id) === Number(driverId));
    return driver
      ? driver.user_name || `Driver ${driverId}`
      : `Driver ${driverId}`;
  };

  const getCarName = (carId) => {
    const car = cars.find((c) => Number(c.id) === Number(carId));
    return car
      ? `${car.make} ${car.model} - ${car.registration_number}`
      : `Car ${carId}`;
  };

  const openDeleteModal = (assignment) => {
    setDeleteModal({
      open: true,
      assignment,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      assignment: null,
      deleting: false,
    });
  };

  const confirmDeleteAssignment = async () => {
    if (!deleteModal.assignment?.id) return;

    setDeleteModal((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await axios.delete(
        API_URL(`/api/assignments/${deleteModal.assignment.id}/`)
      );

      closeDeleteModal();

      showToast(
        "success",
        "Assignment Removed Successfully",
        "Car assignment has been removed from DriveLedger."
      );

      fetchData();
    } catch (error) {
      console.error("Error deleting assignment:", error);

      setDeleteModal((prev) => ({
        ...prev,
        deleting: false,
      }));

      showToast(
        "error",
        "Remove Failed",
        "Assignment could not be removed. Please try again."
      );
    }
  };

  const filteredAssignments = assignments.filter((item) =>
    `${item.id} ${getDriverName(item.driver)} ${getCarName(item.car)} ${
      item.status
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeAssignments = assignments.filter(
    (item) => String(item.status).toLowerCase() === "active"
  ).length;

  return (
    <div className="page-content driveledger-assignments">
      {toast && (
        <div className={`assignment-toast assignment-toast-${toast.type}`}>
          <div className="assignment-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="assignment-modal-backdrop">
          <div className="assignment-modal-card">
            <div className="assignment-modal-icon">!</div>

            <h5>Remove Assignment?</h5>

            <p>
              Are you sure you want to remove this assignment for{" "}
              <strong>{getDriverName(deleteModal.assignment?.driver)}</strong>?
              This action cannot be undone.
            </p>

            <div className="assignment-modal-actions">
              <button
                type="button"
                className="assignment-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="assignment-modal-delete"
                onClick={confirmDeleteAssignment}
                disabled={deleteModal.deleting}
              >
                {deleteModal.deleting ? "Removing..." : "Remove Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="assignments-hero assignments-reveal assignments-delay-1">
          <div>
            <div className="assignments-hero-pill">
              <span className="dl-status-dot"></span>
              Fleet Assignment Tracking
            </div>

            <h4>Car Assignments</h4>
            <p>
              Track which driver is assigned to which vehicle and monitor active
              assignment status.
            </p>
          </div>

          <Link to="/assign-driver" className="assignments-add-btn">
            + Assign Car
          </Link>
        </div>

        <div className="assignments-search-card assignments-reveal assignments-delay-2">
          <input
            className="assignments-search-input"
            placeholder="Search by assignment ID, driver, car, registration number, or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="assignments-table-card assignments-reveal assignments-delay-3">
          <div className="assignments-table-header">
            <div>
              <h5>Assignment List</h5>
              <p className="text-muted mb-0">
                Showing {filteredAssignments.length} of {assignments.length}{" "}
                assignment records
              </p>
            </div>

            <span className="assignments-count">
              {activeAssignments} Active · {assignments.length} Total
            </span>
          </div>

          <div className="assignments-table-wrap">
            <table className="table table-hover align-middle assignments-table">
              <thead>
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
                        <div className="assignment-name">
                          {getDriverName(item.driver)}
                        </div>
                        <div className="assignment-sub">
                          Assignment ID #{item.id}
                        </div>
                        <div className="assignment-sub">Assigned driver</div>
                      </td>

                      <td>
                        <div className="assignment-car">
                          {getCarName(item.car)}
                        </div>
                      </td>

                      <td>
                        <span className="assignment-date">
                          {item.start_date || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="assignment-date">
                          {item.end_date || "-"}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={item.status} />
                      </td>

                      <td>
                        <div className="assignments-actions">
                          <Link
                            to={`/edit-assignment/${item.id}`}
                            className="assignments-edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="assignments-delete-btn"
                            onClick={() => openDeleteModal(item)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="assignments-empty">
                      No assignments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="assignments-mobile-list">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((item, index) => (
                <div className="assignments-mobile-card" key={item.id}>
                  <div className="assignments-mobile-top">
                    <div>
                      <div className="assignment-name">
                        {index + 1}. {getDriverName(item.driver)}
                      </div>
                      <div className="assignment-sub">
                        Assignment ID #{item.id}
                      </div>
                      <div className="assignment-sub">
                        {getCarName(item.car)}
                      </div>
                    </div>

                    <StatusBadge status={item.status} />
                  </div>

                  <div className="assignments-mobile-row">
                    <span>Start Date</span>
                    <strong>{item.start_date || "-"}</strong>
                  </div>

                  <div className="assignments-mobile-row">
                    <span>End Date</span>
                    <strong>{item.end_date || "-"}</strong>
                  </div>

                  <div className="assignments-actions">
                    <Link
                      to={`/edit-assignment/${item.id}`}
                      className="assignments-edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="assignments-delete-btn"
                      onClick={() => openDeleteModal(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="assignments-empty">No assignments found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const isActive = String(status).toLowerCase() === "active";

  return (
    <span
      className={`assignment-badge ${
        isActive ? "assignment-badge-active" : "assignment-badge-inactive"
      }`}
    >
      {status || "inactive"}
    </span>
  );
};

export default Assignments;