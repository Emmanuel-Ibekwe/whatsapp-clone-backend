import express from "express";
import trimRequest from "trim-request";
import { signup, refreshToken, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", trimRequest.all, signup);
router.post("/login", trimRequest.all, login);
router.post("/logout", trimRequest.all, logout);
router.post("/refreshToken", trimRequest.all, refreshToken);

export default router;
