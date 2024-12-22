import express from "express";
const router = express.Router();

import { register, login, getAllUsers } from "../controllers/userController.js";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/authMiddleware.js"; // Import middleware

router.route("/register").post(register);
router.route("/Login").post(login);
router.route("/").get(authenticateToken, authorizeAdmin, getAllUsers);

export default router;
