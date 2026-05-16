import { useEffect, useRef } from 'react';
import { useLayoutContext } from '@/context/useLayoutContext';
import { useLocation } from 'react-router-dom';

const LeftSideBarToggle = () => {
  const {
    menu: { size },
    changeMenu: { size: changeMenuSize },
    toggleBackdrop,
    closeBackdrop,
  } = useLayoutContext();

  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  const isMobileScreen = () => window.innerWidth <= 991;

  const handleMenuSize = () => {
    if (isMobileScreen()) {
      toggleBackdrop();
      return;
    }

    if (size === 'hidden') {
      toggleBackdrop();
      return;
    }

    if (size === 'condensed') {
      changeMenuSize('default');
    } else {
      changeMenuSize('condensed');
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isMobileScreen()) {
      closeBackdrop();
    }
  }, [pathname, closeBackdrop]);

  return (
    <div className="topbar-item">
      <button
        onClick={handleMenuSize}
        type="button"
        className="button-toggle-menu driver-mobile-toggle"
        aria-label="Toggle sidebar"
      >
        <span className="driver-hamburger-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  );
};

export default LeftSideBarToggle;