import createHttpError from "http-errors";
import User from "../models/user.js";

export const findUser = async userId => {
  const user = await User.findById(userId);
  if (!user) throw createHttpError.Unauthorized("Not authorized.");
  return user;
};

export const regexSearchUsers = async keyword => {
  const users = await User.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { name: { $regex: keyword, $options: "i" } }
    ]
  });
  return users;
};
