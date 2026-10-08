import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/")}>
           HotelNest
        </div>
        <nav className="navbar-links">
          <button onClick={() => navigate("/")}>Explore Hotels</button>

          <button
            className="add-hotel-btn"
            onClick={() => navigate("/add-hotel")}
          >
            + Add Hotel
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
