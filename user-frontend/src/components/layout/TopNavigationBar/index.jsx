// import { lazy, Suspense } from 'react';
// import ActivityStreamToggle from './components/ActivityStreamToggle';
// import LeftSideBarToggle from './components/LeftSideBarToggle';
// import ProfileDropdown from './components/ProfileDropdown';
// import SearchBox from './components/SearchBox';
// import ThemeCustomizerToggle from './components/ThemeCustomizerToggle';
// import ThemeModeToggle from './components/ThemeModeToggle';

// const AppsDropdown = lazy(() => import('./components/AppsDropdown'));
// const Notifications = lazy(() => import('./components/Notifications'));

// const TopNavigationBar = () => {
//   return (
//     <header
//       className="topbar"
//       style={{
//         background: '#ffffff',
//         borderBottom: '1px solid #e5e7eb',
//         boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000,
//       }}
//     >
//       <div className="container-xxl">
//         <div
//           className="navbar-header"
//           style={{
//             minHeight: '72px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             gap: '16px',
//             padding: '0',
//             flexWrap: 'nowrap',
//           }}
//         >
//           {/* Left section */}
//           <div
//             className="d-flex align-items-center"
//             style={{
//               gap: '14px',
//               flex: 1,
//               minWidth: 0,
//             }}
//           >
//             <div
//               style={{
//                 flexShrink: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//             >
//               <LeftSideBarToggle />
//             </div>

//             <div
//               style={{
//                 width: '340px',
//                 maxWidth: '100%',
//                 minWidth: '180px',
//               }}
//             >
//               <SearchBox />
//             </div>
//           </div>

//           {/* Right section */}
//           <div
//             className="d-flex align-items-center"
//             style={{
//               gap: '8px',
//               flexShrink: 0,
//             }}
//           >
//             <ThemeModeToggle />

//             <Suspense fallback={null}>
//               <AppsDropdown />
//             </Suspense>

//             <Suspense fallback={null}>
//               <Notifications />
//             </Suspense>

//             <ThemeCustomizerToggle />

//             <ActivityStreamToggle />

//             <div
//               style={{
//                 width: '1px',
//                 height: '28px',
//                 background: '#e5e7eb',
//                 margin: '0 4px',
//               }}
//             />

//             <ProfileDropdown />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default TopNavigationBar;

import { lazy, Suspense } from 'react';
import LeftSideBarToggle from './components/LeftSideBarToggle';
import ProfileDropdown from './components/ProfileDropdown';
import SearchBox from './components/SearchBox';
import ThemeModeToggle from './components/ThemeModeToggle';

const Notifications = lazy(() => import('./components/Notifications'));

const TopNavigationBar = () => {
  return (
    <header
      className="topbar"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container-xxl">
        <div
          className="navbar-header"
          style={{
            minHeight: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '0',
            flexWrap: 'nowrap',
          }}
        >
          <div
            className="d-flex align-items-center"
            style={{
              gap: '14px',
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LeftSideBarToggle />
            </div>

            <div
              style={{
                width: '340px',
                maxWidth: '100%',
                minWidth: '180px',
              }}
            >
              <SearchBox />
            </div>
          </div>

          <div
            className="d-flex align-items-center"
            style={{
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <ThemeModeToggle />

            <Suspense fallback={null}>
              <Notifications />
            </Suspense>

            <div
              style={{
                width: '1px',
                height: '28px',
                background: '#e5e7eb',
                margin: '0 4px',
              }}
            />

            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigationBar;