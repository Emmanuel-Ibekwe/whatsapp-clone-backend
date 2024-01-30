import { verify, sign } from "../utils/token.js";

export const generateToken = async (payload, expiresIn, secret) => {
  const token = await sign(payload, expiresIn, secret);
  return token;
};

export const verifyToken = async (token, secret) => {
  let decodedToken = await verify(token, secret);
  return decodedToken;
};
