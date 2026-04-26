import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/");
      setNotifications(res);
    } catch (error) {
      console.error("Notifications error:", error);
      setNotifications([]);
    }
  };

  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm("Delete this notification?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/notifications/${id}/`);
      alert("Notification deleted");
      fetchNotifications();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete notification");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
         <h4 className="mb-0">Notifications</h4>

         <Link to="/add-notification" className="btn btn-primary">
          Create Notification
         </Link>
        </div>

        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.message}</td>
                      <td>{item.notification_type}</td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteNotification(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No notifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;