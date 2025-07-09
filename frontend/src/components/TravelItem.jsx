import "../styles/TravelItem.css"; // 样式文件

// TravelItem 是一个用于展示单条旅行数据的卡片组件
const TravelItem = ({ trip, onDelete, onUpdate }) => {
  // 删除操作
  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (confirmDelete) {
      onDelete(trip.id); // 根据 id 删除
    }
  };

  return (
    <div className="travel-card">
      {/* 图片占位逻辑（如有指定图片） */}
      <div className="card-body">
        {/* 旅行名称 */}
        <h3>{trip.name}</h3>

        {/* 完成状态 */}
        <p>{trip.completed ? "Status: Completed" : "Status: Incomplete"}</p>

        {/* 地理位置信息 */}
        {trip.location && (
          <div>
            <p>Latitude: {trip.location.latitude || "N/A"}</p>
            <p>Longitude: {trip.location.longitude || "N/A"}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="card-actions">
          <button onClick={() => onUpdate(trip)}>Update</button>
          <button className="danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TravelItem;