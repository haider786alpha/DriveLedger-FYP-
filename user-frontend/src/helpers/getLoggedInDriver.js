// export const getLoggedInUsername = () => {
//   try {
//     const authUser = localStorage.getItem('authUser');
//     if (!authUser) return null;

//     const parsed = JSON.parse(authUser);
//     return parsed?.username || null;
//   } catch (error) {
//     console.error('Error reading logged in user:', error);
//     return null;
//   }
// };

// export const getLoggedInDriver = async () => {
//   try {
//     const username = getLoggedInUsername();
//     if (!username) return null;

//     const response = await fetch('http://localhost:8000/api/drivers/');
//     const drivers = await response.json();

//     const matchedDriver = drivers.find(
//       (driver) => String(driver.user_name).toLowerCase() === String(username).toLowerCase()
//     );

//     return matchedDriver || null;
//   } catch (error) {
//     console.error('Error fetching logged in driver:', error);
//     return null;
//   }
// };

import { API_URL } from "@/helpers/apiConfig";

export const getLoggedInUsername = () => {
  try {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return null;

    const parsed = JSON.parse(authUser);
    return parsed?.username || null;
  } catch (error) {
    console.error("Error reading logged in user:", error);
    return null;
  }
};

export const getLoggedInDriver = async () => {
  try {
    const username = getLoggedInUsername();
    if (!username) return null;

    const response = await fetch(API_URL("/api/drivers/"));
    const drivers = await response.json();

    const matchedDriver = drivers.find(
      (driver) =>
        String(driver.user_name).toLowerCase() === String(username).toLowerCase()
    );

    return matchedDriver || null;
  } catch (error) {
    console.error("Error fetching logged in driver:", error);
    return null;
  }
};