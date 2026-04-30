// import React, { useEffect, useState } from "react";

// const AssignedCar = () => {
//   const [assignment, setAssignment] = useState(null);
//   const [car, setCar] = useState(null);

//   // TEMP: change this according to driver table ID
//   const driverId = 2;

//   useEffect(() => {
//     fetchAssignedCar();
//   }, []);

//   const fetchAssignedCar = async () => {
//     try {
//       const assignmentsRes = await fetch("http://localhost:8000/api/assignments/");
//       const assignments = await assignmentsRes.json();

//       const activeAssignment = assignments.find(
//         (item) =>
//           Number(item.driver) === Number(driverId) &&
//           String(item.status).toLowerCase() === "active"
//       );

//       setAssignment(activeAssignment || null);

//       if (!activeAssignment) return;

//       const carRes = await fetch(`http://localhost:8000/api/cars/${activeAssignment.car}/`);
//       const carData = await carRes.json();

//       setCar(carData);
//     } catch (error) {
//       console.error("Assigned car error:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Assigned Car</h2>
//       <p>Details of the car assigned to you.</p>

//       <div
//         style={{
//           marginTop: "20px",
//           padding: "20px",
//           border: "1px solid #ddd",
//           borderRadius: "10px",
//           maxWidth: "500px",
//         }}
//       >
//         {car ? (
//           <>
//             <h4>{car.make} {car.model}</h4>
//             <p><strong>Year:</strong> {car.year}</p>
//             <p><strong>Registration Number:</strong> {car.registration_number}</p>
//             <p><strong>Mileage:</strong> {car.mileage}</p>
//             <p><strong>Condition:</strong> {car.condition}</p>
//             <p><strong>Assignment Status:</strong> {assignment?.status}</p>
//             <p><strong>Assigned Date:</strong> {assignment?.start_date}</p>
//           </>
//         ) : (
//           <p>No active car assigned.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssignedCar;

import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";

const AssignedCar = () => {
  const [driver, setDriver] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedCar();
  }, []);

  const fetchAssignedCar = async () => {
    try {
      setLoading(true);

      const loggedInDriver = await getLoggedInDriver();
      setDriver(loggedInDriver);

      if (!loggedInDriver) {
        setLoading(false);
        return;
      }

      const assignmentsRes = await fetch("http://localhost:8000/api/assignments/");
      const assignments = await assignmentsRes.json();

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(loggedInDriver.id) &&
          String(item.status).toLowerCase() === "active"
      );

      setAssignment(activeAssignment || null);

      if (!activeAssignment) {
        setLoading(false);
        return;
      }

      const carRes = await fetch(
        `http://localhost:8000/api/cars/${activeAssignment.car}/`
      );
      const carData = await carRes.json();

      setCar(carData);
    } catch (error) {
      console.error("Assigned car error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading assigned car...</div>;
  }

  return (
    <div>
      <h2>Assigned Car</h2>
      <p>Details of the car assigned to you.</p>

      {driver && (
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          Logged in as: {driver.user_name}
        </p>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          maxWidth: "500px",
        }}
      >
        {car ? (
          <>
            <h4>
              {car.make} {car.model}
            </h4>
            <p><strong>Year:</strong> {car.year}</p>
            <p><strong>Registration Number:</strong> {car.registration_number}</p>
            <p><strong>Mileage:</strong> {car.mileage}</p>
            <p><strong>Condition:</strong> {car.condition}</p>
            <p><strong>Assignment Status:</strong> {assignment?.status}</p>
            <p><strong>Assigned Date:</strong> {assignment?.start_date}</p>
          </>
        ) : (
          <p>No active car assigned.</p>
        )}
      </div>
    </div>
  );
};

export default AssignedCar;