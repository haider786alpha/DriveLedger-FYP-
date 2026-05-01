export const API_BASE_URL = "http://localhost:8000";

export const API_URL = (path) => {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};