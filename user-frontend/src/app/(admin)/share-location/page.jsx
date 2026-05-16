import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import DriverToast from "@/components/DriverToast";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./ShareLocation.css";

const ShareLocation = () => {
  const [driver, setDriver] = useState(null);
  const [locationRecord, setLocationRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3500);
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setLoading(false);
        return;
      }

      const res = await fetch(API_URL("/api/driver-locations/"));
      const data = await res.json();

      const matchedLocation = (Array.isArray(data) ? data : []).find(
        (item) => Number(item.driver) === Number(loggedInDriver.id)
      );

      setLocationRecord(matchedLocation || null);
    } catch (error) {
      console.error("Location fetch error:", error);
      setLocationRecord(null);
      showToast("Failed to load location data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (latitude, longitude) => {
    if (!driver) {
      showToast("Driver profile not found.", "error");
      return;
    }

    const payload = {
      driver: driver.id,
      latitude: Number(latitude).toFixed(7),
      longitude: Number(longitude).toFixed(7),
      address_note: "Shared from driver panel",
    };

    const url = locationRecord
      ? API_URL(`/api/driver-locations/${locationRecord.id}/`)
      : API_URL("/api/driver-locations/");

    const method = locationRecord ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.detail || data?.error || "Failed to save location");
    }

    setLocationRecord(data);
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by this browser.", "error");
      return;
    }

    setSharing(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          await saveLocation(latitude, longitude);

          showToast("Current location shared successfully.", "success");
          await fetchLocationData();
        } catch (error) {
          console.error("Save location error:", error);
          showToast(error.message || "Failed to share location.", "error");
        } finally {
          setSharing(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === 1) {
          showToast("Location permission denied. Please allow location access.", "warning");
        } else if (error.code === 2) {
          showToast("Location unavailable. Please check your device/location settings.", "warning");
        } else if (error.code === 3) {
          showToast("Location request timed out. Please try again.", "warning");
        } else {
          showToast("Failed to get current location.", "error");
        }

        setSharing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const openMap = () => {
    if (!locationRecord) return;

    window.open(
      `https://www.google.com/maps?q=${locationRecord.latitude},${locationRecord.longitude}`,
      "_blank"
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString();
  };

  const InfoBox = ({ label, value, full = false, children }) => {
    return (
      <div
        className={`share-location-info-box ${
          full ? "share-location-info-box-full" : ""
        }`}
      >
        <p className="share-location-label">{label}</p>

        {children ? (
          children
        ) : (
          <strong className="share-location-value">{value || "-"}</strong>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="share-location-loading-card share-location-reveal">
        <DriverToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
        <h4>Loading location...</h4>
        <p>Please wait while we fetch your latest shared location.</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="share-location-empty-card share-location-reveal">
        <DriverToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />

        <div className="share-location-empty-icon">
          <IconifyIcon icon="mdi:map-marker-off-outline" />
        </div>

        <h4>No driver profile found</h4>
        <p>Please log in again to share your current location.</p>
      </div>
    );
  }

  return (
    <div className="share-location-page">
      <DriverToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <div className="share-location-hero share-location-reveal">
        <div className="share-location-hero-inner">
          <div>
            <div className="share-location-kicker">
              <span className="share-location-status-dot" />
              Driver Panel Overview
            </div>

            <h2 className="share-location-hero-title">Share Location</h2>

            <p className="share-location-hero-subtitle">
              Share your current location with admin only when needed. Your
              location is updated manually after you click the share button and
              allow browser permission.
            </p>
          </div>

          <div className="share-location-hero-glass">
            <span>Logged in as</span>
            <strong>{driver.user_name || "Driver"}</strong>
          </div>
        </div>
      </div>

      <div className="share-location-stats-grid share-location-reveal share-location-delay-1">
        <div className="share-location-stat-card share-location-stat-blue">
          <div className="share-location-stat-icon-bg" />
          <div className="share-location-stat-icon">
            <IconifyIcon icon="mdi:map-marker-radius-outline" />
          </div>

          <p className="share-location-stat-label">Location Status</p>
          <strong className="share-location-stat-value">
            {locationRecord ? "Shared" : "Not Shared"}
          </strong>
          <span className="share-location-stat-note">Latest saved location</span>
        </div>

        <div className="share-location-stat-card share-location-stat-purple">
          <div className="share-location-stat-icon-bg" />
          <div className="share-location-stat-icon">
            <IconifyIcon icon="mdi:compass-outline" />
          </div>

          <p className="share-location-stat-label">Latitude</p>
          <strong className="share-location-stat-value">
            {locationRecord?.latitude || "-"}
          </strong>
          <span className="share-location-stat-note">Current coordinate</span>
        </div>

        <div className="share-location-stat-card share-location-stat-orange">
          <div className="share-location-stat-icon-bg" />
          <div className="share-location-stat-icon">
            <IconifyIcon icon="mdi:earth" />
          </div>

          <p className="share-location-stat-label">Longitude</p>
          <strong className="share-location-stat-value">
            {locationRecord?.longitude || "-"}
          </strong>
          <span className="share-location-stat-note">Current coordinate</span>
        </div>

        <div className="share-location-stat-card share-location-stat-slate">
          <div className="share-location-stat-icon-bg" />
          <div className="share-location-stat-icon">
            <IconifyIcon icon="mdi:clock-time-four-outline" />
          </div>

          <p className="share-location-stat-label">Last Updated</p>
          <strong className="share-location-stat-value">
            {locationRecord?.updated_at ? "Available" : "Pending"}
          </strong>
          <span className="share-location-stat-note">
            {locationRecord?.updated_at
              ? formatDate(locationRecord.updated_at)
              : "No update yet"}
          </span>
        </div>
      </div>

      <div className="share-location-shell share-location-reveal share-location-delay-2">
        <div className="share-location-card share-location-action-panel">
          <div>
            <div className="share-location-action-icon">
              <IconifyIcon icon="mdi:access-point" />
            </div>

            <h4 className="share-location-section-title">
              Share Current Location
            </h4>

            <p className="share-location-section-subtitle">
              Click below and allow location access. Admin will receive your
              latest coordinates only after your permission.
            </p>

            <button
              onClick={handleShareLocation}
              disabled={sharing}
              className="share-location-primary-btn"
            >
              {sharing ? "Sharing Location..." : "Share Current Location"}
            </button>
          </div>

          <div className="share-location-note">
            The system does not track you automatically. Location is shared
            manually with your permission.
          </div>
        </div>

        <div className="share-location-side-stack">
          <div className="share-location-card">
            <div className="share-location-card-head">
              <div>
                <h4 className="share-location-section-title">
                  Last Shared Location
                </h4>
                <p className="share-location-section-subtitle">
                  View the latest location saved for your driver profile.
                </p>
              </div>
            </div>

            {locationRecord ? (
              <>
                <div className="share-location-map-preview">
                  <div className="share-location-map-pulse" />
                  <div className="share-location-map-pin">
                    <IconifyIcon icon="mdi:map-marker" />
                  </div>
                </div>

                <div className="share-location-info-grid">
                  <InfoBox label="Latitude" value={locationRecord.latitude} />
                  <InfoBox label="Longitude" value={locationRecord.longitude} />
                  <InfoBox
                    label="Last Updated"
                    value={formatDate(locationRecord.updated_at)}
                    full
                  />
                </div>

                <button
                  onClick={openMap}
                  className="share-location-secondary-btn"
                  style={{ marginTop: "16px" }}
                >
                  Open in Google Maps
                </button>
              </>
            ) : (
              <div className="share-location-empty-card">
                <div className="share-location-empty-icon">
                  <IconifyIcon icon="mdi:map-marker-off-outline" />
                </div>

                <h4>No location shared yet</h4>
                <p>
                  Share your current location once, and the latest coordinates
                  will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareLocation;