import React, { useState, useEffect } from "react";
import axios from "axios";

const ProposalTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState([]);

  const fetchRequests = async () => {
    try {
      const farmerid = localStorage.getItem("farmerid"); // ✅ fix
      console.log("Farmer ID:", farmerid);
      if (!farmerid) {
        console.error("No farmerid found in localStorage");
        setIsLoading(false);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getfarmerrequest/${farmerid}`
      );

      console.log("API Response:", res.data);
      setProposals(res.data);
    } catch (error) {
      console.error("Error fetching farmer requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []); // ✅ fix (only run once)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Proposals</h2>

      {isLoading && <p className="text-gray-600">Loading proposals...</p>}

      {!isLoading && proposals.length === 0 && (
        <p className="text-gray-500">No proposals found.</p>
      )}

      {!isLoading && proposals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((req) => (
            <div
              key={req._id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {req.fertilizer?.name} ({req.fertilizer?.type})
              </h3>
              <div className="text-gray-700 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Price:</span> ₹
                  {req.fertilizer?.price}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span> {req.quantity}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      req.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};  

export default ProposalTab;
