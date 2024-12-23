import Hotel from "../models/hotelModel.js";
import Joi from "joi";
import _ from "lodash";

// Function to register a new hotel
export const registerHotel = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(40).required().messages({
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name is too long.",
      "any.required": "Name is required.",
    }),
    location: Joi.string().min(3).max(100).required().messages({
      "string.min": "Location must be at least 3 characters long.",
      "string.max": "Location is too long.",
      "any.required": "Location is required.",
    }),
    roomsAvailable: Joi.number().integer().min(0).required().messages({
      "number.base": "Rooms available must be a number.",
      "number.integer": "Rooms available must be an integer.",
      "number.min": "Rooms available cannot be negative.",
      "any.required": "Rooms available is required.",
    }),
    pricePerNight: Joi.number().precision(2).min(0).required().messages({
      "number.base": "Price per night must be a number.",
      "number.min": "Price per night cannot be negative.",
      "any.required": "Price per night is required.",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map((err) => err.message),
    });
  }

  const { name, location, roomsAvailable, pricePerNight } = req.body;

  const newHotel = new Hotel({
    name,
    location,
    roomsAvailable,
    pricePerNight,
  });

  try {
    const savedHotel = await newHotel.save();

    const hotelResponse = _.pick(savedHotel, [
      "_id",
      "name",
      "location",
      "roomsAvailable",
      "pricePerNight",
    ]);

    res.status(201).json({
      message: hotelResponse.name + " Hotel registered successfully",
      hotel: hotelResponse,
    });
  } catch (error) {
    console.error("Error registering hotel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get all hotels
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();

    // Use Lodash to pick only the desired fields from each hotel
    const hotelsResponse = hotels.map((hotel) =>
      _.pick(hotel, [
        "_id",
        "name",
        "location",
        "roomsAvailable",
        "pricePerNight",
      ])
    );

    res
      .status(200)
      .json({ totalHotels: hotelsResponse.length, hotels: hotelsResponse });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get a specific hotel by ID
export const getHotelById = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const hotelResponse = _.pick(hotel, [
      "_id",
      "name",
      "location",
      "roomsAvailable",
      "pricePerNight",
    ]);
    res.status(200).json(hotelResponse);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a specific hotel by ID
export const updateHotelById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).max(40).optional(),
    location: Joi.string().min(3).max(100).optional(),
    roomsAvailable: Joi.number().integer().min(0).optional(),
    pricePerNight: Joi.number().precision(2).min(0).optional(),
  });

  const { error } = schema.validate(updates);
  if (error) {
    return res.status(400).json({
      error: error.details.map((err) => err.message),
    });
  }

  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const hotelResponse = _.pick(updatedHotel, [
      "_id",
      "name",
      "location",
      "roomsAvailable",
      "pricePerNight",
    ]);
    res
      .status(200)
      .json({ message: "Hotel updated successfully", hotel: hotelResponse });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete a specific hotel by ID
export const deleteHotelById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedHotel = await Hotel.findByIdAndDelete(id);
    if (!deletedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to find a hotel by name
export const findHotelByName = async (req, res) => {
  const name = req.body.name;

  try {
    // Ensure name is provided
    if (!name) {
      return res.status(400).json({ error: "Hotel name is required" });
    }

    const hotels = await Hotel.find({ name: { $regex: name, $options: "i" } }); // Case-insensitive search

    // Use Lodash to pick only the desired fields from each hotel
    const hotelsResponse = hotels.map((hotel) =>
      _.pick(hotel, [
        "_id",
        "name",
        "location",
        "roomsAvailable",
        "pricePerNight",
      ])
    );

    if (hotelsResponse.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found with that name" });
    }

    res
      .status(200)
      .json({ totalHotels: hotelsResponse.length, hotels: hotelsResponse });
  } catch (error) {
    console.error("Error finding hotel by name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
