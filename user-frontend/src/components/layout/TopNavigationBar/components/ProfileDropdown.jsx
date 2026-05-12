import { Link } from 'react-router-dom';
import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import avatar1 from '@/assets/images/users/avatar-1.jpg';
import { useAuthContext } from '@/context/useAuthContext';

const ProfileDropdown = () => {
  const { user, removeSession } = useAuthContext();

  const username = user?.username || 'Driver';

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('authUser');
    removeSession();
  };

  return (
    <Dropdown className="topbar-item" align="end">
      <DropdownToggle
        as="button"
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="d-flex align-items-center">
          <img
            className="rounded-circle"
            width={32}
            height={32}
            src={avatar1}
            alt="driver avatar"
          />
        </span>
      </DropdownToggle>

      <DropdownMenu>
        <DropdownHeader as="h6">Welcome {username}!</DropdownHeader>

        <DropdownItem as={Link} to="/profile">
          <IconifyIcon
            icon="bx:user-circle"
            className="text-muted fs-18 align-middle me-1"
          />
          <span className="align-middle">My Profile</span>
        </DropdownItem>

        <DropdownItem as={Link} to="/alerts">
          <IconifyIcon
            icon="bx:bell"
            className="text-muted fs-18 align-middle me-1"
          />
          <span className="align-middle">Alerts</span>
        </DropdownItem>

        <DropdownDivider className="dropdown-divider my-1" />

        <DropdownItem as="button" className="text-danger" onClick={handleLogout}>
          <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;