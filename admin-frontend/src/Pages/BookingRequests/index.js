import React, { useEffect, useMemo, useState } from "react";
import "./BookingRequests.css";

const API_BASE_URL = "https://driveledger-backend.onrender.com";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const defaultSummary = {
  total_requests: 0,
  pending_requests: 0,
  contacted_requests: 0,
  confirmed_requests: 0,
  completed_requests: 0,
  cancelled_requests: 0,
  total_booking_value: 0,
  pending_value: 0,
  contacted_value: 0,
  confirmed_value: 0,
  completed_earnings: 0,
  cancelled_value: 0,
};

const getAccessToken = () => {
  const accessToken = localStorage.getItem("access");

  if (accessToken) return accessToken;

  try {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    return authUser?.token || "";
  } catch (error) {
    return "";
  }
};

const getRefreshToken = () => {
  return localStorage.getItem("refresh") || "";
};

const saveAccessToken = (newAccessToken) => {
  localStorage.setItem("access", newAccessToken);

  try {
    const authUser = JSON.parse(localStorage.getItem("authUser"));

    if (authUser) {
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          ...authUser,
          token: newAccessToken,
        })
      );
    }
  } catch (error) {
    // ignore
  }
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Admin session expired. Please logout and login again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data?.access) {
    throw new Error("Admin session expired. Please logout and login again.");
  }

  saveAccessToken(data.access);

  return data.access;
};

const apiRequest = async (path, options = {}, retry = true) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Admin login token not found. Please logout and login again.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 && retry) {
    const newAccessToken = await refreshAccessToken();

    return fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newAccessToken}`,
        ...(options.headers || {}),
      },
    });
  }

  return response;
};

const normalizeBookings = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.results)) return data.data.results;
  return [];
};

const buildSummaryFromBookings = (bookingList = []) => {
  const countByStatus = (status) =>
    bookingList.filter((item) => item.status === status).length;

  const sumByStatus = (status) =>
    bookingList
      .filter((item) => item.status === status)
      .reduce((total, item) => total + Number(item.estimated_fare || 0), 0);

  const totalBookingValue = bookingList
    .filter((item) => item.status !== "cancelled")
    .reduce((total, item) => total + Number(item.estimated_fare || 0), 0);

  return {
    total_requests: bookingList.length,
    pending_requests: countByStatus("pending"),
    contacted_requests: countByStatus("contacted"),
    confirmed_requests: countByStatus("confirmed"),
    completed_requests: countByStatus("completed"),
    cancelled_requests: countByStatus("cancelled"),
    total_booking_value: totalBookingValue,
    pending_value: sumByStatus("pending"),
    contacted_value: sumByStatus("contacted"),
    confirmed_value: sumByStatus("confirmed"),
    completed_earnings: sumByStatus("completed"),
    cancelled_value: sumByStatus("cancelled"),
  };
};

const formatAmount = (value) => {
  return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  try {
    const [hours, minutes] = value.split(":");
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return value;
  }
};

const formatVehicleType = (value) => {
  const labels = {
    economy: "Economy",
    comfort: "Comfort",
    family: "Family / 7-Seater",
    premium: "Premium",
  };

  return labels[value] || value || "—";
};

const formatTripType = (value) => {
  if (value === "round_trip") return "Round Trip";
  return "One Way";
};

const getFareLabel = (value) => {
  const amount = Number(value || 0);

  if (amount <= 0) {
    return "Custom Quote";
  }

  return formatAmount(amount);
};

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const fetchBookings = async () => {
    const response = await apiRequest("/api/city-bookings/", {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to load booking requests.");
    }

    return normalizeBookings(data);
  };

  const fetchSummary = async () => {
    const response = await apiRequest("/api/city-bookings/summary/", {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to load booking earnings summary.");
    }

    return {
      ...defaultSummary,
      ...data,
    };
  };

  const loadBookingData = async () => {
    try {
      setLoading(true);
      setError("");

      const bookingList = await fetchBookings();

      setBookings(bookingList);

      try {
        const summaryData = await fetchSummary();
        setSummary(summaryData);
      } catch (summaryError) {
        console.warn("Summary API failed, using frontend fallback:", summaryError);
        setSummary(buildSummaryFromBookings(bookingList));
      }
    } catch (err) {
      console.error("Booking data error:", err);
      setBookings([]);
      setSummary(defaultSummary);
      setError(err?.message || "Unable to load booking data.");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      setError("");

      const response = await apiRequest(`/api/city-bookings/${bookingId}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to update booking status.");
      }

      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? data : booking
      );

      setBookings(updatedBookings);

      try {
        const summaryData = await fetchSummary();
        setSummary(summaryData);
      } catch (summaryError) {
        console.warn("Summary API failed after status update:", summaryError);
        setSummary(buildSummaryFromBookings(updatedBookings));
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError(err?.message || "Status update failed. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    loadBookingData();
  }, []);

  return (
    <div className="booking-admin-page">
      <div className="booking-admin-hero">
        <div className="booking-hero-main">
          <div className="booking-hero-icon">
            <i className="bx bx-calendar-check" />
          </div>

          <div>
            <span className="booking-admin-kicker">
              <i className="bx bx-trip" />
              DriveEase Public Booking
            </span>

            <h1>Booking Requests</h1>

            <p>
              View city-to-city ride requests submitted from the DriveEase public
              booking page and track booking earnings by status.
            </p>
          </div>
        </div>

        <button
          className="booking-refresh-btn"
          onClick={loadBookingData}
          disabled={loading}
        >
          <i className={`bx ${loading ? "bx-loader-alt bx-spin" : "bx-refresh"}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="booking-admin-stats">
        <StatCard
          icon="bx bx-receipt"
          label="Total Requests"
          value={summary.total_requests}
          note={`${formatAmount(summary.total_booking_value)} total value`}
        />

        <StatCard
          icon="bx bx-time-five"
          label="Pending Value"
          value={formatAmount(summary.pending_value)}
          note={`${summary.pending_requests} pending requests`}
        />

        <StatCard
          icon="bx bx-check-shield"
          label="Confirmed Earnings"
          value={formatAmount(summary.confirmed_value)}
          note={`${summary.confirmed_requests} confirmed bookings`}
        />

        <StatCard
          icon="bx bx-wallet"
          label="Completed Earnings"
          value={formatAmount(summary.completed_earnings)}
          note={`${summary.completed_requests} completed bookings`}
        />
      </div>

      <div className="booking-admin-toolbar">
        <div className="booking-toolbar-title">
          <span className="booking-toolbar-icon">
            <i className="bx bx-list-ul" />
          </span>

          <div>
            <h2>All Booking Requests</h2>
            <p>Manage customer route, fare, and booking status.</p>
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="booking-admin-error">
          <i className="bx bx-error-circle" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="booking-admin-empty">
          <i className="bx bx-loader-alt bx-spin" />
          Loading booking requests...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="booking-admin-empty">
          <i className="bx bx-folder-open" />
          No booking requests found.
        </div>
      ) : (
        <div className="booking-table-wrap">
          <table className="booking-admin-table">
            <thead>
              <tr>
                <th>
                  <i className="bx bx-hash" />
                  Reference
                </th>
                <th>
                  <i className="bx bx-user" />
                  Customer
                </th>
                <th>
                  <i className="bx bx-map" />
                  Route
                </th>
                <th>
                  <i className="bx bx-calendar" />
                  Travel
                </th>
                <th>
                  <i className="bx bx-car" />
                  Vehicle
                </th>
                <th>
                  <i className="bx bx-money" />
                  Fare
                </th>
                <th>
                  <i className="bx bx-check-circle" />
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.booking_reference}</strong>
                    <small>Created: {formatDate(booking.created_at)}</small>
                  </td>

                  <td>
                    <strong>{booking.customer_name}</strong>
                    <small>{booking.phone}</small>
                    {booking.email && <small>{booking.email}</small>}
                  </td>

                  <td>
                    <strong>
                      {booking.from_city} → {booking.to_city}
                    </strong>
                    <small>Pickup: {booking.pickup_point}</small>
                    <small>Drop-off: {booking.dropoff_point}</small>
                  </td>

                  <td>
                    <strong>{formatDate(booking.travel_date)}</strong>
                    <small>{formatTime(booking.pickup_time)}</small>
                    <small>
                      {formatTripType(booking.trip_type)}
                      {booking.trip_type === "round_trip"
                        ? ` • Return: ${formatDate(booking.return_date)}`
                        : ""}
                    </small>
                  </td>

                  <td>
                    <strong>{formatVehicleType(booking.vehicle_type)}</strong>
                    <small>Passengers: {booking.passengers}</small>
                    <small>Luggage: {booking.luggage_bags}</small>
                  </td>

                  <td>
                    <strong>{getFareLabel(booking.estimated_fare)}</strong>
                  </td>

                  <td>
                    <select
                      className={`booking-status-select status-${booking.status}`}
                      value={booking.status}
                      disabled={updatingId === booking.id}
                      onChange={(e) =>
                        updateBookingStatus(booking.id, e.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, note }) => (
  <div className="booking-stat-card">
    <div className="booking-stat-content">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>

    <div className="booking-stat-icon">
      <i className={icon} />
    </div>
  </div>
);

export default BookingRequests;