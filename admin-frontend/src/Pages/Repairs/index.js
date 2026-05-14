import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";
import "./Repairs.css";

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    repair: null,
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
      const [repairsRes, carsRes] = await Promise.all([
        axios.get(API_URL("/api/repairs/")),
        axios.get(API_URL("/api/cars/")),
      ]);

      setRepairs(normalizeResponse(repairsRes));
      setCars(normalizeResponse(carsRes));
    } catch (error) {
      console.error("Error fetching repairs:", error);
      setRepairs([]);
      setCars([]);

      showToast(
        "error",
        "Repairs Load Failed",
        "Could not load repair records. Please refresh and try again."
      );
    }
  };

  const getCarName = (carId) => {
    const car = cars.find((c) => Number(c.id) === Number(carId));

    return car
      ? `${car.make} ${car.model} - ${car.registration_number}`
      : `Car ${carId}`;
  };

  const openDeleteModal = (repair) => {
    setDeleteModal({
      open: true,
      repair,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      repair: null,
      deleting: false,
    });
  };

  const confirmDeleteRepair = async () => {
    if (!deleteModal.repair?.id) return;

    setDeleteModal((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await axios.delete(API_URL(`/api/repairs/${deleteModal.repair.id}/`));

      closeDeleteModal();

      showToast(
        "success",
        "Repair Deleted Successfully",
        "Repair record has been removed from DriveLedger."
      );

      fetchData();
    } catch (error) {
      console.error("Error deleting repair:", error);

      setDeleteModal((prev) => ({
        ...prev,
        deleting: false,
      }));

      showToast(
        "error",
        "Delete Failed",
        "Repair record could not be deleted. Please try again."
      );
    }
  };

  const filteredRepairs = repairs.filter((item) =>
    `${getCarName(item.car)} ${item.issue || ""} ${item.priority || ""} ${
      item.status || ""
    } ${item.reported_date || ""} ${item.estimated_cost || ""} ${
      item.actual_cost || ""
    } ${item.notes || ""} ${
      item.bill_receipt_url ? "bill receipt uploaded" : "no bill"
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const completedRepairs = repairs.filter(
    (item) => String(item.status).toLowerCase() === "completed"
  ).length;

  const pendingRepairs = repairs.filter(
    (item) => String(item.status).toLowerCase() !== "completed"
  ).length;

  const totalEstimatedCost = repairs.reduce(
    (sum, item) => sum + Number(item.estimated_cost || 0),
    0
  );

  return (
    <div className="page-content driveledger-repairs">
      {toast && (
        <div className={`repair-toast repair-toast-${toast.type}`}>
          <div className="repair-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="repair-modal-backdrop">
          <div className="repair-modal-card">
            <div className="repair-modal-icon">!</div>

            <h5>Delete Repair Record?</h5>

            <p>
              Are you sure you want to delete repair record{" "}
              <strong>{deleteModal.repair?.issue}</strong>? This action cannot
              be undone.
            </p>

            <div className="repair-modal-actions">
              <button
                type="button"
                className="repair-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="repair-modal-delete"
                onClick={confirmDeleteRepair}
                disabled={deleteModal.deleting}
              >
                {deleteModal.deleting ? "Deleting..." : "Delete Repair"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="repairs-hero repairs-reveal repairs-delay-1">
          <div>
            <div className="repairs-hero-pill">
              <span className="dl-status-dot"></span>
              Vehicle Repair Tracking
            </div>

            <h4>Repairs</h4>
            <p>
              Manage vehicle repair requests, priorities, statuses, estimated
              costs, actual costs and repair bills.
            </p>
          </div>

          <Link to="/add-repair" className="repairs-add-btn">
            + Create Repair Request
          </Link>
        </div>

        <div className="repairs-search-card repairs-reveal repairs-delay-2">
          <input
            className="repairs-search-input"
            placeholder="Search by car, issue, priority, status, date, cost, notes, or bill status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="repairs-table-card repairs-reveal repairs-delay-3">
          <div className="repairs-table-header">
            <div>
              <h5>Repair List</h5>
              <p className="text-muted mb-0">
                Showing {filteredRepairs.length} of {repairs.length} repair
                records
              </p>
            </div>

            <span className="repairs-count">
              Rs. {totalEstimatedCost} Estimated · {completedRepairs} Completed ·{" "}
              {pendingRepairs} Pending
            </span>
          </div>

          <div className="repairs-table-wrap">
            <table className="table table-hover align-middle repairs-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Car</th>
                  <th>Issue</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported Date</th>
                  <th>Estimated Cost</th>
                  <th>Actual Cost</th>
                  <th>Bill / Receipt</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRepairs.length > 0 ? (
                  filteredRepairs.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="repair-car">{getCarName(item.car)}</div>
                      </td>

                      <td>
                        <div className="repair-issue">{item.issue}</div>
                        {item.notes && (
                          <div className="repair-sub">
                            {item.notes.length > 60
                              ? `${item.notes.slice(0, 60)}...`
                              : item.notes}
                          </div>
                        )}
                      </td>

                      <td>
                        <PriorityBadge priority={item.priority} />
                      </td>

                      <td>
                        <StatusBadge status={item.status} />
                      </td>

                      <td>
                        <span className="repair-date">
                          {item.reported_date || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="repair-cost">
                          Rs. {item.estimated_cost || 0}
                        </span>
                      </td>

                      <td>
                        <span className="repair-actual-cost">
                          Rs. {item.actual_cost || 0}
                        </span>
                      </td>

                      <td>
                        {item.bill_receipt_url ? (
                          <a
                            href={item.bill_receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="repair-bill-link"
                          >
                            View Bill
                          </a>
                        ) : (
                          <span className="repair-muted-badge">
                            Not Uploaded
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="repairs-actions">
                          <Link
                            to={`/edit-repair/${item.id}`}
                            className="repairs-edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="repairs-delete-btn"
                            onClick={() => openDeleteModal(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="repairs-empty">
                      No repairs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="repairs-mobile-list">
            {filteredRepairs.length > 0 ? (
              filteredRepairs.map((item, index) => (
                <div className="repairs-mobile-card" key={item.id}>
                  <div className="repairs-mobile-top">
                    <div>
                      <div className="repair-car">
                        {index + 1}. {getCarName(item.car)}
                      </div>
                      <div className="repair-sub">{item.issue}</div>
                    </div>

                    <StatusBadge status={item.status} />
                  </div>

                  <div className="repairs-mobile-row">
                    <span>Priority</span>
                    <strong>
                      <PriorityBadge priority={item.priority} />
                    </strong>
                  </div>

                  <div className="repairs-mobile-row">
                    <span>Reported Date</span>
                    <strong>{item.reported_date || "-"}</strong>
                  </div>

                  <div className="repairs-mobile-row">
                    <span>Estimated Cost</span>
                    <strong>Rs. {item.estimated_cost || 0}</strong>
                  </div>

                  <div className="repairs-mobile-row">
                    <span>Actual Cost</span>
                    <strong>Rs. {item.actual_cost || 0}</strong>
                  </div>

                  <div className="repairs-mobile-row">
                    <span>Bill</span>
                    <strong>
                      {item.bill_receipt_url ? (
                        <a
                          href={item.bill_receipt_url}
                          target="_blank"
                          rel="noreferrer"
                          className="repair-bill-link"
                        >
                          View
                        </a>
                      ) : (
                        "Not Uploaded"
                      )}
                    </strong>
                  </div>

                  {item.notes && (
                    <div className="repairs-mobile-row">
                      <span>Notes</span>
                      <strong>{item.notes}</strong>
                    </div>
                  )}

                  <div className="repairs-actions">
                    <Link
                      to={`/edit-repair/${item.id}`}
                      className="repairs-edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="repairs-delete-btn"
                      onClick={() => openDeleteModal(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="repairs-empty">No repairs found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PriorityBadge = ({ priority }) => {
  const value = String(priority || "low").toLowerCase();

  let className = "repair-badge repair-badge-low";

  if (value === "high") className = "repair-badge repair-badge-high";
  if (value === "medium") className = "repair-badge repair-badge-medium";

  return <span className={className}>{priority || "low"}</span>;
};

const StatusBadge = ({ status }) => {
  const value = String(status || "pending").toLowerCase();

  let className = "repair-badge repair-badge-pending";

  if (value === "completed") className = "repair-badge repair-badge-completed";
  if (value === "in_progress") className = "repair-badge repair-badge-progress";

  return <span className={className}>{status || "pending"}</span>;
};

export default Repairs;