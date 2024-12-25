import express from "express";
import {
  registerHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
  findHotelByName,
  getHotelByTitle,
} from "../controllers/hotelController.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Route to register a new hotel
router.post("/", authenticateToken, authorizeAdmin, registerHotel);

// Protected route to get all hotels
router.get("/", authenticateToken, authorizeAdmin, getAllHotels);

// Protected route to get a specific hotel by ID
router.get("/:id", authenticateToken, authorizeAdmin, getHotelById);

// Protected route to update a specific hotel by ID
router.put("/:id", authenticateToken, authorizeAdmin, updateHotelById);

// Protected route to delete a specific hotel by ID
router.delete("/:id", authenticateToken, authorizeAdmin, deleteHotelById);

// Protected route to find hotels by name for logged-in users
router.post("/search", authenticateToken, findHotelByName);
router.post("/findHotle", authenticateToken, getHotelByTitle);

export default router;
