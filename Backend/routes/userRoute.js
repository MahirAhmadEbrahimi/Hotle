import express from "express";
const router = express.Router();

import { register, login } from "../controllers/userController.js";

router.route("/register").post(register);
router.route("/Login").post(login);

export default router;
