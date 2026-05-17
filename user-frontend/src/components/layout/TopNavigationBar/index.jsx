import { lazy, Suspense } from "react";
import LeftSideBarToggle from "./components/LeftSideBarToggle";
import ProfileDropdown from "./components/ProfileDropdown";
import SearchBox from "./components/SearchBox";
import ThemeModeToggle from "./components/ThemeModeToggle";

const Notifications = lazy(() => import("./components/Notifications"));

const TopNavigationBar = () => {
  return (
    <header
      className="topbar driver-premium-topbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 251, 255, 0.92) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.95)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.055)",
      }}
    >
      <div className="container-xxl">
        <div
          className="navbar-header"
          style={{
            minHeight: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "0",
            flexWrap: "nowrap",
          }}
        >
          <div
            className="driver-topbar-left d-flex align-items-center"
            style={{
              gap: "14px",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              className="driver-topbar-toggle-wrap"
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <LeftSideBarToggle />
            </div>

            <div
              className="driver-topbar-search-wrap"
              style={{
                width: "360px",
                maxWidth: "100%",
                minWidth: "180px",
              }}
            >
              <SearchBox />
            </div>
          </div>

          <div
            className="driver-topbar-actions d-flex align-items-center"
            style={{
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <ThemeModeToggle />

            <Suspense fallback={null}>
              <Notifications />
            </Suspense>

            <div
              className="driver-topbar-divider"
              style={{
                width: "1px",
                height: "30px",
                background:
                  "linear-gradient(180deg, transparent 0%, #dbe3ef 50%, transparent 100%)",
                margin: "0 4px",
              }}
            />

            <ProfileDropdown />
          </div>
        </div>
      </div>

      <style>
        {`
          .driver-premium-topbar .container-xxl {
            max-width: 100%;
          }

          .driver-premium-topbar button,
          .driver-premium-topbar .btn {
            border-radius: 14px;
          }

          .driver-premium-topbar input {
            border-radius: 16px !important;
          }

          @media (max-width: 768px) {
            .driver-premium-topbar .navbar-header {
              min-height: 68px !important;
              gap: 10px !important;
            }

            .driver-topbar-left {
              gap: 10px !important;
            }

            .driver-topbar-search-wrap {
              display: none !important;
            }

            .driver-topbar-actions {
              gap: 5px !important;
            }

            .driver-topbar-divider {
              display: none !important;
            }
          }

          @media (max-width: 420px) {
            .driver-premium-topbar .navbar-header {
              min-height: 64px !important;
            }

            .driver-topbar-actions {
              gap: 2px !important;
            }
          }
        `}
      </style>
    </header>
  );
};

export default TopNavigationBar;