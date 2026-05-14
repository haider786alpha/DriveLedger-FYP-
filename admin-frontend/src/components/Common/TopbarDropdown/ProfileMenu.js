import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    try {
      const authUser = localStorage.getItem("authUser");
      const user = localStorage.getItem("user");

      return authUser
        ? JSON.parse(authUser)
        : user
        ? JSON.parse(user)
        : null;
    } catch (error) {
      return null;
    }
  }, []);

  const userName =
    storedUser?.username ||
    storedUser?.name ||
    storedUser?.full_name ||
    "Admin";

  const userEmail = storedUser?.email || "DriveLedger Admin";

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="d-inline-block"
    >
      <DropdownToggle
        className="btn header-item d-flex align-items-center"
        tag="button"
        style={{
          gap: "10px",
          border: "none",
          background: "transparent",
          boxShadow: "none",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "14px",
            boxShadow: "0 8px 20px rgba(20,184,166,0.25)",
            border: "2px solid rgba(20,184,166,0.18)",
          }}
        >
          {initials || "A"}
        </div>

        <div className="d-none d-xl-block text-start">
          <span
            className="d-block"
            style={{
              fontSize: "15px",
              fontWeight: "800",
              color: "#64748b",
              lineHeight: "1.1",
            }}
          >
            {userName}
          </span>
        </div>

        <i
          className="mdi mdi-chevron-down d-none d-xl-block"
          style={{ color: "#94a3b8" }}
        />
      </DropdownToggle>

      <DropdownMenu
        className="dropdown-menu-end p-0"
        style={{
          minWidth: "240px",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 22px 45px rgba(15, 23, 42, 0.14)",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
            background:
              "linear-gradient(135deg, rgba(20,184,166,0.1), rgba(15,118,110,0.04))",
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: "12px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "16px",
                boxShadow: "0 10px 22px rgba(20,184,166,0.22)",
              }}
            >
              {initials || "A"}
            </div>

            <div style={{ minWidth: 0 }}>
              <h6
                className="mb-1"
                style={{
                  fontWeight: "900",
                  color: "#0f172a",
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userName}
              </h6>

              <p
                className="mb-0"
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="py-2">
          <DropdownItem onClick={() => navigate("/dashboard")}>
            <i className="ri-dashboard-line me-2"></i>
            Dashboard
          </DropdownItem>

          <DropdownItem onClick={() => navigate("/users")}>
            <i className="ri-user-settings-line me-2"></i>
            User Management
          </DropdownItem>

          <DropdownItem divider />

          <DropdownItem onClick={handleLogout}>
            <i className="ri-logout-circle-r-line me-2 text-danger"></i>
            Logout
          </DropdownItem>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileMenu;