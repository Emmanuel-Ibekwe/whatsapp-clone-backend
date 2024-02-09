import createHttpError from "http-errors";
import Message from "../models/message.js";

export const createMessage = async data => {
  const newMessage = await Message.create(data);
  if (!newMessage)
    throw createHttpError.BadRequest("creating new message failed.");
  return newMessage;
};

export const populateMessage = async id => {
  let msg = await Message.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "User"
    })
    .populate({
      path: "conversation",
      select: "name picture inGroup users",
      model: "Conversation",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "User"
      }
    });

  if (!msg) throw createHttpError.BadRequest("populating message failed.");
  return msg;
};

export const getConvoMessages = async convo_id => {
  const convoMessages = await Message.find({ conversation: convo_id })
    .populate("sender", "name picture email status")
    .populate("conveersation");

  if (!convoMessages)
    throw createHttpError.BadRequest("getting conversation messages failed.");
  return convoMessages;
};
