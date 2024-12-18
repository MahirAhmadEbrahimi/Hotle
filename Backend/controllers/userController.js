import User from "../models/userModel.js";
import Joi from "joi";

const register = (req, res) => {
  res.send(req.body);
};

export { register };
