import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import "../styles/TravelList.css";
import TravelItem from "../components/TravelItem"; // 导入 TravelItem 组件
import { addToQueue } from "../utils/offlineQueue";

const TravelList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取数据
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/trips`);
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // 删除操作
  const handleDelete = async (id) => {
    if (!navigator.onLine) {
      addToQueue({ type: "DELETE", id });
      alert("Trip queued for deletion when back online.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this trip?");
    if (!confirm) return;

    try {
      await axios.delete(`${BASE_URL}/api/trips/${id}`);
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
    } catch (err) {
      console.error("Failed to delete trip:", err);
      alert("Failed to delete trip.");
    }
  };

  // 更新操作
  const handleUpdate = (trip) => {
    if (!navigator.onLine) {
      addToQueue({ type: "UPDATE", trip });
      alert("Update queued for when you’re back online.");
      return;
    }
    console.log("Update trip clicked:", trip);
  };

  return (
    <div className="travel-list">
      <h2>My Travel Diary</h2>
      {loading ? (
        <p>Loading trips...</p>
      ) : trips.length === 0 ? (
        <p>No trips added yet.</p>
      ) : (
        <div className="card-grid">
          {trips.map((trip) => (
            <TravelItem
              key={trip.id}
              trip={trip}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelList;