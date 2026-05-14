import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";
import "./DriverLocations.css";

const DriverLocations = () => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLocations(false);
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

  const fetchLocations = async (showSuccess = true) => {
    try {
      setRefreshing(true);

      const res = await axios.get(API_URL("/api/driver-locations/"));
      setLocations(normalizeResponse(res));

      if (showSuccess) {
        showToast(
          "success",
          "Locations Refreshed",
          "Latest driver location records have been loaded."
        );
      }
    } catch (error) {
      console.error("Driver locations error:", error);
      setLocations([]);

      showToast(
        "error",
        "Locations Load Failed",
        "Could not load driver locations. Please refresh and try again."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const openMap = (latitude, longitude) => {
    if (!latitude || !longitude) {
      showToast(
        "error",
        "Location Missing",
        "Latitude or longitude is not available for this driver."
      );
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank"
    );
  };

  const filteredLocations = locations.filter((item) =>
    `${item.driver_name || ""} ${item.driver_cnic || ""} ${
      item.license_number || ""
    } ${item.latitude || ""} ${item.longitude || ""} ${
      item.address_note || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (value) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <div className="page-content driveledger-locations">
      {toast && (
        <div className={`location-toast location-toast-${toast.type}`}>
          <div className="location-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="locations-hero locations-reveal locations-delay-1">
          <div>
            <div className="locations-hero-pill">
              <span className="dl-status-dot"></span>
              Manual Location Sharing
            </div>

            <h4>Driver Locations</h4>
            <p>
              View the latest locations manually shared by drivers from the
              driver panel.
            </p>
          </div>

          <button
            type="button"
            className="locations-refresh-btn"
            onClick={() => fetchLocations(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh Locations"}
          </button>
        </div>

        <div className="locations-search-card locations-reveal locations-delay-2">
          <input
            className="locations-search-input"
            placeholder="Search by driver, CNIC, license, latitude, longitude, or note"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="locations-table-card locations-reveal locations-delay-3">
          <div className="locations-table-header">
            <div>
              <h5>Location Records</h5>
              <p className="text-muted mb-0">
                Showing {filteredLocations.length} of {locations.length} location
                records
              </p>
            </div>

            <span className="locations-count">
              {locations.length} Total Records
            </span>
          </div>

          <div className="locations-table-wrap">
            <table className="table table-hover align-middle locations-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Driver</th>
                  <th>CNIC</th>
                  <th>License Number</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Note</th>
                  <th>Last Updated</th>
                  <th>Map</th>
                </tr>
              </thead>

              <tbody>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="location-driver-name">
                          {item.driver_name || `Driver ${item.driver}`}
                        </div>
                        <div className="location-sub">Shared location</div>
                      </td>

                      <td>{item.driver_cnic || "-"}</td>
                      <td>{item.license_number || "-"}</td>

                      <td>
                        <span className="location-coordinate">
                          {item.latitude || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="location-coordinate">
                          {item.longitude || "-"}
                        </span>
                      </td>

                      <td className="location-note">
                        {item.address_note || "-"}
                      </td>

                      <td>{formatDate(item.updated_at)}</td>

                      <td>
                        <button
                          type="button"
                          className="location-map-btn"
                          onClick={() => openMap(item.latitude, item.longitude)}
                        >
                          Open Map
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="locations-empty">
                      No driver locations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="locations-mobile-list">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((item, index) => (
                <div className="locations-mobile-card" key={item.id}>
                  <div className="locations-mobile-top">
                    <div>
                      <div className="location-driver-name">
                        {index + 1}.{" "}
                        {item.driver_name || `Driver ${item.driver}`}
                      </div>
                      <div className="location-sub">
                        {formatDate(item.updated_at)}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="location-map-btn"
                      onClick={() => openMap(item.latitude, item.longitude)}
                    >
                      Map
                    </button>
                  </div>

                  <div className="locations-mobile-row">
                    <span>CNIC</span>
                    <strong>{item.driver_cnic || "-"}</strong>
                  </div>

                  <div className="locations-mobile-row">
                    <span>License</span>
                    <strong>{item.license_number || "-"}</strong>
                  </div>

                  <div className="locations-mobile-row">
                    <span>Latitude</span>
                    <strong>{item.latitude || "-"}</strong>
                  </div>

                  <div className="locations-mobile-row">
                    <span>Longitude</span>
                    <strong>{item.longitude || "-"}</strong>
                  </div>

                  <div className="locations-mobile-row">
                    <span>Note</span>
                    <strong>{item.address_note || "-"}</strong>
                  </div>
                </div>
              ))
            ) : (
              <div className="locations-empty">No driver locations found</div>
            )}
          </div>

          <div className="locations-alert">
            <div className="locations-alert-icon">i</div>
            <div>
              Drivers are not tracked automatically. Location is shown only after
              a driver clicks <strong>Share Current Location</strong> from the
              driver panel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLocations;