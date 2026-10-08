import { useEffect, useState } from "react";
import axios from "axios";
import HotelCard from "./HotelCard";
import { useDispatch, useSelector } from "react-redux";
import { setHotels, deleteHotel } from "./store/hotelSlice";

function HotelList() {
  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 5;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(
          "https://hotel-management-samn.onrender.com/api/hotels",
          {
            params: {
              title: search,
              minPrice: minPrice,
              maxPrice: maxPrice,
              limit: hotelsPerPage,
              offset: (currentPage - 1) * hotelsPerPage,
            },
          },
        );
        dispatch(setHotels(response.data.hotels));
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, [search, minPrice, maxPrice, currentPage, dispatch]);

  const handleDelete = (deletedId) => {
    dispatch(deleteHotel(deletedId));
  };

  return (
    <div className="hotel-list-container">
      <div className="hotel-list-header">
        <div>
          <p className="page-label">DISCOVER YOUR STAY</p>
          <h1>Explore Hotels</h1>
          <p className="page-subtitle">
            Find the perfect hotel for your next stay
          </p>
        </div>
      </div>

      <div className="hotel-filters">
        <input
          type="text"
          placeholder="Search hotel by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setCurrentPage(1);
          }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="hotel-grid">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} onDelete={handleDelete} />
          ))
        ) : (
          <div className="no-hotels">
            <h2>No hotels found</h2>

            <p>Try changing your search or price filters.</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={hotels.length < hotelsPerPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HotelList;
