import createHttpError from "http-errors";
import { regexSearchUsers } from "../services/user.js";

export const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search;
    if (!keyword) {
      throw createHttpError.BadRequest("search query not provided.");
    }

    const users = await regexSearchUsers(keyword, req.user.userId);
    res.status(200).json(users);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};
