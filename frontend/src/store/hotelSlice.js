import { createSlice } from "@reduxjs/toolkit";

const hotelSlice = createSlice({
  name: "hotels",

  initialState: [],

  reducers: {
    setHotels: (state, action) => {
      return action.payload;
    },

    addHotel: (state, action) => {
      state.push(action.payload);
    },

    deleteHotel: (state, action) => {
      return state.filter((hotel) => hotel.id !== action.payload);
    },
    updateHotel: (state, action) => {
      const index = state.findIndex((hotel) => hotel.id === action.payload.id);

      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setHotels, addHotel, deleteHotel, updateHotel } = hotelSlice.actions;

export default hotelSlice.reducer;
