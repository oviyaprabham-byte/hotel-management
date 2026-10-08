import { useNavigate } from "react-router-dom";
import axios from "axios";

function HotelCard({ hotel, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?",
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/hotels/${hotel.id}`);
      alert("Hotel deleted successfully!");
      onDelete(hotel.id);
    } 
    catch (error) {
      console.error("Error deleting hotel:", error);
      alert("Failed to delete hotel");
    }
  };

  return (
    <div className="hotel-card" onClick={() => navigate(`/hotel/${hotel.id}`)}>
      {hotel.image ? (
        <img
          src={`http://localhost:5000/uploads/${hotel.image}`}
          alt={hotel.title}
          className="hotel-image"
        />
      ) : (
        <div className="hotel-no-image">No Image</div>
      )}

      <div className="hotel-content">
        <h2>{hotel.title}</h2>
        <p>{hotel.description}</p>
        <p className="hotel-price">₹{hotel.price}</p>

        <div className="hotel-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit-hotel/${hotel.id}`);
            }}
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
