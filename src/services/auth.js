import createHttpError from "http-errors";
import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const DEFAULT_PICTURE_URL =
  "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png";
export const DEFAULT_STATUS = "Hey there! I am using Whatsapp";

export const createUser = async userData => {
  const { name, email, status, picture, password } = userData;

  //   check if fields are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }

  if (
    !validator.isLength(name, {
      min: 2,
      max: 25
    })
  ) {
    throw createHttpError.BadRequest(
      "Your name must be between 2 and 25 characters"
    );
  }

  if (status && status.length > 140) {
    throw createHttpError.BadRequest(
      "status cannot be more than 140 characters"
    );
  }

  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("email is invalid.");
  }

  const checkEmail = await User.findOne({ email: email });
  if (checkEmail) {
    throw createHttpError.Conflict("email already exists. Try a new email.");
  }

  if (
    !validator.isLength(password, {
      min: 6,
      max: 128
    })
  ) {
    throw createHttpError.BadRequest(
      "password must be between 6 and 128 characters."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await new User({
    name,
    email,
    password: hashedPassword,
    picture: picture || DEFAULT_PICTURE_URL,
    status: status || DEFAULT_STATUS
  });

  return user.save();
};

export const signUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).lean();

  if (!user) {
    throw createHttpError.Unauthorized(
      "User with this email could not be found."
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw createHttpError.Unauthorized("wrong password.");
  }

  return user;
};
