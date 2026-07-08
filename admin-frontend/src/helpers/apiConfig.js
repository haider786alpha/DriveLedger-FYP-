// export const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "https://driveledger-backend.onrender.com";

// export const API_URL = (path) => {
//   return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
// };

const LOCAL_API_URL = "http://127.0.0.1:8000";
const DEPLOYED_API_URL = "https://driveledger-backend.onrender.com";

export const REACT_APP_API_URL =
  process.env.REACT_APP_API_URL || LOCAL_API_URL;

// This is used in many files like API_URL("/api/users/")
export const API_URL = (path = "") => {
  return `${REACT_APP_API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

// Optional manual switch:
// export const REACT_APP_API_URL = LOCAL_API_URL;
// export const REACT_APP_API_URL = DEPLOYED_API_URL;

export default REACT_APP_API_URL;