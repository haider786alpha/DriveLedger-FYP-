// import { lazy, Suspense } from 'react';
// import FallbackLoading from '@/components/FallbackLoading';
// import LogoBox from '@/components/LogoBox';
// import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
// import { getMenuItems } from '@/helpers/menu';
// import HoverMenuToggle from './components/HoverMenuToggle';
// const AppMenu = lazy(() => import('./components/AppMenu'));
// const VerticalNavigationBar = () => {
//   const menuItems = getMenuItems();
//   return <div className="main-nav" id="leftside-menu-container">
//       <LogoBox containerClassName="logo-box" squareLogo={{
//       className: 'logo-sm'
//     }} textLogo={{
//       className: 'logo-lg'
//     }} />

//       <HoverMenuToggle />

//       <SimplebarReactClient className="scrollbar">
//         <Suspense fallback={<FallbackLoading />}>
//           <AppMenu menuItems={menuItems} />
//         </Suspense>
//       </SimplebarReactClient>
//     </div>;
// };
// export default VerticalNavigationBar;

import { lazy, Suspense } from 'react';
import FallbackLoading from '@/components/FallbackLoading';
import LogoBox from '@/components/LogoBox';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { getMenuItems } from '@/helpers/menu';

const AppMenu = lazy(() => import('./components/AppMenu'));

const VerticalNavigationBar = () => {
  const menuItems = getMenuItems();

  return (
    <div
      className="main-nav"
      id="leftside-menu-container"
      style={{
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        boxShadow: '4px 0 20px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div
        style={{
          padding: '14px 14px 12px 14px',
          background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
          borderBottom: '1px solid #eef2f7',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '12px 14px',
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
            width: '100%',
          }}
        >
          <LogoBox
            containerClassName="logo-box"
            squareLogo={{
              className: 'logo-sm',
            }}
            textLogo={{
              className: 'logo-lg',
            }}
          />
        </div>

        {/* <div
          style={{
            marginTop: '10px',
            paddingLeft: '6px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#94a3b8',
            }}
          >
            Driver Panel
          </span>
        </div> */}
      </div>

      <SimplebarReactClient
        className="scrollbar"
        style={{
          padding: '12px 10px 16px 10px',
        }}
      >
        <Suspense fallback={<FallbackLoading />}>
          <AppMenu menuItems={menuItems} />
        </Suspense>
      </SimplebarReactClient>
    </div>
  );
};

export default VerticalNavigationBar;