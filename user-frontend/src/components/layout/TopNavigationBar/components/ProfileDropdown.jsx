import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import avatar1 from "@/assets/images/users/avatar-1.jpg";
import { useAuthContext } from "@/context/useAuthContext";

const ProfileDropdown = () => {
  const { user, removeSession } = useAuthContext();

  const username =
    user?.username || user?.name || user?.full_name || "Driver";

  const userEmail = user?.email || "driver@driveledger.com";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");
    removeSession();
  };

  return (
    <Dropdown className="topbar-item driver-profile-dropdown" align="end">
      <DropdownToggle
        as="button"
        type="button"
        className="topbar-button content-none driver-profile-toggle"
        id="page-header-user-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="driver-profile-avatar-wrap">
          <img
            className="driver-profile-avatar"
            width={36}
            height={36}
            src={avatar1}
            alt="driver avatar"
          />

          <span className="driver-profile-online-dot" />
        </span>
      </DropdownToggle>

      <DropdownMenu className="driver-profile-menu">
        <DropdownHeader as="div" className="driver-profile-menu-header">
          <div className="driver-profile-menu-avatar">
            <img src={avatar1} alt="driver avatar" />
          </div>

          <div>
            <h6>Welcome, {username}</h6>
            <p>{userEmail}</p>
          </div>
        </DropdownHeader>

        <DropdownItem as={Link} to="/profile" className="driver-profile-menu-item">
          <span className="driver-profile-menu-icon">
            <IconifyIcon icon="mdi:account-circle-outline" />
          </span>
          <span>My Profile</span>
        </DropdownItem>

        <DropdownItem as={Link} to="/alerts" className="driver-profile-menu-item">
          <span className="driver-profile-menu-icon">
            <IconifyIcon icon="mdi:bell-outline" />
          </span>
          <span>Alerts</span>
        </DropdownItem>

        <DropdownDivider className="driver-profile-divider" />

        <DropdownItem
          as="button"
          className="driver-profile-menu-item driver-profile-logout"
          onClick={handleLogout}
        >
          <span className="driver-profile-menu-icon">
            <IconifyIcon icon="mdi:logout" />
          </span>
          <span>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;