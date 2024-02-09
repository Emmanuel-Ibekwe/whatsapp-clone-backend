import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  create_open_conversation,
  getConversations,
  createGroup
} from "../controllers/conversation.js";
const router = express.Router();

router.post("/", trimRequest.all, authMiddleware, create_open_conversation);
router.get("/", trimRequest.all, authMiddleware, getConversations);
router.post("/group", trimRequest.all, authMiddleware, createGroup);

export default router;
