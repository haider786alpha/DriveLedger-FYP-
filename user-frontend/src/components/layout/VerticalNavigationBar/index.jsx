import { lazy, Suspense } from "react";
import FallbackLoading from "@/components/FallbackLoading";
import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";
import { getMenuItems } from "@/helpers/menu";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./DriverSidebarBrand.css";

const AppMenu = lazy(() => import("./components/AppMenu"));

const VerticalNavigationBar = () => {
  const menuItems = getMenuItems();

  return (
    <div className="main-nav driver-sidebar" id="leftside-menu-container">
      <div className="driver-sidebar-brand-wrap">
        <div className="driver-sidebar-brand-card">
          <div className="driver-brand-glow" />

          <div className="driver-custom-brand">
            <div className="driver-custom-brand-mark">
              <IconifyIcon icon="mdi:routes" />
            </div>

            <div className="driver-custom-brand-text">
              <h3>DriveLedger</h3>
              <p>Driver Portal</p>
            </div>
          </div>

          <div className="driver-brand-badge">
            <span />
            Driver Panel
          </div>
        </div>
      </div>

      <SimplebarReactClient className="scrollbar driver-sidebar-scroll">
        <Suspense fallback={<FallbackLoading />}>
          <AppMenu menuItems={menuItems} />
        </Suspense>
      </SimplebarReactClient>
    </div>
  );
};

export default VerticalNavigationBar;