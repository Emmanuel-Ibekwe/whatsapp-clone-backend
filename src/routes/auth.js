import express from "express";
import trimRequest from "trim-request";
import { register, refreshToken, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", trimRequest.all, register);
router.post("/login", trimRequest.all, login);
router.post("/logout", trimRequest.all, logout);
router.post("/refreshToken", trimRequest.all, refreshToken);

export default router;

