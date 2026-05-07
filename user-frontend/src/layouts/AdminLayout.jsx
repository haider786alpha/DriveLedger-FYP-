// import { lazy, Suspense } from 'react';
// import FallbackLoading from '@/components/FallbackLoading';
// import Footer from '@/components/layout/Footer';
// import Preloader from '@/components/Preloader';
// const TopNavigationBar = lazy(() => import('@/components/layout/TopNavigationBar'));
// const VerticalNavigationBar = lazy(() => import('@/components/layout/VerticalNavigationBar'));
// const AdminLayout = ({
//   children
// }) => {
//   return <div className="wrapper">
//       <Suspense fallback={<FallbackLoading />}>
//         <TopNavigationBar />
//       </Suspense>

//       <Suspense fallback={<FallbackLoading />}>
//         <VerticalNavigationBar />
//       </Suspense>

//       <div className="page-content">
//         <div className="container-xxl">
//           <Suspense fallback={<Preloader />}>{children}</Suspense>
//         </div>

//         <Footer />
//       </div>
//     </div>;
// };
// export default AdminLayout;

import { lazy, Suspense } from 'react';
import FallbackLoading from '@/components/FallbackLoading';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/Preloader';

const TopNavigationBar = lazy(() => import('@/components/layout/TopNavigationBar'));
const VerticalNavigationBar = lazy(() => import('@/components/layout/VerticalNavigationBar'));

const AdminLayout = ({ children }) => {
  return (
    <div
      className="wrapper"
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
      }}
    >
      <Suspense fallback={<FallbackLoading />}>
        <TopNavigationBar />
      </Suspense>

      <Suspense fallback={<FallbackLoading />}>
        <VerticalNavigationBar />
      </Suspense>

      <div
        className="page-content"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        <div
          className="container-xxl"
          style={{
            paddingTop: '24px',
            paddingBottom: '8px',
          }}
        >
          <Suspense fallback={<Preloader />}>{children}</Suspense>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;