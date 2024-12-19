import User from "../models/userModel.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import _ from "lodash";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";

const register = async (req, res) => {
  console.log("Entering registration...");

  const validSchema = Joi.object({
    name: Joi.string().min(3).max(40).required().messages({
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name is too long.",
      "any.required": "Name is required.",
    }),
    password: Joi.string().min(3).max(20).required().messages({
      "string.min": "Password must be at least 3 characters long.",
      "string.max": "Password is too long.",
      "any.required": "Password is required.",
    }),
    role: Joi.string().valid("user", "admin").required().messages({
      "any.only": "Role must be either 'user' or 'admin'.",
      "any.required": "Role is required.",
    }),
  });

  const validData = validSchema.validate(req.body);
  if (validData.error) {
    console.log("Validation error:", validData.error.details);
    return res.status(400).json({
      error: validData.error.details.map((err) => err.message),
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      password: hashedPassword,
      role: req.body.role,
    });

    const savedUser = await newUser.save();
    const userResponse = _.pick(savedUser, ["_id", "name", "role"]);

    // Generate JWT
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set JWT as a cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(201).json({
      user: userResponse,
      message: userResponse.name + " registerd successfuly",
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;

  const validSchema = Joi.object({
    name: Joi.string().min(3).max(40).required().messages({
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name is too long.",
      "any.required": "Name is required.",
    }),
    password: Joi.string().min(3).max(20).required().messages({
      "string.min": "Password must be at least 3 characters long.",
      "string.max": "Password is too long.",
      "any.required": "Password is required.",
    }),
  });

  const validData = validSchema.validate(req.body);
  if (validData.error) {
    return res.status(400).json({
      error: validData.error.details.map((err) => err.message),
    });
  }

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set JWT as a cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    const userResponse = _.pick(user, ["_id", "name"]);
    res.status(200).json({
      user: userResponse,
      message: userResponse.name + "login Successfuly",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { register, login };
