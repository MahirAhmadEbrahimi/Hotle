import mongoose from "mongoose";
import User from "./userModel.js";
import Hotel from "./hotelModel.js";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    checkInDate: {
      type: Date, // Changed to Date type
      required: true,
    },
    checkOutDate: {
      type: Date, // Changed to Date type
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
