import express from "express";
import authRoutes from "./auth.js";
import conversationRoutes from "./conversation.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/conversation", conversationRoutes);

export default router;
