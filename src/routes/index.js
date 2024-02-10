import express from "express";
import authRoutes from "./auth.js";
import conversationRoutes from "./conversation.js";
import messageRoutes from "./message.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/conversation", conversationRoutes);
router.use("/message", messageRoutes);

export default router;
