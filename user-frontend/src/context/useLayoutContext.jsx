import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import useQueryParams from '@/hooks/useQueryParams';
import { toggleDocumentAttribute } from '@/utils/layout';

const ThemeContext = createContext(undefined);

const useLayoutContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useLayoutContext can only be used within LayoutProvider');
  }

  return context;
};

const getPreferredTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const LayoutProvider = ({ children }) => {
  const queryParams = useQueryParams();

  const override = !!(
    queryParams.layout_theme ||
    queryParams.topbar_theme ||
    queryParams.menu_theme ||
    queryParams.menu_size
  );

  const INIT_STATE = {
    theme: queryParams['layout_theme'] ? queryParams['layout_theme'] : getPreferredTheme(),
    topbarTheme: queryParams['topbar_theme'] ? queryParams['topbar_theme'] : 'light',
    menu: {
      theme: queryParams['menu_theme'] ? queryParams['menu_theme'] : 'light',
      size: queryParams['menu_size'] ? queryParams['menu_size'] : 'sm-hover-active',
    },
  };

  const [settings, setSettings] = useLocalStorage('__DRIVELEDGER_CONFIG__', INIT_STATE, override);

  const [offcanvasStates, setOffcanvasStates] = useState({
    showThemeCustomizer: false,
    showActivityStream: false,
    showBackdrop: false,
  });

  const updateSettings = (_newSettings) =>
    setSettings({
      ...settings,
      ..._newSettings,
    });

  const changeTheme = (newTheme) => {
    updateSettings({
      theme: newTheme,
    });
  };

  const changeTopbarTheme = (newTheme) => {
    updateSettings({
      topbarTheme: newTheme,
    });
  };

  const changeMenuTheme = (newTheme) => {
    updateSettings({
      menu: {
        ...settings.menu,
        theme: newTheme,
      },
    });
  };

  const changeMenuSize = (newSize) => {
    updateSettings({
      menu: {
        ...settings.menu,
        size: newSize,
      },
    });
  };

  const toggleThemeCustomizer = () => {
    setOffcanvasStates((prev) => ({
      ...prev,
      showThemeCustomizer: !prev.showThemeCustomizer,
    }));
  };

  const toggleActivityStream = () => {
    setOffcanvasStates((prev) => ({
      ...prev,
      showActivityStream: !prev.showActivityStream,
    }));
  };

  const toggleBackdrop = useCallback(() => {
    const htmlTag = document.getElementsByTagName('html')[0];

    setOffcanvasStates((prev) => {
      const nextBackdropState = !prev.showBackdrop;

      if (nextBackdropState) {
        htmlTag.classList.add('sidebar-enable');
      } else {
        htmlTag.classList.remove('sidebar-enable');
      }

      return {
        ...prev,
        showBackdrop: nextBackdropState,
      };
    });
  }, []);

  const closeBackdrop = useCallback(() => {
    const htmlTag = document.getElementsByTagName('html')[0];

    htmlTag.classList.remove('sidebar-enable');

    setOffcanvasStates((prev) => ({
      ...prev,
      showBackdrop: false,
    }));
  }, []);

  useEffect(() => {
    toggleDocumentAttribute('data-bs-theme', settings.theme);
    toggleDocumentAttribute('data-topbar-color', settings.topbarTheme);
    toggleDocumentAttribute('data-menu-color', settings.menu.theme);
    toggleDocumentAttribute('data-menu-size', settings.menu.size);

    return () => {
      toggleDocumentAttribute('data-bs-theme', settings.theme, true);
      toggleDocumentAttribute('data-topbar-color', settings.topbarTheme, true);
      toggleDocumentAttribute('data-menu-color', settings.menu.theme, true);
      toggleDocumentAttribute('data-menu-size', settings.menu.size, true);
    };
  }, [settings]);

  const resetSettings = () => updateSettings(INIT_STATE);

  const themeCustomizer = {
    open: offcanvasStates.showThemeCustomizer,
    toggle: toggleThemeCustomizer,
  };

  const activityStream = {
    open: offcanvasStates.showActivityStream,
    toggle: toggleActivityStream,
  };

  return (
    <ThemeContext.Provider
      value={useMemo(
        () => ({
          ...settings,
          themeMode: settings.theme,
          changeTheme,
          changeTopbarTheme,
          changeMenu: {
            theme: changeMenuTheme,
            size: changeMenuSize,
          },
          themeCustomizer,
          activityStream,
          toggleBackdrop,
          closeBackdrop,
          resetSettings,
        }),
        [settings, offcanvasStates, toggleBackdrop, closeBackdrop]
      )}
    >
      {children}

      {offcanvasStates.showBackdrop && (
        <div className="offcanvas-backdrop fade show" onClick={closeBackdrop} />
      )}
    </ThemeContext.Provider>
  );
};

export { LayoutProvider, useLayoutContext };