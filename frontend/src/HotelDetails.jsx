import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    axios
      .get(`https://hotel-management-samn.onrender.com/api/hotels/${id}`)
      .then((response) => {
        setHotel(response.data);
      })
      .catch((error) => {
        console.error("Error fetching hotel:", error);
      });
  }, [id]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User Latitude:", position.coords.latitude);
          console.log("User Longitude:", position.coords.longitude);
        },
        (error) => {
          console.log("Location permission denied or unavailable");
        },
      );
    }
  }, []);

  if (!hotel) {
    return (
      <div className="hotel-loading">
        <p>Loading hotel details...</p>
      </div>
    );
  }

  return (
    <div className="hotel-details-page">
      <Helmet>
        <title>{hotel.title} - HotelNest</title>
        <meta name="description" content={hotel.description} />
      </Helmet>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Hotels
      </button>

      <div className="hotel-details-container">
        <div className="details-image-section">
          {hotel.image ? (
            <img
              src={`https://hotel-management-samn.onrender.com/uploads/${hotel.image}`}
              alt={hotel.title}
              className="hotel-details-image"
            />
          ) : (
            <div className="details-no-image">No Image Available</div>
          )}
        </div>

        <div className="details-content">
          <p className="page-label">HOTEL DETAILS</p>
          <h1>{hotel.title}</h1>
          <p className="details-description">{hotel.description}</p>

          <div className="details-price">
            ₹{hotel.price}
            <span> / night</span>
          </div>

          <div className="location-card">
            <h3>Location</h3>

            <div className="coordinates">
              <div>
                <span>Latitude</span>
                <strong>{hotel.latitude}</strong>
              </div>

              <div>
                <span>Longitude</span>
                <strong>{hotel.longitude}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="map-section">
        <h2>Hotel Location</h2>

        <iframe
          className="hotel-map"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
            Number(hotel.longitude) - 0.01
          }%2C${Number(hotel.latitude) - 0.01}%2C${
            Number(hotel.longitude) + 0.01
          }%2C${Number(hotel.latitude) + 0.01}&layer=mapnik&marker=${
            hotel.latitude
          }%2C${hotel.longitude}`}
          title="Hotel Location Map"
        ></iframe>
      </div>
    </div>
  );
}

export default HotelDetails;
