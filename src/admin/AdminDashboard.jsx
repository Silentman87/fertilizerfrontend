import React, { useState, useEffect } from "react";
import { Plus, Package, Calendar, Hash, Scale, DollarSign, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stock");
  const [fertilizers, setFertilizers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFertilizer, setNewFertilizer] = useState({
    name: "",
    price: "",
    expiryDate: "",
    weight: "",
    currentStock: "",
    batchNo: "",
    type: "",
  });

  // ✅ Fetch fertilizers from DB
  const fetchFertilizers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getfertilizer/`
      );
      setFertilizers(res.data);
    } catch (err) {
      console.error("Error fetching fertilizers:", err);
    }
  };

  // ✅ Fetch farmer requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getallrequest`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // ✅ Call both on mount
  useEffect(() => {
    fetchFertilizers();
    fetchRequests();
  }, []);

  // ✅ Handle Add Fertilizer
  const handleAddFertilizer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/addfertilizer`,
        newFertilizer
      );
      setShowAddModal(false);
      setNewFertilizer({
        name: "",
        price: "",
        expiryDate: "",
        weight: "",
        currentStock: "",
        batchNo: "",
        type: "",
      });
      fetchFertilizers(); // refresh list
    } catch (err) {
      console.error("Error adding fertilizer:", err);
    }
  };

  // ✅ Approve / Reject Request
  const handleRequestAction = (id, action) => {
    setRequests((prev) =>
      prev.map((req) =>
        req._id === id ? { ...req, status: action } : req
      )
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
        🌱 Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 mb-8">
        {["stock", "requests"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 px-2 text-lg font-medium transition ${
              activeTab === tab
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "stock" ? "📦 Fertilizer Stock" : "👨‍🌾 Farmer Requests"}
          </button>
        ))}
      </div>

      {/* Stock Tab */}
      {activeTab === "stock" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Available Stock</h2>
            <button
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Fertilizer
            </button>
          </div>

          {/* Fertilizer Cards */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fertilizers.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border bg-white shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {item.name} <span className="text-sm text-gray-500">({item.type})</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center text-gray-600"><DollarSign className="w-4 h-4 mr-1" /> Price:</span>
                    <span className="font-medium text-black">₹{item.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center text-gray-600"><Scale className="w-4 h-4 mr-1" /> Weight:</span>
                    <span className="font-medium text-black">{item.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center text-gray-600"><Package className="w-4 h-4 mr-1" /> Stock:</span>
                    <span className="font-medium text-black">{item.currentStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center text-gray-600"><Hash className="w-4 h-4 mr-1" /> Batch No:</span>
                    <span className="font-medium text-black">{item.batchNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center text-gray-600"><Calendar className="w-4 h-4 mr-1" /> Expiry:</span>
                    <span
                      className={`font-medium ${
                        new Date(item.expiryDate) < new Date() ? "text-red-600" : "text-black"
                      }`}
                    >
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Farmer Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-600">No requests found.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-white rounded-2xl shadow flex justify-between items-center border hover:shadow-lg transition"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-indigo-500" />
                      {req.farmer?.username} (📞 {req.farmer?.mobile})
                    </h3>
                    <p className="text-sm text-gray-500">
                      🏠 {req.farmer?.society}, {req.farmer?.village}
                    </p>
                    <p className="text-sm text-gray-600">
                      🌾 {req.fertilizer?.name} ({req.fertilizer?.type})
                    </p>
                    <p className="font-semibold text-black">
                      Qty: {req.quantity}
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 mt-2 text-xs font-medium rounded-full ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {req.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                      {req.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                      {req.status}
                    </span>
                  </div>

                  {req.status === "pending" && (
                    <div className="space-x-2">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        onClick={() =>
                          handleRequestAction(req._id, "approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        onClick={() =>
                          handleRequestAction(req._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Fertilizer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                <Plus className="inline mr-2 text-blue-600" size={22} /> Add New Fertilizer
              </h3>
              <form
                onSubmit={handleAddFertilizer}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {["name", "type", "price", "weight", "currentStock", "batchNo", "expiryDate"].map((field) => (
                  <div key={field} className={field === "expiryDate" ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "price" || field === "weight" || field === "currentStock" ? "number" : field === "expiryDate" ? "date" : "text"}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                      value={newFertilizer[field]}
                      onChange={(e) =>
                        setNewFertilizer({ ...newFertilizer, [field]: field === "price" || field === "weight" || field === "currentStock" ? Number(e.target.value) : e.target.value })
                      }
                      required
                    />
                  </div>
                ))}
                <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow"
                  >
                    Add Fertilizer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
