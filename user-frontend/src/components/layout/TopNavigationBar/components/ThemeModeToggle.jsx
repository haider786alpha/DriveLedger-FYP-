import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useLayoutContext } from '@/context/useLayoutContext';

const ThemeModeToggle = () => {
  const { theme, changeTheme } = useLayoutContext();

  const isDark = theme === 'dark';

  const handleThemeToggle = () => {
    changeTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="topbar-item">
      <button
        type="button"
        onClick={handleThemeToggle}
        className="topbar-button driver-theme-toggle"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        <IconifyIcon
          icon={isDark ? 'solar:sun-2-bold-duotone' : 'solar:moon-bold-duotone'}
          className="driver-theme-icon"
        />
      </button>
    </div>
  );
};

export default ThemeModeToggle;