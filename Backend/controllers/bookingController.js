import Booking from "../models/bookingModel.js"; // Import the Booking model
import Joi from "joi";
import _ from "lodash"; // Import Lodash

// Create a new booking
export const createBooking = async (req, res) => {
  const bookingSchema = Joi.object({
    userId: Joi.string().required(),
    // hotelId will be taken from the route parameter
    checkInDate: Joi.date().required(),
    checkOutDate: Joi.date().greater(Joi.ref("checkInDate")).required(),
    totalPrice: Joi.number().min(0).required(),
  });

  const { error } = bookingSchema.validate(req.body); // Validate incoming data

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { userId } = req.body; // Extract userId from request body
    const hotelId = req.params.id; // Extract hotelId from route parameters
    const { checkInDate, checkOutDate, totalPrice } = req.body;

    const newBooking = new Booking({
      userId,
      hotelId,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const savedBooking = await newBooking.save();

    // Use Lodash to pick specific fields
    const response = _.pick(savedBooking.toObject(), [
      "_id",
      "userId",
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
