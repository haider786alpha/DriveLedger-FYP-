import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";
import "./Drivers.css";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    driver: null,
    deleting: false,
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(API_URL("/api/drivers/"));
      setDrivers(normalizeResponse(response));
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers([]);

      showToast(
        "error",
        "Drivers Load Failed",
        "Could not load driver records. Please refresh and try again."
      );
    }
  };

  const openDeleteModal = (driver) => {
    setDeleteModal({
      open: true,
      driver,
      deleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      driver: null,
      deleting: false,
    });
  };

  const confirmDeleteDriver = async () => {
    if (!deleteModal.driver?.id) return;

    setDeleteModal((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await axios.delete(API_URL(`/api/drivers/${deleteModal.driver.id}/`));

      closeDeleteModal();

      showToast(
        "success",
        "Driver Deleted Successfully",
        "Driver record has been removed from DriveLedger."
      );

      fetchDrivers();
    } catch (error) {
      console.error("Error deleting driver:", error);

      setDeleteModal((prev) => ({
        ...prev,
        deleting: false,
      }));

      showToast(
        "error",
        "Delete Failed",
        "Driver could not be deleted. Please try again."
      );
    }
  };

  const filteredDrivers = drivers.filter((driver) =>
    `${driver.user_name || ""} ${driver.cnic || ""} ${
      driver.license_number || ""
    } ${driver.address || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const completeDocuments = drivers.filter(
    (driver) => driver.profile_photo_url && driver.license_copy_url
  ).length;

  return (
    <div className="page-content driveledger-drivers">
      {toast && (
        <div className={`driver-toast driver-toast-${toast.type}`}>
          <div className="driver-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="driver-modal-backdrop">
          <div className="driver-modal-card">
            <div className="driver-modal-icon">!</div>

            <h5>Delete Driver Record?</h5>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteModal.driver?.user_name ||
                  `Driver ${deleteModal.driver?.id}`}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="driver-modal-actions">
              <button
                type="button"
                className="driver-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="driver-modal-delete"
                onClick={confirmDeleteDriver}
                disabled={deleteModal.deleting}
              >
                {deleteModal.deleting ? "Deleting..." : "Delete Driver"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="drivers-hero drivers-reveal drivers-delay-1">
          <div>
            <div className="drivers-hero-pill">
              <span className="dl-status-dot"></span>
              Driver Records
            </div>

            <h4>Driver Management</h4>
            <p>
              Manage driver profiles, CNIC, licenses, addresses, profile photos,
              and uploaded documents.
            </p>
          </div>

          <Link to="/add-driver" className="drivers-add-btn">
            + Add Driver
          </Link>
        </div>

        <div className="drivers-search-card drivers-reveal drivers-delay-2">
          <input
            type="text"
            className="drivers-search-input"
            placeholder="Search by driver name, CNIC, license number, or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="drivers-table-card drivers-reveal drivers-delay-3">
          <div className="drivers-table-header">
            <div>
              <h5>Driver List</h5>
              <p className="text-muted mb-0">
                Showing {filteredDrivers.length} of {drivers.length} driver records
              </p>
            </div>

            <span className="drivers-count">
              {completeDocuments} Complete · {drivers.length} Total
            </span>
          </div>

          <div className="drivers-table-wrap">
            <table className="table table-hover align-middle drivers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Driver</th>
                  <th>CNIC</th>
                  <th>License Number</th>
                  <th>License Copy</th>
                  <th>Document Status</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver, index) => {
                    const hasProfilePhoto = Boolean(driver.profile_photo_url);
                    const hasLicenseCopy = Boolean(driver.license_copy_url);
                    const documentsComplete = hasProfilePhoto && hasLicenseCopy;

                    return (
                      <tr key={driver.id}>
                        <td>{index + 1}</td>

                        <td>
                          {hasProfilePhoto ? (
                            <a
                              href={driver.profile_photo_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={driver.profile_photo_url}
                                alt={driver.user_name || "Driver"}
                                className="driver-avatar"
                              />
                            </a>
                          ) : (
                            <span className="driver-avatar-placeholder">
                              N/A
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="driver-name">
                            {driver.user_name || `Driver ${driver.id}`}
                          </div>
                          <div className="driver-sub">Registered driver</div>
                        </td>

                        <td>{driver.cnic}</td>
                        <td>{driver.license_number}</td>

                        <td>
                          {hasLicenseCopy ? (
                            <a
                              href={driver.license_copy_url}
                              target="_blank"
                              rel="noreferrer"
                              className="driver-license-link"
                            >
                              View License
                            </a>
                          ) : (
                            <span className="driver-badge driver-badge-muted">
                              Not Uploaded
                            </span>
                          )}
                        </td>

                        <td>
                          {documentsComplete ? (
                            <span className="driver-badge driver-badge-success">
                              Complete
                            </span>
                          ) : (
                            <span className="driver-badge driver-badge-warning">
                              Incomplete
                            </span>
                          )}
                        </td>

                        <td className="driver-address">{driver.address}</td>

                        <td>
                          <div className="drivers-actions">
                            <Link
                              to={`/edit-driver/${driver.id}`}
                              className="drivers-edit-btn"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="drivers-delete-btn"
                              onClick={() => openDeleteModal(driver)}
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
                    <td colSpan="9" className="drivers-empty">
                      No drivers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="drivers-mobile-list">
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver, index) => {
                const hasProfilePhoto = Boolean(driver.profile_photo_url);
                const hasLicenseCopy = Boolean(driver.license_copy_url);
                const documentsComplete = hasProfilePhoto && hasLicenseCopy;

                return (
                  <div className="drivers-mobile-card" key={driver.id}>
                    <div className="drivers-mobile-top">
                      <div className="drivers-mobile-profile">
                        {hasProfilePhoto ? (
                          <a
                            href={driver.profile_photo_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={driver.profile_photo_url}
                              alt={driver.user_name || "Driver"}
                              className="driver-avatar"
                            />
                          </a>
                        ) : (
                          <span className="driver-avatar-placeholder">
                            N/A
                          </span>
                        )}

                        <div>
                          <div className="driver-name">
                            {index + 1}.{" "}
                            {driver.user_name || `Driver ${driver.id}`}
                          </div>
                          <div className="driver-sub">
                            {driver.license_number || "No license number"}
                          </div>
                        </div>
                      </div>

                      {documentsComplete ? (
                        <span className="driver-badge driver-badge-success">
                          Complete
                        </span>
                      ) : (
                        <span className="driver-badge driver-badge-warning">
                          Incomplete
                        </span>
                      )}
                    </div>

                    <div className="drivers-mobile-row">
                      <span>CNIC</span>
                      <strong>{driver.cnic || "-"}</strong>
                    </div>

                    <div className="drivers-mobile-row">
                      <span>License Copy</span>
                      <strong>
                        {hasLicenseCopy ? (
                          <a
                            href={driver.license_copy_url}
                            target="_blank"
                            rel="noreferrer"
                            className="driver-license-link"
                          >
                            View
                          </a>
                        ) : (
                          "Not Uploaded"
                        )}
                      </strong>
                    </div>

                    <div className="drivers-mobile-row">
                      <span>Address</span>
                      <strong>{driver.address || "-"}</strong>
                    </div>

                    <div className="drivers-actions">
                      <Link
                        to={`/edit-driver/${driver.id}`}
                        className="drivers-edit-btn"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="drivers-delete-btn"
                        onClick={() => openDeleteModal(driver)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="drivers-empty">No drivers found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;