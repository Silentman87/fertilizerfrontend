import React, { useEffect, useState } from "react";
import { Package, Layers, Barcode, ShoppingCart } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const FertilizerTab = () => {
  const [fertilizers, setFertilizers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [capacities, setCapacities] = useState({});

  // ✅ Fetch fertilizers from backend
  useEffect(() => {
    const fetchFertilizers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getfertilizer`
        );
        setFertilizers(res.data);
      } catch (err) {
        console.error("Error fetching fertilizers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFertilizers();
  }, []);
 
  // capacity set for particular fertilizer 
  const handleCapacityChange = (fertilizerId, value) => {
  setCapacities((prev) => ({
    ...prev,
    [fertilizerId]: value,
  }));
};

  // ✅ Send fertilizer application request
  const handleApply = async (fertilizerId) => {
    const capacity = capacities[fertilizerId] || 0;
    if(!capacity || capacity<=0)
    {
      alert('please insert valid capacity');
      return ;
    }
    setApplyingId(fertilizerId);
    try {
      const token = localStorage.getItem("token"); 

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createrequest`,
        {
         // TODO: Replace with logged-in farmer ID
          fertilizerId,
          quantity: capacity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const activityId = res.data.activity._id;
      alert("Application submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send request");
    } finally {
      setApplyingId(null);
    }
    
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <Package size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Available Fertilizers</h2>
          <p className="text-gray-500 text-sm">Browse and request fertilizers</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading fertilizers...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fertilizers.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No fertilizers available.
            </p>
          ) : (
            fertilizers.map((f) => (
              <div
                key={f._id}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition bg-white"
              >
                <h3 className="text-lg font-semibold text-indigo-600 mb-2 flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-indigo-500" />
                  {f.name}
                </h3>
                <p className="text-gray-600 flex items-center text-sm">
                  <Barcode className="h-4 w-4 mr-2" /> Batch: {f.batchNo}
                </p>
                <p className="text-gray-600 text-sm">Type: {f.type}</p>
                <p className="text-gray-800 font-semibold">₹{f.price}</p>
                <p className="text-gray-800 text-sm">Weight: {f.weight} kg</p>
                <p
                  className={`mt-1 font-bold text-sm ${
                    f.currentStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Stock: {f.currentStock > 0 ? f.currentStock : "Out of stock"}
                </p>
                
                    <div className="mt-3">
                        <div className="mt-3">
                         <label className="block text-sm text-gray-600 font-medium mb-1">Capacity (kg)</label>
                         <input
                                type="number"
                                  value={capacities[f._id] || ""}
                                  onChange={(e) => handleCapacityChange(f._id,e.target.value)}
                                   min="1"
                                   max={f.currentStock}
                                    className="w-full border rounded-md p-2 border-black text-gray-800"
                                    placeholder="enter capacity"
                                    required
                                        />
                                  </div>  
                                  </div>
               
                <button
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={f.currentStock <= 0 || applyingId === f._id}
                  onClick={() => handleApply(f._id)}
                >
                  {applyingId === f._id ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Request
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FertilizerTab;
