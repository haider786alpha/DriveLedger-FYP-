const Profile = () => {
  const driver = {
    name: "Ali Khan",
    username: "alikhan",
    email: "ali@driveledger.com",
    phone: "0300-1234567",
    cnic: "35202-1234567-1",
    address: "Rawalpindi, Pakistan",
    assignedCar: "Toyota Corolla",
    status: "Active",
  };

  return (
    <div>
      <h2>My Profile</h2>
      <p>View your personal information and assigned details.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Personal Information</h4>
          <p><strong>Name:</strong> {driver.name}</p>
          <p><strong>Username:</strong> {driver.username}</p>
          <p><strong>Email:</strong> {driver.email}</p>
          <p><strong>Phone:</strong> {driver.phone}</p>
          <p><strong>CNIC:</strong> {driver.cnic}</p>
          <p><strong>Address:</strong> {driver.address}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <h4>Work Information</h4>
          <p><strong>Assigned Car:</strong> {driver.assignedCar}</p>
          <p><strong>Status:</strong> {driver.status}</p>

          <button
            style={{
              marginTop: "10px",
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
      </div>
    </div>
  );
};

export default Profile;