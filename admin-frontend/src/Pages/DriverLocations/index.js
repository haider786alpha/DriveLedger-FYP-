import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";

const DriverLocations = () => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get(API_URL("/api/driver-locations/"));
      setLocations(normalizeResponse(res));
    } catch (error) {
      console.error("Driver locations error:", error);
      setLocations([]);
    }
  };

  const openMap = (latitude, longitude) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
  };

  const filteredLocations = locations.filter((item) =>
    `${item.driver_name || ""} ${item.driver_cnic || ""} ${
      item.license_number || ""
    } ${item.latitude || ""} ${item.longitude || ""} ${item.address_note || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Driver Locations</h4>
            <p className="text-muted mb-0">
              View latest locations shared manually by drivers.
            </p>
          </div>

          <button className="btn btn-primary" onClick={fetchLocations}>
            Refresh
          </button>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <input
              className="form-control"
              placeholder="Search by driver, CNIC, license, latitude, or longitude"
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
                          <strong>{item.driver_name || `Driver ${item.driver}`}</strong>
                        </td>

                        <td>{item.driver_cnic || "-"}</td>
                        <td>{item.license_number || "-"}</td>
                        <td>{item.latitude}</td>
                        <td>{item.longitude}</td>
                        <td>{item.address_note || "-"}</td>

                        <td>
                          {item.updated_at
                            ? new Date(item.updated_at).toLocaleString()
                            : "-"}
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => openMap(item.latitude, item.longitude)}
                          >
                            Open Map
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No driver locations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="alert alert-info mt-3 mb-0">
              Drivers are not tracked automatically. Location is shown only after a driver clicks
              <strong> Share Current Location </strong>
              from the driver panel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLocations;