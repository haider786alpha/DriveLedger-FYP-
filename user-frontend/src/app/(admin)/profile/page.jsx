// const Profile = () => {
//   const driver = {
//     name: "Ali Khan",
//     username: "alikhan",
//     email: "ali@driveledger.com",
//     phone: "0300-1234567",
//     cnic: "35202-1234567-1",
//     address: "Rawalpindi, Pakistan",
//     assignedCar: "Toyota Corolla",
//     status: "Active",
//   };

//   return (
//     <div>
//       <h2>My Profile</h2>
//       <p>View your personal information and assigned details.</p>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(2, 1fr)",
//           gap: "20px",
//           marginTop: "20px",
//         }}
//       >
//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//           <h4>Personal Information</h4>
//           <p><strong>Name:</strong> {driver.name}</p>
//           <p><strong>Username:</strong> {driver.username}</p>
//           <p><strong>Email:</strong> {driver.email}</p>
//           <p><strong>Phone:</strong> {driver.phone}</p>
//           <p><strong>CNIC:</strong> {driver.cnic}</p>
//           <p><strong>Address:</strong> {driver.address}</p>
//         </div>

//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
//           <h4>Work Information</h4>
//           <p><strong>Assigned Car:</strong> {driver.assignedCar}</p>
//           <p><strong>Status:</strong> {driver.status}</p>

//           <button
//             style={{
//               marginTop: "10px",
//               padding: "10px 16px",
//               border: "none",
//               borderRadius: "8px",
//               background: "#3b82f6",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";

const Profile = () => {
  const [driver, setDriver] = useState(null);
  const [user, setUser] = useState(null);
  const [assignedCar, setAssignedCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setLoading(false);
        return;
      }

      const usersRes = await fetch("http://localhost:8000/api/users/");
      const users = await usersRes.json();

      const matchedUser = users.find(
        (item) => Number(item.id) === Number(loggedInDriver.user)
      );
      setUser(matchedUser || null);

      const assignmentsRes = await fetch("http://localhost:8000/api/assignments/");
      const assignments = await assignmentsRes.json();

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(loggedInDriver.id) &&
          String(item.status).toLowerCase() === "active"
      );

      if (activeAssignment) {
        const carRes = await fetch(
          `http://localhost:8000/api/cars/${activeAssignment.car}/`
        );
        const carData = await carRes.json();
        setAssignedCar(carData);
      }
    } catch (error) {
      console.error("Profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!driver) {
    return <div>No driver profile found.</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>My Profile</h2>
          <p style={{ margin: "8px 0 0 0" }}>
            View your personal information and assigned details.
          </p>
        </div>

        <button
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#3b82f6",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h4>Personal Information</h4>
          <p><strong>Name:</strong> {driver.user_name || "-"}</p>
          <p><strong>Username:</strong> {user?.username || driver.user_name || "-"}</p>
          <p><strong>Email:</strong> {user?.email || "-"}</p>
          <p><strong>Phone:</strong> -</p>
          <p><strong>CNIC:</strong> {driver.cnic || "-"}</p>
          <p><strong>Address:</strong> {driver.address || "-"}</p>
          <p><strong>License Number:</strong> {driver.license_number || "-"}</p>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h4>Work Information</h4>
          <p>
            <strong>Assigned Car:</strong>{" "}
            {assignedCar
              ? `${assignedCar.make} ${assignedCar.model}`
              : "No active car assigned"}
          </p>
          <p><strong>Status:</strong> Active</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;