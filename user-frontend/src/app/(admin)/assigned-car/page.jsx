import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./AssignedCar.css";

const AssignedCar = () => {
  const [driver, setDriver] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedCar();
  }, []);

  const fetchAssignedCar = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setLoading(false);
        return;
      }

      const assignmentsRes = await fetch(API_URL("/api/assignments/"));
      const assignments = await assignmentsRes.json();

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(loggedInDriver.id) &&
          String(item.status).toLowerCase() === "active"
      );

      setAssignment(activeAssignment || null);

      if (!activeAssignment) {
        setLoading(false);
        return;
      }

      const carRes = await fetch(API_URL(`/api/cars/${activeAssignment.car}/`));
      const carData = await carRes.json();
      setCar(carData);
    } catch (error) {
      console.error("Assigned car error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateStatus = (dateValue, type = "document") => {
    if (!dateValue) {
      return {
        label: "Not Available",
        className: "assigned-car-badge-muted",
      };
    }

    const today = new Date();
    const targetDate = new Date(dateValue);

    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const differenceInDays = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays < 0) {
      return {
        label: type === "maintenance" ? "Maintenance Overdue" : "Expired",
        className: "assigned-car-badge-danger",
      };
    }

    if (differenceInDays <= 30) {
      return {
        label: type === "maintenance" ? "Maintenance Due Soon" : "Expiring Soon",
        className: "assigned-car-badge-warning",
      };
    }

    return {
      label: type === "maintenance" ? "Maintenance OK" : "Valid",
      className: "assigned-car-badge-success",
    };
  };

  const maintenanceStatus = getDateStatus(
    car?.next_maintenance_date,
    "maintenance"
  );

  const insuranceStatus = getDateStatus(car?.insurance_expiry, "document");

  const registrationStatus = getDateStatus(
    car?.registration_expiry,
    "document"
  );

  const InfoBox = ({ label, value, full = false, pre = false, children }) => {
    return (
      <div
        className={`assigned-car-info-box ${
          full ? "assigned-car-info-box-full" : ""
        }`}
      >
        <p className="assigned-car-label">{label}</p>

        {children ? (
          children
        ) : (
          <strong
            className={`assigned-car-value ${
              pre ? "assigned-car-value-pre" : ""
            }`}
          >
            {value || "-"}
          </strong>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="assigned-car-loading-card assigned-car-reveal">
        <h4>Loading assigned car...</h4>
        <p>Please wait while we fetch your vehicle information.</p>
      </div>
    );
  }

  return (
    <div className="assigned-car-page">
      <div className="assigned-car-hero assigned-car-reveal">
        <div className="assigned-car-hero-inner">
          <div>
            <div className="assigned-car-kicker">
              <span className="assigned-car-status-dot" />
              Driver Panel Overview
            </div>

            <h2 className="assigned-car-hero-title">Assigned Car</h2>

            <p className="assigned-car-hero-subtitle">
              View complete details of the vehicle currently assigned to your
              account, including maintenance, registration, insurance, and
              assignment status.
            </p>
          </div>

          <div className="assigned-car-hero-glass">
            <span>Current Vehicle</span>
            <strong>
              {car ? `${car.make || ""} ${car.model || ""}` : "No Car Assigned"}
            </strong>
          </div>
        </div>
      </div>

      {car ? (
        <>
          <div className="assigned-car-stats-grid assigned-car-reveal assigned-car-delay-1">
            <div className="assigned-car-stat-card assigned-car-stat-blue">
              <div className="assigned-car-stat-icon-bg" />
              <div className="assigned-car-stat-icon">
                <IconifyIcon icon="mdi:car-outline" />
              </div>

              <p className="assigned-car-stat-label">Assigned Vehicle</p>
              <strong className="assigned-car-stat-value">
                {car.make} {car.model}
              </strong>
              <span className="assigned-car-stat-note">
                Current assigned car
              </span>
            </div>

            <div className="assigned-car-stat-card assigned-car-stat-purple">
              <div className="assigned-car-stat-icon-bg" />
              <div className="assigned-car-stat-icon">
                <IconifyIcon icon="mdi:link-variant" />
              </div>

              <p className="assigned-car-stat-label">Assignment Status</p>
              <strong className="assigned-car-stat-value">
                {assignment?.status || "Active"}
              </strong>
              <span className="assigned-car-stat-note">
                Live assignment condition
              </span>
            </div>

            <div className="assigned-car-stat-card assigned-car-stat-orange">
              <div className="assigned-car-stat-icon-bg" />
              <div className="assigned-car-stat-icon">
                <IconifyIcon icon="mdi:tools" />
              </div>

              <p className="assigned-car-stat-label">Maintenance</p>
              <strong className="assigned-car-stat-value">
                {maintenanceStatus.label}
              </strong>
              <span className="assigned-car-stat-note">
                Next service status
              </span>
            </div>

            <div className="assigned-car-stat-card assigned-car-stat-red">
              <div className="assigned-car-stat-icon-bg" />
              <div className="assigned-car-stat-icon">
                <IconifyIcon icon="mdi:file-document-check-outline" />
              </div>

              <p className="assigned-car-stat-label">Documents</p>
              <strong className="assigned-car-stat-value">
                {insuranceStatus.label === "Valid" &&
                registrationStatus.label === "Valid"
                  ? "Valid"
                  : "Check Status"}
              </strong>
              <span className="assigned-car-stat-note">
                Insurance + registration
              </span>
            </div>
          </div>

          <div className="assigned-car-shell assigned-car-reveal assigned-car-delay-2">
            <div className="assigned-car-card">
              <div className="assigned-car-card-head">
                <div>
                  <h3 className="assigned-car-main-title">
                    {car.make} {car.model}
                  </h3>

                  <p className="assigned-car-section-subtitle">
                    Your current assigned vehicle profile and basic information.
                  </p>
                </div>

                <div className="assigned-car-vehicle-icon">
                  <IconifyIcon icon="mdi:car-sports" />
                </div>
              </div>

              <div className="assigned-car-info-grid">
                <InfoBox label="Make" value={car.make} />
                <InfoBox label="Model" value={car.model} />
                <InfoBox label="Year" value={car.year} />
                <InfoBox label="Mileage" value={car.mileage} />
                <InfoBox label="Current Mileage" value={car.current_mileage} />
                <InfoBox
                  label="Registration Number"
                  value={car.registration_number}
                />
                <InfoBox label="Condition" value={car.condition} />
                <InfoBox label="Notes" value={car.notes} full pre />
              </div>
            </div>

            <div className="assigned-car-side-stack">
              <div className="assigned-car-card">
                <div className="assigned-car-card-head">
                  <div>
                    <h4 className="assigned-car-section-title">
                      Maintenance Status
                    </h4>
                    <p className="assigned-car-section-subtitle">
                      Service timeline and upcoming maintenance checks.
                    </p>
                  </div>
                </div>

                <div className="assigned-car-info-grid">
                  <InfoBox
                    label="Last Service Date"
                    value={car.last_service_date}
                    full
                  />

                  <InfoBox label="Next Maintenance Date" full>
                    <strong className="assigned-car-value">
                      {car.next_maintenance_date || "-"}
                    </strong>

                    <span
                      className={`assigned-car-badge ${maintenanceStatus.className}`}
                    >
                      {maintenanceStatus.label}
                    </span>
                  </InfoBox>
                </div>
              </div>

              <div className="assigned-car-card">
                <div className="assigned-car-card-head">
                  <div>
                    <h4 className="assigned-car-section-title">
                      Document Status
                    </h4>
                    <p className="assigned-car-section-subtitle">
                      Track expiry state for vehicle documents.
                    </p>
                  </div>
                </div>

                <div className="assigned-car-info-grid">
                  <InfoBox label="Insurance Expiry" full>
                    <strong className="assigned-car-value">
                      {car.insurance_expiry || "-"}
                    </strong>

                    <span
                      className={`assigned-car-badge ${insuranceStatus.className}`}
                    >
                      {insuranceStatus.label}
                    </span>
                  </InfoBox>

                  <InfoBox label="Registration Expiry" full>
                    <strong className="assigned-car-value">
                      {car.registration_expiry || "-"}
                    </strong>

                    <span
                      className={`assigned-car-badge ${registrationStatus.className}`}
                    >
                      {registrationStatus.label}
                    </span>
                  </InfoBox>
                </div>
              </div>

              <div className="assigned-car-card">
                <div className="assigned-car-card-head">
                  <div>
                    <h4 className="assigned-car-section-title">
                      Assignment Details
                    </h4>
                    <p className="assigned-car-section-subtitle">
                      Driver-to-vehicle active assignment information.
                    </p>
                  </div>

                  <span className="assigned-car-badge assigned-car-badge-success assigned-car-status-pill">
                    {assignment?.status || "Active"}
                  </span>
                </div>

                <div className="assigned-car-info-grid">
                  <InfoBox
                    label="Driver"
                    value={driver?.user_name || "-"}
                    full
                  />
                  <InfoBox
                    label="Assigned Date"
                    value={assignment?.start_date}
                    full
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="assigned-car-empty-card assigned-car-reveal assigned-car-delay-1">
          <div className="assigned-car-empty-icon">
            <IconifyIcon icon="mdi:car-off" />
          </div>
          <h4>No active car assigned</h4>
          <p>
            Once admin assigns a vehicle to your account, it will appear here
            with full details.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedCar;