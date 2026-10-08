import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HotelForm from "./HotelForm";
import HotelList from "./HotelList";
import HotelDetails from "./HotelDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HotelList />} />
        <Route path="/add-hotel" element={<HotelForm />} />
        <Route path="/edit-hotel/:id" element={<HotelForm />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
