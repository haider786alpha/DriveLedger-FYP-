import { Link } from "react-router-dom";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./Home.css";

const ADMIN_FRONTEND_URL = "https://driveledger-admin.vercel.app/";

const HomePage = () => {
  const openAdminPortal = () => {
    window.open(ADMIN_FRONTEND_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="driveease-home">
      <section className="driveease-hero">
        <div className="driveease-hero-bg driveease-hero-bg-one" />
        <div className="driveease-hero-bg driveease-hero-bg-two" />

        <div className="driveease-hero-grid">
          <div className="driveease-hero-content">
            <div className="driveease-kicker">
              <span />
              Smart City-to-City Fleet Booking
            </div>

            <h1>
              Book reliable intercity rides with <span>DriveEase</span>
            </h1>

            <p>
              Request a city-to-city car, select your route and vehicle type,
              view an instant estimated fare, and let the DriveEase team confirm
              your booking professionally.
            </p>

            <div className="driveease-hero-actions">
              <Link to="/booking" className="driveease-primary-btn">
                <IconifyIcon icon="mdi:map-marker-path" />
                Book City-to-City Ride
              </Link>

              <Link to="/auth/sign-in" className="driveease-secondary-btn">
                <IconifyIcon icon="mdi:account-key-outline" />
                Driver Portal
              </Link>

              <button
                type="button"
                onClick={openAdminPortal}
                className="driveease-secondary-btn"
              >
                <IconifyIcon icon="mdi:shield-account-outline" />
                Admin Portal
              </button>
            </div>

            <div className="driveease-trust-row">
              <div>
                <strong>Booking</strong>
                <span>City-to-City Rides</span>
              </div>

              <div>
                <strong>Estimate</strong>
                <span>Instant Fare Preview</span>
              </div>

              <div>
                <strong>Ledger</strong>
                <span>Powered by DriveLedger</span>
              </div>
            </div>
          </div>

          <div className="driveease-hero-panel">
            <div className="driveease-panel-header">
              <div>
                <span>DriveEase Booking</span>
                <h4>Trip Request Flow</h4>
              </div>

              <div className="driveease-panel-icon">
                <IconifyIcon icon="mdi:car-clock" />
              </div>
            </div>

            <div className="driveease-panel-list">
              <FeatureRow
                icon="mdi:map-marker-path"
                title="Choose Your Route"
                text="Select from city and destination city for your intercity trip."
              />

              <FeatureRow
                icon="mdi:car-estate"
                title="Select Vehicle Type"
                text="Choose Economy, Comfort, Family, or Premium car preference."
              />

              <FeatureRow
                icon="mdi:calculator-variant-outline"
                title="Instant Fare Estimate"
                text="Get estimated trip cost based on route, vehicle, luggage, and time."
              />

              <FeatureRow
                icon="mdi:phone-check-outline"
                title="Team Confirmation"
                text="DriveEase team contacts the client to confirm availability and final fare."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="driveease-features">
        <div className="driveease-section-head">
          <span>System Modules</span>
          <h2>DriveEase public booking powered by DriveLedger operations</h2>
          <p>
            Customers can request intercity rides while drivers and admins manage
            operational records through the DriveLedger system.
          </p>
        </div>

        <div className="driveease-feature-grid">
          <FeatureCard
            icon="mdi:map-marker-distance"
            title="City-to-City Booking"
            text="Clients can request intercity rides without creating an account."
          />

          <FeatureCard
            icon="mdi:calculator-variant-outline"
            title="Fare Estimation"
            text="Estimated cost updates instantly based on selected booking options."
          />

          <FeatureCard
            icon="mdi:account-tie-outline"
            title="Driver Operations"
            text="Drivers access assigned cars, payments, alerts, repairs, and support."
          />

          <FeatureCard
            icon="mdi:shield-account-outline"
            title="Admin Control"
            text="Admin manages fleet records, assignments, payments, and operational data."
          />
        </div>
      </section>

      <footer className="driveease-footer">
        <p>© DriveEase | DriveLedger Fleet Management System</p>
      </footer>
    </main>
  );
};

const FeatureRow = ({ icon, title, text }) => (
  <div className="driveease-feature-row">
    <div>
      <IconifyIcon icon={icon} />
    </div>

    <span>
      <strong>{title}</strong>
      <small>{text}</small>
    </span>
  </div>
);

const FeatureCard = ({ icon, title, text }) => (
  <div className="driveease-feature-card">
    <div className="driveease-feature-card-icon">
      <IconifyIcon icon={icon} />
    </div>

    <h4>{title}</h4>
    <p>{text}</p>
  </div>
);

export default HomePage;