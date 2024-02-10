import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/message.js";

const router = express.Router();

router.get("/:convo_id", authMiddleware, getMessages);
router.post("/", trimRequest.all, authMiddleware, sendMessage);

export default router;
