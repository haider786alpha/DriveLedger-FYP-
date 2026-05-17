import { Link } from "react-router-dom";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./Home.css";

const ADMIN_FRONTEND_URL = "https://driveledger-admin.vercel.app/";

const HomePage = () => {
  const openAdminPortal = () => {
    if (!ADMIN_FRONTEND_URL || ADMIN_FRONTEND_URL.includes("PASTE_")) {
      alert("Please add your admin frontend URL in src/app/home/page.jsx");
      return;
    }

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
              Smart Fleet Operations
            </div>

            <h1>
              DriveEase fleet management powered by <span>DriveLedger</span>
            </h1>

            <p>
              A modern digital ledger system for managing drivers, assigned
              cars, payments, repairs, locations, alerts, and support operations
              in one professional platform.
            </p>

            <div className="driveease-hero-actions">
              <Link to="/auth/sign-in" className="driveease-primary-btn">
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
                <strong>Fleet</strong>
                <span>Vehicle Records</span>
              </div>

              <div>
                <strong>Ledger</strong>
                <span>Payments & Dues</span>
              </div>

              <div>
                <strong>Support</strong>
                <span>Alerts & Repairs</span>
              </div>
            </div>
          </div>

          <div className="driveease-hero-panel">
            <div className="driveease-panel-header">
              <div>
                <span>DriveLedger System</span>
                <h4>Operations Overview</h4>
              </div>

              <div className="driveease-panel-icon">
                <IconifyIcon icon="mdi:view-dashboard-outline" />
              </div>
            </div>

            <div className="driveease-panel-list">
              <FeatureRow
                icon="mdi:car-outline"
                title="Vehicle Assignments"
                text="Track assigned cars and driver records."
              />

              <FeatureRow
                icon="mdi:cash-multiple"
                title="Payment Ledger"
                text="Manage paid history and pending dues."
              />

              <FeatureRow
                icon="mdi:map-marker-radius-outline"
                title="Driver Location"
                text="Allow drivers to share live coordinates manually."
              />

              <FeatureRow
                icon="mdi:car-wrench"
                title="Repair Status"
                text="Monitor repair records, bills, and priorities."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="driveease-features">
        <div className="driveease-section-head">
          <span>System Modules</span>
          <h2>Everything DriveEase needs for daily fleet operations</h2>
          <p>
            DriveLedger connects admin control with driver self-service through
            clean, secure, and role-based dashboards.
          </p>
        </div>

        <div className="driveease-feature-grid">
          <FeatureCard
            icon="mdi:account-group-outline"
            title="Driver Management"
            text="Maintain driver profiles, documents, and work details."
          />

          <FeatureCard
            icon="mdi:file-document-check-outline"
            title="Assignment Tracking"
            text="View active vehicle assignments and related records."
          />

          <FeatureCard
            icon="mdi:credit-card-check-outline"
            title="Payment Records"
            text="Track paid history, pending dues, and ledger summaries."
          />

          <FeatureCard
            icon="mdi:bell-badge-outline"
            title="Alerts & Support"
            text="Send alerts, receive support requests, and manage replies."
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