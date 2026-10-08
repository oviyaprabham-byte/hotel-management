import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addHotel, updateHotel } from "./store/hotelSlice";

function HotelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (id) {
      axios
        .get(`https://hotel-management-samn.onrender.com/api/hotels/${id}`)
        .then((response) => {
          const hotel = response.data;

          setTitle(hotel.title);
          setDescription(hotel.description);
          setLatitude(hotel.latitude);
          setLongitude(hotel.longitude);
          setPrice(hotel.price);

          if (hotel.image) {
            setImagePreview(
              `https://hotel-management-samn.onrender.com/uploads/${hotel.image}`,
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching hotel:", error);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please enter a title");
      return;
    }

    if (!price) {
      alert("Please enter a price");
      return;
    }

    if (Number(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }

    formData.append("title", title);
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("price", price);

    try {
      if (id) {
        const response = await axios.put(
          `https://hotel-management-samn.onrender.com/api/hotels/${id}`,
          formData,
        );

        dispatch(updateHotel(response.data));

        alert("Hotel updated successfully!");

        navigate("/");
      } else {
        const response = await axios.post(
          "https://hotel-management-samn.onrender.com/api/hotels",
          formData,
        );

        dispatch(addHotel(response.data));

        alert("Hotel added successfully!");

        navigate("/");
      }
    } catch (error) {
      console.error("Error saving hotel:", error);

      alert("Failed to save hotel");
    }
  };

  return (
    <div className="hotel-form-container">
      <div className="form-page-header">
        <p className="page-label">HOTEL MANAGEMENT</p>

        <h1>{id ? "Edit Hotel" : "Add New Hotel"}</h1>

        <p className="form-subtitle">
          {id
            ? "Update the hotel information below"
            : "Add a new hotel to your collection"}
        </p>
      </div>

      <form className="hotel-form" onSubmit={handleSubmit}>
        {/* Image */}
        <div className="form-section">
          <label>Hotel Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                setImage(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Hotel Preview"
              className="image-preview"
            />
          )}
        </div>

        {/* Hotel Title */}
        <div className="form-section">
          <label>Hotel Title</label>

          <input
            type="text"
            placeholder="Enter hotel name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="form-section">
          <label>Description</label>

          <textarea
            placeholder="Enter hotel description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="location-section">
          <div className="form-section">
            <label>Latitude</label>

            <input
              type="number"
              step="any"
              placeholder="Example: 13.0827"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>

          <div className="form-section">
            <label>Longitude</label>

            <input
              type="number"
              step="any"
              placeholder="Example: 80.2707"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        {/* Price */}
        <div className="form-section">
          <label>Price per Night</label>

          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>

          <button type="submit" className="submit-btn">
            {id ? "Update Hotel" : "Add Hotel"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HotelForm;
