// import React, { useEffect, useState } from "react";
// import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
// import { API_URL } from "@/helpers/apiConfig";
// import {
//   pageHeroStyle,
//   pageTitleStyle,
//   pageSubtitleStyle,
//   loggedInPillStyle,
//   contentCardStyle,
//   innerInfoCardStyle,
//   sectionTitleStyle,
//   emptyStateStyle,
//   infoLabelStyle,
//   primaryButtonStyle,
// } from "@/helpers/panelStyles";

// const Profile = () => {
//   const [driver, setDriver] = useState(null);
//   const [user, setUser] = useState(null);
//   const [assignedCar, setAssignedCar] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [showEditForm, setShowEditForm] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [changingPassword, setChangingPassword] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     old_password: "",
//     new_password: "",
//     confirm_password: "",
//   });

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     cnic: "",
//     address: "",
//     license_number: "",
//   });

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const fetchProfileData = async () => {
//     try {
//       setLoading(true);

//       const loggedInDriver = await getLoggedInDriver();
//       setDriver(loggedInDriver);

//       if (!loggedInDriver) {
//         setLoading(false);
//         return;
//       }

//       const usersRes = await fetch(API_URL("/api/users/"));
//       const users = await usersRes.json();

//       const matchedUser = users.find(
//         (item) => Number(item.id) === Number(loggedInDriver.user)
//       );

//       setUser(matchedUser || null);

//       setFormData({
//         username: matchedUser?.username || loggedInDriver.user_name || "",
//         email: matchedUser?.email || loggedInDriver.email || "",
//         cnic: loggedInDriver.cnic || "",
//         address: loggedInDriver.address || "",
//         license_number: loggedInDriver.license_number || "",
//       });

//       const assignmentsRes = await fetch(API_URL("/api/assignments/"));
//       const assignments = await assignmentsRes.json();

//       const activeAssignment = assignments.find(
//         (item) =>
//           Number(item.driver) === Number(loggedInDriver.id) &&
//           String(item.status).toLowerCase() === "active"
//       );

//       if (activeAssignment) {
//         const carRes = await fetch(API_URL(`/api/cars/${activeAssignment.car}/`));
//         const carData = await carRes.json();
//         setAssignedCar(carData);
//       } else {
//         setAssignedCar(null);
//       }
//     } catch (error) {
//       console.error("Profile error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenEdit = () => {
//     setFormData({
//       username: user?.username || driver?.user_name || "",
//       email: user?.email || driver?.email || "",
//       cnic: driver?.cnic || "",
//       address: driver?.address || "",
//       license_number: driver?.license_number || "",
//     });

//     setShowEditForm(true);
//   };

//   const handleCloseEdit = () => {
//     setShowEditForm(false);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;

//     setPasswordData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSaveChanges = async () => {
//     if (!driver) {
//       alert("Driver profile not found.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         email: formData.email.trim(),
//         address: formData.address.trim(),
//       };

//       const res = await fetch(API_URL(`/api/drivers/${driver.id}/`), {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to update profile");
//       }

//       alert("Profile updated successfully.");
//       setShowEditForm(false);
//       await fetchProfileData();
//     } catch (error) {
//       console.error("Save profile error:", error);
//       alert("Failed to update profile.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleChangePassword = async () => {
//     if (!passwordData.old_password.trim()) {
//       alert("Please enter your old password.");
//       return;
//     }

//     if (!passwordData.new_password.trim()) {
//       alert("Please enter your new password.");
//       return;
//     }

//     if (passwordData.new_password.length < 6) {
//       alert("New password must be at least 6 characters long.");
//       return;
//     }

//     if (passwordData.new_password !== passwordData.confirm_password) {
//       alert("New password and confirm password do not match.");
//       return;
//     }

//     try {
//       setChangingPassword(true);

//       const token = localStorage.getItem("access");

//       const res = await fetch(API_URL("/api/change-password/"), {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           old_password: passwordData.old_password,
//           new_password: passwordData.new_password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || data.detail || "Failed to change password");
//       }

//       alert("Password changed successfully.");

//       setPasswordData({
//         old_password: "",
//         new_password: "",
//         confirm_password: "",
//       });
//     } catch (error) {
//       console.error("Change password error:", error);
//       alert(error.message || "Failed to change password.");
//     } finally {
//       setChangingPassword(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading profile...</div>;
//   }

//   if (!driver) {
//     return <div style={emptyStateStyle}>No driver profile found.</div>;
//   }

//   return (
//     <div>
//       <div style={pageHeroStyle}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: "16px",
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ minWidth: 0 }}>
//             <h2 style={pageTitleStyle}>My Profile</h2>
//             <p style={pageSubtitleStyle}>
//               View your personal details, driver records, and assigned vehicle information.
//             </p>
//           </div>

//           <button
//             onClick={handleOpenEdit}
//             style={{
//               ...primaryButtonStyle,
//               whiteSpace: "nowrap",
//             }}
//           >
//             Edit Profile
//           </button>
//         </div>

//         <div style={loggedInPillStyle}>
//           <span
//             style={{
//               width: "10px",
//               height: "10px",
//               borderRadius: "50%",
//               background: "#22c55e",
//               display: "inline-block",
//             }}
//           />
//           Active Driver Profile
//         </div>
//       </div>

//       {showEditForm && (
//         <div
//           style={{
//             ...contentCardStyle,
//             marginBottom: "24px",
//             border: "1px solid #bfdbfe",
//             background: "#f8fbff",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               gap: "12px",
//               flexWrap: "wrap",
//               marginBottom: "18px",
//             }}
//           >
//             <div>
//               <h4 style={sectionTitleStyle}>Edit Profile</h4>
//               <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" }}>
//                 You can update your email and address here.
//               </p>
//             </div>

//             <button
//               onClick={handleCloseEdit}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: "10px",
//                 border: "1px solid #cbd5e1",
//                 background: "#ffffff",
//                 color: "#334155",
//                 fontWeight: "600",
//                 cursor: "pointer",
//               }}
//             >
//               Cancel
//             </button>
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//               gap: "14px",
//             }}
//           >
//             <div style={innerInfoCardStyle}>
//               <label style={infoLabelStyle}>Username</label>
//               <input
//                 type="text"
//                 value={formData.username}
//                 disabled
//                 style={{
//                   width: "100%",
//                   marginTop: "8px",
//                   padding: "10px 12px",
//                   borderRadius: "10px",
//                   border: "1px solid #cbd5e1",
//                   outline: "none",
//                   background: "#f1f5f9",
//                 }}
//               />
//             </div>

//             <div style={innerInfoCardStyle}>
//               <label style={infoLabelStyle}>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 style={{
//                   width: "100%",
//                   marginTop: "8px",
//                   padding: "10px 12px",
//                   borderRadius: "10px",
//                   border: "1px solid #cbd5e1",
//                   outline: "none",
//                 }}
//               />
//             </div>

//             <div style={innerInfoCardStyle}>
//               <label style={infoLabelStyle}>CNIC</label>
//               <input
//                 type="text"
//                 value={formData.cnic}
//                 disabled
//                 style={{
//                   width: "100%",
//                   marginTop: "8px",
//                   padding: "10px 12px",
//                   borderRadius: "10px",
//                   border: "1px solid #cbd5e1",
//                   outline: "none",
//                   background: "#f1f5f9",
//                 }}
//               />
//             </div>

//             <div style={innerInfoCardStyle}>
//               <label style={infoLabelStyle}>License Number</label>
//               <input
//                 type="text"
//                 value={formData.license_number}
//                 disabled
//                 style={{
//                   width: "100%",
//                   marginTop: "8px",
//                   padding: "10px 12px",
//                   borderRadius: "10px",
//                   border: "1px solid #cbd5e1",
//                   outline: "none",
//                   background: "#f1f5f9",
//                 }}
//               />
//             </div>

//             <div
//               style={{
//                 ...innerInfoCardStyle,
//                 gridColumn: "1 / -1",
//               }}
//             >
//               <label style={infoLabelStyle}>Address</label>
//               <textarea
//                 name="address"
//                 rows="4"
//                 value={formData.address}
//                 onChange={handleChange}
//                 style={{
//                   width: "100%",
//                   marginTop: "8px",
//                   padding: "10px 12px",
//                   borderRadius: "10px",
//                   border: "1px solid #cbd5e1",
//                   outline: "none",
//                   resize: "none",
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{ marginTop: "18px" }}>
//             <button
//               onClick={handleSaveChanges}
//               disabled={saving}
//               style={{
//                 ...primaryButtonStyle,
//                 opacity: saving ? 0.7 : 1,
//               }}
//             >
//               {saving ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </div>
//       )}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//           gap: "20px",
//         }}
//       >
//         <div style={contentCardStyle}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "16px",
//               marginBottom: "22px",
//               flexWrap: "wrap",
//             }}
//           >
//             <div
//               style={{
//                 width: "68px",
//                 height: "68px",
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
//                 color: "#fff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "26px",
//                 fontWeight: "700",
//                 boxShadow: "0 10px 24px rgba(59, 130, 246, 0.25)",
//                 flexShrink: 0,
//               }}
//             >
//               {String(driver.user_name || "D").charAt(0).toUpperCase()}
//             </div>

//             <div style={{ minWidth: 0 }}>
//               <h4
//                 style={{
//                   margin: 0,
//                   fontSize: "24px",
//                   color: "#0f172a",
//                   wordBreak: "break-word",
//                 }}
//               >
//                 {driver.user_name || "-"}
//               </h4>
//               <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" }}>
//                 Registered Driver Account
//               </p>
//             </div>
//           </div>

//           <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
//             Personal Information
//           </h4>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//               gap: "14px",
//             }}
//           >
//             {[
//               { label: "Name", value: driver.user_name || "-" },
//               { label: "Username", value: user?.username || driver.user_name || "-" },
//               { label: "Email", value: user?.email || driver?.email || "-" },
//               { label: "Phone", value: "-" },
//               { label: "CNIC", value: driver.cnic || "-" },
//               { label: "License Number", value: driver.license_number || "-" },
//               { label: "Address", value: driver.address || "-", full: true },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   ...innerInfoCardStyle,
//                   gridColumn: item.full ? "1 / -1" : "auto",
//                 }}
//               >
//                 <p style={infoLabelStyle}>{item.label}</p>
//                 <strong
//                   style={{
//                     display: "block",
//                     marginTop: "6px",
//                     color: "#0f172a",
//                     fontSize: "15px",
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {item.value}
//                 </strong>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gap: "20px",
//             minWidth: 0,
//           }}
//         >
//           <div style={contentCardStyle}>
//             <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
//               Work Information
//             </h4>

//             <div
//               style={{
//                 display: "grid",
//                 gap: "14px",
//               }}
//             >
//               <div style={innerInfoCardStyle}>
//                 <p style={infoLabelStyle}>Assigned Car</p>
//                 <strong
//                   style={{
//                     display: "block",
//                     marginTop: "6px",
//                     color: "#0f172a",
//                     fontSize: "16px",
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {assignedCar
//                     ? `${assignedCar.make} ${assignedCar.model}`
//                     : "No active car assigned"}
//                 </strong>
//               </div>

//               <div style={innerInfoCardStyle}>
//                 <p style={infoLabelStyle}>Status</p>
//                 <span
//                   style={{
//                     display: "inline-block",
//                     marginTop: "8px",
//                     padding: "7px 12px",
//                     borderRadius: "999px",
//                     background: "#dcfce7",
//                     color: "#166534",
//                     fontSize: "12px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   Active
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div style={contentCardStyle}>
//             <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
//               Change Password
//             </h4>

//             <div style={{ display: "grid", gap: "14px" }}>
//               <div style={innerInfoCardStyle}>
//                 <label style={infoLabelStyle}>Old Password</label>
//                 <input
//                   type="password"
//                   name="old_password"
//                   value={passwordData.old_password}
//                   onChange={handlePasswordChange}
//                   placeholder="Enter old password"
//                   style={{
//                     width: "100%",
//                     marginTop: "8px",
//                     padding: "10px 12px",
//                     borderRadius: "10px",
//                     border: "1px solid #cbd5e1",
//                     outline: "none",
//                   }}
//                 />
//               </div>

//               <div style={innerInfoCardStyle}>
//                 <label style={infoLabelStyle}>New Password</label>
//                 <input
//                   type="password"
//                   name="new_password"
//                   value={passwordData.new_password}
//                   onChange={handlePasswordChange}
//                   placeholder="Enter new password"
//                   style={{
//                     width: "100%",
//                     marginTop: "8px",
//                     padding: "10px 12px",
//                     borderRadius: "10px",
//                     border: "1px solid #cbd5e1",
//                     outline: "none",
//                   }}
//                 />
//               </div>

//               <div style={innerInfoCardStyle}>
//                 <label style={infoLabelStyle}>Confirm New Password</label>
//                 <input
//                   type="password"
//                   name="confirm_password"
//                   value={passwordData.confirm_password}
//                   onChange={handlePasswordChange}
//                   placeholder="Confirm new password"
//                   style={{
//                     width: "100%",
//                     marginTop: "8px",
//                     padding: "10px 12px",
//                     borderRadius: "10px",
//                     border: "1px solid #cbd5e1",
//                     outline: "none",
//                   }}
//                 />
//               </div>

//               <button
//                 onClick={handleChangePassword}
//                 disabled={changingPassword}
//                 style={{
//                   ...primaryButtonStyle,
//                   opacity: changingPassword ? 0.7 : 1,
//                 }}
//               >
//                 {changingPassword ? "Changing..." : "Change Password"}
//               </button>
//             </div>
//           </div>

//           <div style={contentCardStyle}>
//             <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
//               Quick Overview
//             </h4>

//             <div style={{ display: "grid", gap: "12px" }}>
//               <div
//                 style={{
//                   ...innerInfoCardStyle,
//                   background: "#eff6ff",
//                   border: "1px solid #dbeafe",
//                 }}
//               >
//                 <p style={infoLabelStyle}>Driver ID</p>
//                 <strong
//                   style={{
//                     display: "block",
//                     marginTop: "6px",
//                     color: "#0f172a",
//                     fontSize: "16px",
//                   }}
//                 >
//                   {driver.id || "-"}
//                 </strong>
//               </div>

//               <div style={innerInfoCardStyle}>
//                 <p style={infoLabelStyle}>Vehicle Condition</p>
//                 <strong
//                   style={{
//                     display: "block",
//                     marginTop: "6px",
//                     color: "#0f172a",
//                     fontSize: "16px",
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {assignedCar?.condition || "Not available"}
//                 </strong>
//               </div>

//               <div style={innerInfoCardStyle}>
//                 <p style={infoLabelStyle}>Registration Number</p>
//                 <strong
//                   style={{
//                     display: "block",
//                     marginTop: "6px",
//                     color: "#0f172a",
//                     fontSize: "16px",
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {assignedCar?.registration_number || "-"}
//                 </strong>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;



import React, { useEffect, useState } from "react";
import { getLoggedInDriver } from "@/helpers/getLoggedInDriver";
import { API_URL } from "@/helpers/apiConfig";
import {
  pageHeroStyle,
  pageTitleStyle,
  pageSubtitleStyle,
  loggedInPillStyle,
  contentCardStyle,
  innerInfoCardStyle,
  sectionTitleStyle,
  emptyStateStyle,
  infoLabelStyle,
  primaryButtonStyle,
} from "@/helpers/panelStyles";

const Profile = () => {
  const [driver, setDriver] = useState(null);
  const [user, setUser] = useState(null);
  const [assignedCar, setAssignedCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditForm, setShowEditForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    cnic: "",
    address: "",
    license_number: "",
  });

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

      const usersRes = await fetch(API_URL("/api/users/"));
      const users = await usersRes.json();

      const matchedUser = users.find(
        (item) => Number(item.id) === Number(loggedInDriver.user)
      );

      setUser(matchedUser || null);

      setFormData({
        username: matchedUser?.username || loggedInDriver.user_name || "",
        email: matchedUser?.email || loggedInDriver.email || "",
        cnic: loggedInDriver.cnic || "",
        address: loggedInDriver.address || "",
        license_number: loggedInDriver.license_number || "",
      });

      const assignmentsRes = await fetch(API_URL("/api/assignments/"));
      const assignments = await assignmentsRes.json();

      const activeAssignment = assignments.find(
        (item) =>
          Number(item.driver) === Number(loggedInDriver.id) &&
          String(item.status).toLowerCase() === "active"
      );

      if (activeAssignment) {
        const carRes = await fetch(API_URL(`/api/cars/${activeAssignment.car}/`));
        const carData = await carRes.json();
        setAssignedCar(carData);
      } else {
        setAssignedCar(null);
      }
    } catch (error) {
      console.error("Profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setFormData({
      username: user?.username || driver?.user_name || "",
      email: user?.email || driver?.email || "",
      cnic: driver?.cnic || "",
      address: driver?.address || "",
      license_number: driver?.license_number || "",
    });

    setShowEditForm(true);
  };

  const handleCloseEdit = () => {
    setShowEditForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!driver) {
      alert("Driver profile not found.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        email: formData.email.trim(),
        address: formData.address.trim(),
      };

      const res = await fetch(API_URL(`/api/drivers/${driver.id}/`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully.");
      setShowEditForm(false);
      await fetchProfileData();
    } catch (error) {
      console.error("Save profile error:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.old_password.trim()) {
      alert("Please enter your old password.");
      return;
    }

    if (!passwordData.new_password.trim()) {
      alert("Please enter your new password.");
      return;
    }

    if (passwordData.new_password.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const token = localStorage.getItem("access");

      const res = await fetch(API_URL("/api/change-password/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.detail || "Failed to change password");
      }

      alert("Password changed successfully.");

      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Change password error:", error);
      alert(error.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const hasProfilePhoto = Boolean(driver?.profile_photo_url);
  const hasLicenseCopy = Boolean(driver?.license_copy_url);
  const documentsComplete = hasProfilePhoto && hasLicenseCopy;

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!driver) {
    return <div style={emptyStateStyle}>No driver profile found.</div>;
  }

  return (
    <div>
      <div style={pageHeroStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={pageTitleStyle}>My Profile</h2>
            <p style={pageSubtitleStyle}>
              View your personal details, driver records, uploaded documents, and assigned vehicle information.
            </p>
          </div>

          <button
            onClick={handleOpenEdit}
            style={{
              ...primaryButtonStyle,
              whiteSpace: "nowrap",
            }}
          >
            Edit Profile
          </button>
        </div>

        <div style={loggedInPillStyle}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />
          Active Driver Profile
        </div>
      </div>

      {showEditForm && (
        <div
          style={{
            ...contentCardStyle,
            marginBottom: "24px",
            border: "1px solid #bfdbfe",
            background: "#f8fbff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h4 style={sectionTitleStyle}>Edit Profile</h4>
              <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                You can update your email and address here.
              </p>
            </div>

            <button
              onClick={handleCloseEdit}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={innerInfoCardStyle}>
              <label style={infoLabelStyle}>Username</label>
              <input
                type="text"
                value={formData.username}
                disabled
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  background: "#f1f5f9",
                }}
              />
            </div>

            <div style={innerInfoCardStyle}>
              <label style={infoLabelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                }}
              />
            </div>

            <div style={innerInfoCardStyle}>
              <label style={infoLabelStyle}>CNIC</label>
              <input
                type="text"
                value={formData.cnic}
                disabled
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  background: "#f1f5f9",
                }}
              />
            </div>

            <div style={innerInfoCardStyle}>
              <label style={infoLabelStyle}>License Number</label>
              <input
                type="text"
                value={formData.license_number}
                disabled
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  background: "#f1f5f9",
                }}
              />
            </div>

            <div
              style={{
                ...innerInfoCardStyle,
                gridColumn: "1 / -1",
              }}
            >
              <label style={infoLabelStyle}>Address</label>
              <textarea
                name="address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "18px" }}>
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              style={{
                ...primaryButtonStyle,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={contentCardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "22px",
              flexWrap: "wrap",
            }}
          >
            {hasProfilePhoto ? (
              <img
                src={driver.profile_photo_url}
                alt={driver.user_name || "Driver"}
                style={{
                  width: "78px",
                  height: "78px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #dbeafe",
                  boxShadow: "0 10px 24px rgba(59, 130, 246, 0.18)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  fontWeight: "700",
                  boxShadow: "0 10px 24px rgba(59, 130, 246, 0.25)",
                  flexShrink: 0,
                }}
              >
                {String(driver.user_name || "D").charAt(0).toUpperCase()}
              </div>
            )}

            <div style={{ minWidth: 0 }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "#0f172a",
                  wordBreak: "break-word",
                }}
              >
                {driver.user_name || "-"}
              </h4>
              <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                Registered Driver Account
              </p>

              <span
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  background: documentsComplete ? "#dcfce7" : "#fef3c7",
                  color: documentsComplete ? "#166534" : "#92400e",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Documents {documentsComplete ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>

          <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
            Personal Information
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              { label: "Name", value: driver.user_name || "-" },
              { label: "Username", value: user?.username || driver.user_name || "-" },
              { label: "Email", value: user?.email || driver?.email || "-" },
              { label: "Phone", value: "-" },
              { label: "CNIC", value: driver.cnic || "-" },
              { label: "License Number", value: driver.license_number || "-" },
              { label: "Address", value: driver.address || "-", full: true },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  ...innerInfoCardStyle,
                  gridColumn: item.full ? "1 / -1" : "auto",
                }}
              >
                <p style={infoLabelStyle}>{item.label}</p>
                <strong
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#0f172a",
                    fontSize: "15px",
                    wordBreak: "break-word",
                  }}
                >
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "20px",
            minWidth: 0,
          }}
        >
          <div style={contentCardStyle}>
            <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
              Uploaded Documents
            </h4>

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Profile Photo</p>
                <strong
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: hasProfilePhoto ? "#166534" : "#92400e",
                    fontSize: "15px",
                  }}
                >
                  {hasProfilePhoto ? "Uploaded" : "Not uploaded"}
                </strong>
              </div>

              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>License Copy</p>

                {hasLicenseCopy ? (
                  <a
                    href={driver.license_copy_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      padding: "9px 14px",
                      borderRadius: "10px",
                      background: "#2563eb",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    View License Copy
                  </a>
                ) : (
                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#92400e",
                      fontSize: "15px",
                    }}
                  >
                    Not uploaded
                  </strong>
                )}
              </div>

              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Document Status</p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    background: documentsComplete ? "#dcfce7" : "#fef3c7",
                    color: documentsComplete ? "#166534" : "#92400e",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {documentsComplete ? "Complete" : "Incomplete"}
                </span>
              </div>
            </div>
          </div>

          <div style={contentCardStyle}>
            <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
              Work Information
            </h4>

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Assigned Car</p>
                <strong
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#0f172a",
                    fontSize: "16px",
                    wordBreak: "break-word",
                  }}
                >
                  {assignedCar
                    ? `${assignedCar.make} ${assignedCar.model}`
                    : "No active car assigned"}
                </strong>
              </div>

              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Status</p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    background: "#dcfce7",
                    color: "#166534",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Active
                </span>
              </div>
            </div>
          </div>

          <div style={contentCardStyle}>
            <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
              Change Password
            </h4>

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={innerInfoCardStyle}>
                <label style={infoLabelStyle}>Old Password</label>
                <input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter old password"
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                  }}
                />
              </div>

              <div style={innerInfoCardStyle}>
                <label style={infoLabelStyle}>New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                  }}
                />
              </div>

              <div style={innerInfoCardStyle}>
                <label style={infoLabelStyle}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                  }}
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                style={{
                  ...primaryButtonStyle,
                  opacity: changingPassword ? 0.7 : 1,
                }}
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>

          <div style={contentCardStyle}>
            <h4 style={{ ...sectionTitleStyle, marginBottom: "18px" }}>
              Quick Overview
            </h4>

            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  ...innerInfoCardStyle,
                  background: "#eff6ff",
                  border: "1px solid #dbeafe",
                }}
              >
                <p style={infoLabelStyle}>Driver ID</p>
                <strong
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#0f172a",
                    fontSize: "16px",
                  }}
                >
                  {driver.id || "-"}
                </strong>
              </div>

              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Vehicle Condition</p>
                <strong
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#0f172a",
                    fontSize: "16px",
                    wordBreak: "break-word",
                  }}
                >
                  {assignedCar?.condition || "Not available"}
                </strong>
              </div>

              <div style={innerInfoCardStyle}>
                <p style={infoLabelStyle}>Registration Number</p>
                <strong
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#0f172a",
                    fontSize: "16px",
                    wordBreak: "break-word",
                  }}
                >
                  {assignedCar?.registration_number || "-"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;