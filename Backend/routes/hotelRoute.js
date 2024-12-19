import express from "express";
import {
  registerHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
  findHotelByName,
} from "../controllers/hotelController.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Route to register a new hotel
router.post("/", authenticateToken, authorizeAdmin, registerHotel); // POST api/v1/hotels

// Protected route to get all hotels
router.get("/", authenticateToken, authorizeAdmin, getAllHotels); // GET api/v1/hotels

// Protected route to get a specific hotel by ID
router.get("/:id", authenticateToken, authorizeAdmin, getHotelById); // GET api/v1/hotels/:id

// Protected route to update a specific hotel by ID
router.put("/:id", authenticateToken, authorizeAdmin, updateHotelById); // PUT api/v1/hotels/:id

// Protected route to delete a specific hotel by ID
router.delete("/:id", authenticateToken, authorizeAdmin, deleteHotelById); // DELETE api/v1/hotels/:id

// Protected route to find hotels by name for logged-in users
router.get("/search", authenticateToken, findHotelByName); // GET api/v1/hotels/search?name=<hotel-name>

export default router;
