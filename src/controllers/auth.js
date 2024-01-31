import dotenv from "dotenv";
import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.js";
import { generateToken, verifyToken } from "../services/token.js";
import { findUser } from "../services/user.js";

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

    // res.cookie("refreshtoken", refresh_token, {
    //   httpOnly: true,
    //   path: "api/v1/auth/refreshtoken",
    //   maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
    // });

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
    const { email, password } = req.body;
    const user = await signUser(email, password);

    const access_token = await generateToken(
      {
        userId: user._id.toString(),
        email: user.email
      },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refresh_token = await generateToken(
      {
        userId: user._id.toString(),
        email: user.email
      },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30days
    });

    res.status(200).json({
      message: "login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
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

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/v1/auth/refreshtoken" });

    console.log("Cookie cleared");
    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshtoken;
    if (!refresh_token) throw createHttpError.Unauthorized("Not authorized.");
    const payload = await verifyToken(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await findUser(payload.userId);
    const access_token = await generateToken(
      {
        userId: user._id.toString(),
        email: user.email
      },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
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
