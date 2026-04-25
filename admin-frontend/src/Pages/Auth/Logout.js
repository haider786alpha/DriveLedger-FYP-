import React, { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("authUser");

    window.location.href = "/login";
  }, []);

  return <p>Logging out...</p>;
};

export default Logout;