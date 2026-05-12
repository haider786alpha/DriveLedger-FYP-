import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false);

  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const username = authUser?.username || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-2">
            {username}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <Link to="/dashboard" className="dropdown-item">
            <i className="ri-dashboard-line align-middle me-2" />
            Dashboard
          </Link>

          <DropdownItem divider />

          <button
            type="button"
            className="dropdown-item text-danger"
            onClick={handleLogout}
          >
            <i className="ri-shut-down-line align-middle me-2 text-danger" />
            Logout
          </button>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileMenu;