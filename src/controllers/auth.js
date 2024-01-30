import dotenv from "dotenv";
import { createUser } from "../services/auth.js";
import { generateToken } from "../services/token.js";

dotenv.config();
export const signup = async (req, res, next) => {
  try {
    const { name, email, status, picture, password } = req.body;

    const newUser = await createUser({
      name,
      email,
      status,
      picture,
      password
    });

    const access_token = await generateToken(
      {
        userId: newUser._id.toString(),
        email: newUser.email
      },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refresh_token = await generateToken(
      {
        userId: newUser._id.toString(),
        email: newUser.email
      },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
    });

    res.status(201).json({
      message: "signup successful.",
      access_token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        token: access_token
      }
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};
