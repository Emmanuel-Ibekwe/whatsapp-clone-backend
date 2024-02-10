import createHttpError from "http-errors";
import { updateLatestmessage } from "../services/conversation.js";
import {
  createMessage,
  getConvoMessages,
  populateMessage
} from "../services/message.js";

export const sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { message, convo_id, files } = req.body;
    if (!convo_id || (!message && !files)) {
      res.status(400).json({ message: "fields not set" });
    }

    const msgData = {
      sender: user_id,
      message,
      conversation: convo_id,
      files: files || []
    };

    let newMessage = await createMessage(msgData);
    const populatedMessage = await populateMessage(newMessage._id);
    await updateLatestmessage(convo_id, newMessage);
    res.status(200).json(populatedMessage);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const convo_id = req.params.convo_id;
    if (!convo_id)
      throw createHttpError.BadRequest("conversation id not provided.");

    const convoMessages = await getConvoMessages(convo_id);
    res.status(200).json(convoMessages);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};
