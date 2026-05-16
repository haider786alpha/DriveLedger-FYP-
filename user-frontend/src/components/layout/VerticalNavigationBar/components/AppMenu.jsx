import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { findAllParent, findMenuItem, getMenuItemFromURL } from '@/helpers/menu';
import { getLoggedInDriver } from '@/helpers/getLoggedInDriver';
import { API_URL } from '@/helpers/apiConfig';
import { useLayoutContext } from '@/context/useLayoutContext';

const menuTitleStyle = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#94a3b8',
  margin: '18px 0 10px 0',
  padding: '0 14px',
};

const getMenuLinkStyle = (active, isChild = false) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: isChild ? '10px 14px' : '12px 14px',
  borderRadius: '14px',
  marginBottom: '8px',
  background: active
    ? 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)'
    : 'transparent',
  border: active ? '1px solid #dbeafe' : '1px solid transparent',
  boxShadow: active ? '0 8px 20px rgba(37, 99, 235, 0.10)' : 'none',
  color: active ? '#1d4ed8' : '#475569',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  minHeight: isChild ? '44px' : '48px',
});

const getIconWrapStyle = (active, isChild = false) => ({
  width: isChild ? '30px' : '34px',
  height: isChild ? '30px' : '34px',
  minWidth: isChild ? '30px' : '34px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: active ? '#dbeafe' : '#f8fafc',
  color: active ? '#2563eb' : '#64748b',
  border: active ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
  fontSize: isChild ? '15px' : '17px',
});

const getTextStyle = (active, isChild = false) => ({
  fontSize: isChild ? '14px' : '14.5px',
  fontWeight: active ? '700' : '600',
  color: active ? '#1d4ed8' : '#334155',
  flex: 1,
  minWidth: 0,
  wordBreak: 'break-word',
});

const getArrowStyle = (open, active) => ({
  fontSize: '18px',
  color: active ? '#2563eb' : '#94a3b8',
  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s ease',
  flexShrink: 0,
});

const getSubMenuWrapStyle = () => ({
  paddingLeft: '14px',
  marginTop: '2px',
  marginBottom: '6px',
  borderLeft: '1px dashed #dbeafe',
  marginLeft: '16px',
});

const UnreadBadge = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <span
      style={{
        minWidth: '22px',
        height: '22px',
        padding: '0 7px',
        borderRadius: '999px',
        background: '#ef4444',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: '700',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.28)',
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

const MenuItemWithChildren = ({
  item,
  className,
  linkClassName,
  subMenuClassName,
  activeMenuItems,
  toggleMenu,
  onMenuLinkClick,
}) => {
  const [open, setOpen] = useState(activeMenuItems.includes(item.key));

  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = (e) => {
    e.preventDefault();

    const status = !open;
    setOpen(status);

    if (toggleMenu) {
      toggleMenu(item, status);
    }

    return false;
  };

  const getActiveClass = useCallback(
    (menuItem) => {
      return activeMenuItems?.includes(menuItem.key) ? 'active' : '';
    },
    [activeMenuItems]
  );

  const isActive = activeMenuItems?.includes(item.key);

  return (
    <li className={className} style={{ listStyle: 'none' }}>
      <div
        onClick={toggleMenuItem}
        aria-expanded={open}
        role="button"
        className={clsx(linkClassName)}
        style={getMenuLinkStyle(isActive)}
      >
        {item.icon && (
          <span className="nav-icon" style={getIconWrapStyle(isActive)}>
            <IconifyIcon icon={item.icon} />
          </span>
        )}

        <span className="nav-text" style={getTextStyle(isActive)}>
          {item.label}
        </span>

        {!item.badge ? (
          <IconifyIcon
            icon="bx:chevron-down"
            className="menu-arrow"
            style={getArrowStyle(open, isActive)}
          />
        ) : (
          <span
            className={`badge badge-pill text-end bg-${item.badge.variant}`}
            style={{
              borderRadius: '999px',
              fontSize: '11px',
              padding: '6px 10px',
              flexShrink: 0,
            }}
          >
            {item.badge.text}
          </span>
        )}
      </div>

      <Collapse in={open}>
        <div style={getSubMenuWrapStyle()}>
          <ul className={clsx(subMenuClassName)} style={{ paddingLeft: 0, marginBottom: 0 }}>
            {(item.children || []).map((child, idx) => (
              <Fragment key={child.key + idx}>
                {child.children ? (
                  <MenuItemWithChildren
                    item={child}
                    linkClassName={clsx('nav-link', getActiveClass(child))}
                    activeMenuItems={activeMenuItems}
                    className="sub-nav-item"
                    subMenuClassName="nav sub-navbar-nav"
                    toggleMenu={toggleMenu}
                    onMenuLinkClick={onMenuLinkClick}
                  />
                ) : (
                  <MenuItem
                    item={child}
                    className="sub-nav-item"
                    linkClassName={clsx('sub-nav-link', getActiveClass(child))}
                    isChild
                    onMenuLinkClick={onMenuLinkClick}
                  />
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      </Collapse>
    </li>
  );
};

const MenuItem = ({
  item,
  className,
  linkClassName,
  isChild = false,
  unreadAlerts = 0,
  onMenuLinkClick,
}) => {
  return (
    <li className={className} style={{ listStyle: 'none' }}>
      <MenuItemLink
        item={item}
        className={linkClassName}
        isChild={isChild}
        unreadAlerts={unreadAlerts}
        onMenuLinkClick={onMenuLinkClick}
      />
    </li>
  );
};

const MenuItemLink = ({
  item,
  className,
  isChild = false,
  unreadAlerts = 0,
  onMenuLinkClick,
}) => {
  const isActive = className?.includes('active');

  return (
    <Link
      to={item.url ?? ''}
      target={item.target}
      onClick={onMenuLinkClick}
      className={clsx(className, {
        disabled: item.isDisabled,
      })}
      style={{
        ...getMenuLinkStyle(isActive, isChild),
        opacity: item.isDisabled ? 0.6 : 1,
        pointerEvents: item.isDisabled ? 'none' : 'auto',
      }}
    >
      {item.icon && (
        <span className="nav-icon" style={getIconWrapStyle(isActive, isChild)}>
          <IconifyIcon icon={item.icon} />
        </span>
      )}

      <span className="nav-text" style={getTextStyle(isActive, isChild)}>
        {item.label}
      </span>

      {item.key === 'alerts' && unreadAlerts > 0 ? (
        <UnreadBadge count={unreadAlerts} />
      ) : item.badge ? (
        <span
          className={`badge badge-pill text-end bg-${item.badge.variant}`}
          style={{
            borderRadius: '999px',
            fontSize: '11px',
            padding: '6px 10px',
            flexShrink: 0,
          }}
        >
          {item.badge.text}
        </span>
      ) : null}
    </Link>
  );
};

const AppMenu = ({ menuItems }) => {
  const { pathname } = useLocation();
  const { closeBackdrop } = useLayoutContext();

  const [activeMenuItems, setActiveMenuItems] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  const handleMenuLinkClick = () => {
    if (window.innerWidth <= 991) {
      closeBackdrop();
    }
  };

  const fetchUnreadAlerts = useCallback(async () => {
    try {
      const loggedInDriver = await getLoggedInDriver();

      if (!loggedInDriver) {
        setUnreadAlerts(0);
        return;
      }

      const res = await fetch(API_URL(`/api/notifications/?driver_id=${loggedInDriver.id}`));
      const data = await res.json();

      const filteredAlerts = (Array.isArray(data) ? data : []).filter(
        (item) =>
          item.recipient_type === 'all' ||
          (item.recipient_type === 'driver' &&
            Number(item.driver) === Number(loggedInDriver.id))
      );

      const unreadCount = filteredAlerts.filter((item) => !item.is_read).length;
      setUnreadAlerts(unreadCount);
    } catch (error) {
      console.error('Sidebar unread alerts error:', error);
      setUnreadAlerts(0);
    }
  }, []);

  useEffect(() => {
    fetchUnreadAlerts();

    const interval = setInterval(fetchUnreadAlerts, 5000);
    const handleFocus = () => fetchUnreadAlerts();
    const handleNotificationsUpdated = () => fetchUnreadAlerts();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('notifications-updated', handleNotificationsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('notifications-updated', handleNotificationsUpdated);
    };
  }, [fetchUnreadAlerts]);

  const toggleMenu = (menuItem, show) => {
    if (show) {
      setActiveMenuItems([menuItem.key, ...findAllParent(menuItems, menuItem)]);
    }
  };

  const getActiveClass = useCallback(
    (item) => {
      return activeMenuItems?.includes(item.key) ? 'active' : '';
    },
    [activeMenuItems]
  );

  const activeMenu = useCallback(() => {
    const trimmedURL = pathname?.replaceAll('', '');
    const matchingMenuItem = getMenuItemFromURL(menuItems, trimmedURL);

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;

      if (t < 1) {
        return (c / 2) * t * t + b;
      }

      t--;

      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const scrollTo = (element, to, duration) => {
      const start = element.scrollTop;
      const change = to - start;
      const increment = 20;
      let currentTime = 0;

      const animateScroll = function () {
        currentTime += increment;

        const val = easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;

        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        }
      };

      animateScroll();
    };

    if (matchingMenuItem) {
      const activeMt = findMenuItem(menuItems, matchingMenuItem.key);

      if (activeMt) {
        setActiveMenuItems([activeMt.key, ...findAllParent(menuItems, activeMt)]);
      }

      setTimeout(() => {
        const activatedItem = document.querySelector(
          `#leftside-menu-container .simplebar-content a[href="${trimmedURL}"]`
        );

        if (activatedItem) {
          const simplebarContent = document.querySelector(
            '#leftside-menu-container .simplebar-content-wrapper'
          );

          if (simplebarContent) {
            const offset = activatedItem.offsetTop - window.innerHeight * 0.4;
            scrollTo(simplebarContent, offset, 600);
          }
        }
      }, 400);
    }
  }, [pathname, menuItems]);

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      activeMenu();
    }
  }, [activeMenu, menuItems]);

  return (
    <ul className="navbar-nav" style={{ paddingTop: '6px' }}>
      {(menuItems || []).map((item, idx) => {
        return (
          <Fragment key={item.key + idx}>
            {item.isTitle ? (
              <li className="menu-title" style={menuTitleStyle}>
                {item.label}
              </li>
            ) : (
              <>
                {item.children ? (
                  <MenuItemWithChildren
                    item={item}
                    toggleMenu={toggleMenu}
                    className="nav-item"
                    linkClassName={clsx('nav-link', getActiveClass(item))}
                    subMenuClassName="nav sub-navbar-nav"
                    activeMenuItems={activeMenuItems}
                    onMenuLinkClick={handleMenuLinkClick}
                  />
                ) : (
                  <MenuItem
                    item={item}
                    linkClassName={clsx('nav-link', getActiveClass(item))}
                    className="nav-item"
                    unreadAlerts={item.key === 'alerts' ? unreadAlerts : 0}
                    onMenuLinkClick={handleMenuLinkClick}
                  />
                )}
              </>
            )}
          </Fragment>
        );
      })}
    </ul>
  );
};

export default AppMenu;