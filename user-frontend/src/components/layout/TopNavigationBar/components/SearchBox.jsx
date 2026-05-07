// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// const SearchBox = () => {
//   return <form className="app-search d-none d-md-block me-auto">
//       <div className="position-relative">
//         <input type="search" className="form-control" placeholder="Search..." autoComplete="off" />
//         <IconifyIcon icon="iconamoon:search-duotone" className="search-widget-icon" />
//       </div>
//     </form>;
// };
// export default SearchBox;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const pages = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'My Profile', path: '/profile' },
  { name: 'Assigned Car', path: '/assigned-car' },
  { name: 'Payment History', path: '/payment-history' },
  { name: 'Pending Dues', path: '/pending-dues' },
  { name: 'Alerts', path: '/alerts' },
  { name: 'Repair Status', path: '/repair-status' },
  { name: 'Support', path: '/support' },
];

const SearchBox = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    setSearch('');
    setShowResults(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (filteredPages.length > 0 && search.trim()) {
      handleSelect(filteredPages[0].path);
    }
  };

  return (
    <form
      className="app-search d-none d-md-block me-auto"
      onSubmit={handleSubmit}
      style={{ position: 'relative' }}
    >
      <div className="position-relative">
        <input
          type="search"
          className="form-control"
          placeholder="Search pages..."
          autoComplete="off"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />

        <IconifyIcon
          icon="iconamoon:search-duotone"
          className="search-widget-icon"
        />
      </div>

      {showResults && search.trim() && (
        <div
          style={{
            position: 'absolute',
            top: '45px',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
            zIndex: 2000,
            overflow: 'hidden',
          }}
        >
          {filteredPages.length > 0 ? (
            filteredPages.map((page) => (
              <button
                key={page.path}
                type="button"
                onClick={() => handleSelect(page.path)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: '#ffffff',
                  padding: '12px 14px',
                  textAlign: 'left',
                  color: '#0f172a',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                {page.name}
              </button>
            ))
          ) : (
            <div
              style={{
                padding: '12px 14px',
                color: '#64748b',
                fontSize: '14px',
              }}
            >
              No page found
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBox;