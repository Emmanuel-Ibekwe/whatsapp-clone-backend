import createHttpError from "http-errors";
import logger from "../configs/logger.js";
import {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populateConversation
} from "../services/conversation.js";

export const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id, isGroup } = req.body;
    if (isGroup === false) {
      if (!receiver_id) {
        throw createHttpError.BadRequest("receiver id not provided.");
      }

      const existingConversation = await doesConversationExist(
        sender_id,
        receiver_id,
        false
      );

      if (existingConversation) {
        res.status(200).json(existingConversation);
      } else {
        // creates new conversation
        let convoData = {
          name: "conversation name",
          picture: "conversation picture",
          isGroup: false,
          users: [sender_id, receiver_id]
        };

        const newConvo = await createConversation(convoData);
        const populatedConvo = await populateConversation(
          newConvo._id,
          "users",
          "-password"
        );

        res.status(200).json(populatedConvo);
      }
    } else {
      const existingConversation = await doesConversationExist("", "", isGroup);
      res.status(200).json(existingConversation);
    }
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversations = await getUserConversations(userId);
    res.status(200).json(conversations);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const { name, users } = req.body;
    users.push(req.user.userId);
    if (!name || !users) {
      throw createHttpError.BadRequest("Please fill all fields");
    }
    if (users.length < 2) {
      throw createHttpError.BadRequest(
        "Atleast 2 users are required to start a group chat."
      );
    }

    let convoData = {
      name,
      users,
      isGroup: true,
      admin: req.user.userId,
      picture: process.env.DEFAULT_GROUP_PICTURE
    };

    const newConvo = await createConversation(convoData);
    const populatedConvo = await populateConversation(
      newConvo._id,
      "users admin",
      "-password"
    );

    res.status(200).json(populatedConvo);
  } catch (error) {}
};
