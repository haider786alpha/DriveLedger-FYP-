const AssignedCar = () => {
  const car = {
    name: "Toyota Corolla",
    model: "2020",
    number: "ABC-123",
    color: "White",
    status: "Active",
    dailyRent: "Rs. 3,000",
    assignedDate: "10 April 2026",
  };

  return (
    <div>
      <h2>Assigned Car</h2>
      <p>Details of the car assigned to you.</p>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          maxWidth: "500px",
        }}
      >
        <h4>{car.name}</h4>

        <p><strong>Model:</strong> {car.model}</p>
        <p><strong>Car Number:</strong> {car.number}</p>
        <p><strong>Color:</strong> {car.color}</p>
        <p><strong>Status:</strong> {car.status}</p>
        <p><strong>Daily Rent:</strong> {car.dailyRent}</p>
        <p><strong>Assigned Date:</strong> {car.assignedDate}</p>

        <button
          style={{
            marginTop: "10px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#10b981",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          View History
        </button>
      </div>
    </div>
  );
};

export default AssignedCar;