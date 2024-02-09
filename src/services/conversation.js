import createHttpError from "http-errors";
import Conversation from "../models/conversation.js";
import User from "../models/user.js";

export const doesConversationExist = async (senderId, receiverId, isGroup) => {
  if (isGroup === false) {
    let convos = await Conversation.find({
      isGroup: false,
      $and: [
        { users: { $elemMatch: { $eq: senderId } } },
        { users: { $elemMatch: { $eq: receiverId } } }
      ]
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // console.log("convos: ", convos);
    if (!convos) {
      // return undefined;
      throw createHttpError.BadRequest("retrieving conversation failed.");
    }

    convos = await User.populate(convos, {
      path: "latestMessage.sender",
      select: "name, email, picture, status"
    });

    return convos[0];
  } else {
    // if group chat exists
    let convo = await Conversation.findById(isGroup)
      .populate("users admin", "-password")
      .populate("latestMessage");
    if (!convo) {
      throw createHttpError.BadRequest("retrieving conversation failed.");
    }

    convo = await User.populate(convo, {
      path: "latestMessage.sender",
      select: "name email picture status"
    });

    return convo;
  }
};

export const createConversation = async data => {
  const newConvo = await Conversation.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest("Creating conversation failed.");
  return newConvo;
};

export const populateConversation = async (
  id,
  pathToPopulate,
  fieldsToRemove
) => {
  const populatedConvo = await Conversation.findOne({ _id: id }).populate(
    pathToPopulate,
    fieldsToRemove
  );

  if (!populatedConvo)
    throw createHttpError.BadRequest("Populating convo failed!");

  return populatedConvo;
};

export const getUserConversations = async userId => {
  try {
    let results = await Conversation.find({
      users: { $elemMatch: { $eq: userId } }
    })
      .populate("users", "-password")
      .populate("admin", "-password")
      .populate("latestMessage")
      .sort({ upatedAt: -1 });

    let conversations = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name email picture, status"
    });

    return conversations;
  } catch (error) {
    throw createHttpError.BadRequest("Getting User conversation failed!");
  }
};

export const updateLatestmessage = async (convoId, msg) => {
  const updatedConvo = await Conversation.findByIdAndUpdate(convoId, {
    latestMessage: msg
  });

  if (!updatedConvo)
    throw createHttpError.BadRequest("Updating latest message failed!");

  return updatedConvo;
};
