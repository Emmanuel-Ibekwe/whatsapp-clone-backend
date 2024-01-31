import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export default async function(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return next(createHttpError.Unauthorized("Not authorized."));

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return next(createHttpError.Unauthorized("Not authorized."));
      }

      req.user = payload;
    });
    next();
  } catch (err) {
    if (!error.status) {
      error.status = 500;
    }
    next(err);
  }
}
