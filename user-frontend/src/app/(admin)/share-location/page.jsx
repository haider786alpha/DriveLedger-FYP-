import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import {
  pageHeroStyle,
  pageTitleStyle,
  pageSubtitleStyle,
  loggedInPillStyle,
  contentCardStyle,
  innerInfoCardStyle,
  sectionTitleStyle,
  sectionSubtitleStyle,
  emptyStateStyle,
  primaryButtonStyle,
  infoLabelStyle,
} from "@/helpers/panelStyles";

const ShareLocation = () => {
  const [driver, setDriver] = useState(null);
  const [locationRecord, setLocationRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (latitude, longitude) => {
    if (!driver) {
      alert("Driver profile not found.");
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
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setSharing(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          await saveLocation(latitude, longitude);

          alert("Current location shared successfully.");
          await fetchLocationData();
        } catch (error) {
          console.error("Save location error:", error);
          alert(error.message || "Failed to share location.");
        } finally {
          setSharing(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === 1) {
          alert("Location permission denied. Please allow location access.");
        } else if (error.code === 2) {
          alert("Location unavailable. Please check your device/location settings.");
        } else if (error.code === 3) {
          alert("Location request timed out. Please try again.");
        } else {
          alert("Failed to get current location.");
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

  if (loading) {
    return <div>Loading location...</div>;
  }

  if (!driver) {
    return <div style={emptyStateStyle}>No driver profile found.</div>;
  }

  return (
    <div>
      <div style={pageHeroStyle}>
        <h2 style={pageTitleStyle}>Share Location</h2>
        <p style={pageSubtitleStyle}>
          Share your current location with admin when needed. Your location is only updated when you click the share button and allow browser permission.
        </p>

        <div style={loggedInPillStyle}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />
          Logged in as: {driver.user_name}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={contentCardStyle}>
          <h4 style={sectionTitleStyle}>Share Current Location</h4>
          <p style={sectionSubtitleStyle}>
            Click the button below and allow location access. Admin will see your latest shared location.
          </p>

          <button
            onClick={handleShareLocation}
            disabled={sharing}
            style={{
              ...primaryButtonStyle,
              width: "100%",
              marginTop: "18px",
              opacity: sharing ? 0.7 : 1,
            }}
          >
            {sharing ? "Sharing Location..." : "Share Current Location"}
          </button>

          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              borderRadius: "14px",
              background: "#eff6ff",
              border: "1px solid #dbeafe",
              color: "#1e3a8a",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            The system does not track you automatically. Location is shared manually with your permission.
          </div>
        </div>

        <div style={contentCardStyle}>
          <h4 style={sectionTitleStyle}>Last Shared Location</h4>
          <p style={sectionSubtitleStyle}>
            View the latest location saved for your driver profile.
          </p>

          {locationRecord ? (
            <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Latitude</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a" }}>
                  {locationRecord.latitude}
                </strong>
              </div>

              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Longitude</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a" }}>
                  {locationRecord.longitude}
                </strong>
              </div>

              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Last Updated</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a" }}>
                  {locationRecord.updated_at
                    ? new Date(locationRecord.updated_at).toLocaleString()
                    : "-"}
                </strong>
              </div>

              <button
                onClick={openMap}
                style={{
                  ...primaryButtonStyle,
                  width: "100%",
                  background: "#16a34a",
                }}
              >
                Open in Google Maps
              </button>
            </div>
          ) : (
            <div style={{ ...emptyStateStyle, marginTop: "18px" }}>
              No location shared yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareLocation;