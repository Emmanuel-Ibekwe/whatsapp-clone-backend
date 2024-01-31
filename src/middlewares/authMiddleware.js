import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export default function(req, res, next) {
  if (!req["authorization"])
    throw createHttpError.Unauthorized("Not authorized.");

  const authHeader = req["authorization"];
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      throw createHttpError.Unauthorized("Not authorized");
    }

    req.userId = payload.userId;
  });
  next();
}
