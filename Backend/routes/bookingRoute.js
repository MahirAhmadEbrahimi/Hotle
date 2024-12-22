import express from "express";
import {
  createBooking,
  getUserBookings,
  deleteUserBookings,
} from "../controllers/bookingController.js"; // Ensure the correct path
import { authenticateToken } from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Route for creating a new booking associated with a specific hotel
router.post("/hotels/:id/bookings", authenticateToken, createBooking);
router.get("/users/bookings", authenticateToken, getUserBookings);
router.delete("/users/bookings/:id", authenticateToken, deleteUserBookings); // Changed to DELETE

export default router;
