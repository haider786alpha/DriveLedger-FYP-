// import React, { useEffect, useState } from "react";
// import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
// import { API_URL } from "@/helpers/apiConfig";

// const AssignedCar = () => {
//   const [driver, setDriver] = useState(null);
//   const [assignment, setAssignment] = useState(null);
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAssignedCar();
//   }, []);

//   const fetchAssignedCar = async () => {
//     try {
//       setLoading(true);

//       const loggedInDriver = await getLoggedInDriver();
//       setDriver(loggedInDriver);

//       if (!loggedInDriver) {
//         setLoading(false);
//         return;
//       }

//       const assignmentsRes = await fetch(API_URL("/api/assignments/"));
//       const assignments = await assignmentsRes.json();

//       const activeAssignment = assignments.find(
//         (item) =>
//           Number(item.driver) === Number(loggedInDriver.id) &&
//           String(item.status).toLowerCase() === "active"
//       );

//       setAssignment(activeAssignment || null);

//       if (!activeAssignment) {
//         setLoading(false);
//         return;
//       }

//       const carRes = await fetch(
//         API_URL(`/api/cars/${activeAssignment.car}/`)
//       );
//       const carData = await carRes.json();

//       setCar(carData);
//     } catch (error) {
//       console.error("Assigned car error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading assigned car...</div>;
//   }

//   return (
//     <div>
//       <h2>Assigned Car</h2>
//       <p>Details of the car assigned to you.</p>

//       {driver && (
//         <p style={{ marginTop: "10px", fontWeight: "bold" }}>
//           Logged in as: {driver.user_name}
//         </p>
//       )}

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
//             <h4>
//               {car.make} {car.model}
//             </h4>
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
import { API_URL } from "@/helpers/apiConfig";

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

      const assignmentsRes = await fetch(API_URL("/api/assignments/"));
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

      const carRes = await fetch(API_URL(`/api/cars/${activeAssignment.car}/`));
      const carData = await carRes.json();
      setCar(carData);
    } catch (error) {
      console.error("Assigned car error:", error);
    } finally {
      setLoading(false);
    }
  };

  const infoCardStyle = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "16px",
    minWidth: 0,
  };

  if (loading) {
    return <div>Loading assigned car...</div>;
  }

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
          border: "1px solid #dbeafe",
          borderRadius: "18px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "34px", fontWeight: "700", color: "#0f172a" }}>
          Assigned Car
        </h2>
        <p style={{ margin: "10px 0 0 0", color: "#475569", fontSize: "15px", lineHeight: "1.6" }}>
          View complete details of the vehicle currently assigned to your account.
        </p>

        {driver && (
          <div
            style={{
              marginTop: "18px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "999px",
              padding: "8px 14px",
              fontWeight: "600",
              color: "#1e293b",
              maxWidth: "100%",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            Logged in as: {driver.user_name}
          </div>
        )}
      </div>

      {car ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: "22px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    color: "#0f172a",
                    wordBreak: "break-word",
                  }}
                >
                  {car.make} {car.model}
                </h3>
                <p style={{ margin: "8px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                  Your current assigned vehicle
                </p>
              </div>

              <span
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "#dcfce7",
                  color: "#166534",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                }}
              >
                {assignment?.status || "active"}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px",
              }}
            >
              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Make</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.make || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Model</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.model || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Year</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a" }}>
                  {car.year || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Mileage</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.mileage || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Registration Number</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.registration_number || "-"}
                </strong>
              </div>

              <div style={infoCardStyle}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Condition</p>
                <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                  {car.condition || "-"}
                </strong>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "20px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                minWidth: 0,
              }}
            >
              <h4 style={{ margin: "0 0 18px 0", color: "#0f172a" }}>Assignment Details</h4>

              <div style={{ display: "grid", gap: "14px" }}>
                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Assignment Status</p>
                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#0f172a",
                      textTransform: "capitalize",
                      wordBreak: "break-word",
                    }}
                  >
                    {assignment?.status || "-"}
                  </strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Assigned Date</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {assignment?.start_date || "-"}
                  </strong>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                minWidth: 0,
              }}
            >
              <h4 style={{ margin: "0 0 18px 0", color: "#0f172a" }}>Quick Overview</h4>

              <div style={{ display: "grid", gap: "12px" }}>
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #dbeafe",
                    borderRadius: "14px",
                    padding: "16px",
                    minWidth: 0,
                  }}
                >
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Driver</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {driver?.user_name || "-"}
                  </strong>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px",
                    minWidth: 0,
                  }}
                >
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Vehicle Type</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {car.make} {car.model}
                  </strong>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px",
                    minWidth: 0,
                  }}
                >
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Registration</p>
                  <strong style={{ display: "block", marginTop: "6px", color: "#0f172a", wordBreak: "break-word" }}>
                    {car.registration_number || "-"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#ffffff",
            border: "1px dashed #cbd5e1",
            borderRadius: "18px",
            padding: "28px",
            textAlign: "center",
            color: "#64748b",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.03)",
          }}
        >
          No active car assigned.
        </div>
      )}
    </div>
  );
};

export default AssignedCar;
