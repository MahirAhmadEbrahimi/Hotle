import Booking from "../models/bookingModel.js"; // Import the Booking model
import Joi from "joi";
import _ from "lodash"; // Import Lodash
import axios from "axios"; // Import Axios

// Function to search for hotels by name
const searchHotels = async (req, d) => {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization?.split(" ")[1]; // Get the token (Bearer token)

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await axios.post(
      "http://localhost:4455/api/v1/hotels/findHotle", // Corrected the endpoint
      {
        hotelName: d, // Use the parameter d directly
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Hotel search response:", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error searching for hotels:", error.message);
    throw new Error("Failed to search for hotels.");
  }
};
// Create a new booking
export const createBooking = async (req, res) => {
  const bookingSchema = Joi.object({
    hotelName: Joi.string().required(), // Expect hotel name in the request body
    checkInDate: Joi.date().required(),
    checkOutDate: Joi.date().greater(Joi.ref("checkInDate")).required(),
    totalPrice: Joi.number().min(0).required(),
  });

  const { error } = bookingSchema.validate(req.body); // Validate incoming data

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { hotelName, checkInDate, checkOutDate, totalPrice } = req.body; // Extract data from request body

    const hotels = await searchHotels(req, hotelName);

    if (!hotels || hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotel found with the given name." });
    }

    const hotelId = hotels._id; // Take the first matched hotel ID
    const userId = req.user.id;

    const newBooking = new Booking({
      hotelId,
      userId,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const savedBooking = await newBooking.save();

    // Use Lodash to pick specific fields
    const response = _.pick(savedBooking.toObject(), [
      "_id",
      "hotelId",
      "checkInDate",
      "checkOutDate",
      "totalPrice",
    ]);

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all bookings for logged-in user
export const getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.find({ userId }).populate("hotelId");
    res.status(200).json({
      "Booking: ": bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a specific booking for the logged-in user
export const deleteUserBookings = async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or does not belong to user." });
    }

    await Booking.deleteOne({ _id: bookingId });

    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
