// export const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:8000";

// export const API_URL = (path) => {
//   return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
// };

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://driveledger-backend.onrender.com";

export const API_URL = (path) => {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};