import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const farmerid = localStorage.getItem("farmerid");
      if (!farmerid) {
        console.warn("⚠️ No farmerid found in localStorage");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getactivities/${farmerid}`
      );

      // filter only approved/rejected requests
      const filtered = res.data.activities.filter((a) =>
        ["approved", "rejected"].includes(a.status)
      );

      setNotifications(filtered);
    } catch (err) {
      console.error("Error fetching notifications:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <p className="text-gray-600">Loading notifications...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-lg shadow-md border-l-4 ${
                n.status === "approved"
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <p className="font-semibold">
                Request <span className="text-indigo-600">#{n._id}</span>{" "}
                {n.status === "approved" ? "✅ Approved" : "❌ Rejected"}
              </p>
              {n.adminRemark && (
                <p className="text-gray-700 mt-1">
                  <strong>Admin Remark:</strong> {n.adminRemark}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Fertilizer: {n.fertilizer?.name || "N/A"} | Quantity:{" "}
                {n.quantity}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Updated on {new Date(n.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationTab;
