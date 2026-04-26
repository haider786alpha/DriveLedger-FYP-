import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    drivers: 0,
    cars: 0,
    payments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

 const fetchStats = async () => {
  try {
    const [driversRes, carsRes, paymentsRes] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/drivers/"),
      axios.get("http://127.0.0.1:8000/api/cars/"),
      axios.get("http://127.0.0.1:8000/api/payments/"),
    ]);

    const getLength = (data) => {
      if (Array.isArray(data)) return data.length;
      if (data?.results) return data.results.length;
      if (data?.data && Array.isArray(data.data)) return data.data.length;
      if (data?.data?.results) return data.data.results.length;
      return 0;
    };

    setStats({
      drivers: getLength(driversRes),
      cars: getLength(carsRes),
      payments: getLength(paymentsRes),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
  }
};

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h4 className="mb-4">DriveLedger Dashboard</h4>

        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h5>Total Drivers</h5>
                <h2>{stats.drivers}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h5>Total Cars</h5>
                <h2>{stats.cars}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h5>Total Payments</h5>
                <h2>{stats.payments}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;