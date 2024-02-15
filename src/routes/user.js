import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import { searchUsers } from "../controllers/user.js";

router.get("/", authMiddleware, searchUsers);

export default router;
