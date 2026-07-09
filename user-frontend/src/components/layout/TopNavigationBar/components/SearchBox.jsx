import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const pages = [
  { name: "Dashboard", path: "/dashboard", icon: "mdi:view-dashboard-outline" },
  { name: "My Profile", path: "/profile", icon: "mdi:account-circle-outline" },
  { name: "Assigned Car", path: "/assigned-car", icon: "mdi:car-outline" },
  { name: "Share Location", path: "/share-location", icon: "mdi:map-marker-radius-outline" },
  { name: "Payment History", path: "/payment-history", icon: "mdi:credit-card-check-outline" },
  { name: "Pending Dues", path: "/pending-dues", icon: "mdi:file-document-alert-outline" },
  { name: "Alerts", path: "/alerts", icon: "mdi:bell-badge-outline" },
  { name: "Repair Status", path: "/repair-status", icon: "mdi:car-wrench" },
  { name: "Support", path: "/support", icon: "mdi:message-question-outline" },
];

const SearchBox = () => {
  const navigate = useNavigate();
  const searchWrapRef = useRef(null);

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredPages = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return pages.filter((page) => page.name.toLowerCase().includes(query));
  }, [search]);

  const handleSelect = (path) => {
    navigate(path);
    setSearch("");
    setShowResults(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (filteredPages.length > 0 && search.trim()) {
      handleSelect(filteredPages[0].path);
    }
  };

  const handleBlur = (e) => {
    if (!searchWrapRef.current?.contains(e.relatedTarget)) {
      setTimeout(() => setShowResults(false), 120);
    }
  };

  return (
    <form
      className="app-search d-none d-md-block me-auto driver-search-form"
      onSubmit={handleSubmit}
      ref={searchWrapRef}
      onBlur={handleBlur}
    >
      <div className="driver-search-input-wrap">
        <IconifyIcon icon="mdi:magnify" className="driver-search-icon" />

        <input
          type="search"
          className="form-control driver-search-input"
          placeholder="Search driver pages..."
          autoComplete="off"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />

        {search.trim() && (
          <button
            type="button"
            className="driver-search-clear"
            onClick={() => {
              setSearch("");
              setShowResults(false);
            }}
            aria-label="Clear search"
          >
            <IconifyIcon icon="mdi:close" />
          </button>
        )}
      </div>

      {showResults && search.trim() && (
        <div className="driver-search-results">
          {filteredPages.length > 0 ? (
            filteredPages.map((page) => (
              <button
                key={page.path}
                type="button"
                onClick={() => handleSelect(page.path)}
                className="driver-search-result-item"
              >
                <span className="driver-search-result-icon">
                  <IconifyIcon icon={page.icon} />
                </span>

                <span>
                  <strong>{page.name}</strong>
                  <small>{page.path}</small>
                </span>
              </button>
            ))
          ) : (
            <div className="driver-search-empty">
              <div>
                <IconifyIcon icon="mdi:file-search-outline" />
              </div>

              <strong>No page found</strong>
              <p>Try searching dashboard, profile, alerts, or support.</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBox;