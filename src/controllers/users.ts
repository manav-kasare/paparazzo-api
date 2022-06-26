import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Following from "../models/following";
import FollowRequests from "../models/followRequests";
import FriendRequests from "../models/friendRequets";
import Friends from "../models/friends";
import User from "../models/user";
import config from "../services/config";
import mail from "../services/mail";
import otp from "../services/otp";
import { IControllerArgs } from "../types";
const { JWT_SECRET } = config;

export const authenticate: IControllerArgs = async (req, res) => {
  try {
    const { email } = await req.body;
    const user = await User.findOne({ email });
    if (user) return await login(req, res);
    const code = otp();
    const response = await mail(email, code);
    if (response.error)
      return res.json({ data: null, error: "Could not send email" });
    const data = { code, expiresIn: 900000 };
    return res.json({ data, error: null });
  } catch (error: any) {
    console.log("Create user error", error);
    if (error.name === "MongoServerError") {
      if (error.code === 11000) {
        if (error.keyPattern.email) return await login(req, res);
        else if (error.keyPattern.username)
          return res.json({
            data: null,
            error: "This username is already taken!",
          });
      }
    }
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const signup: IControllerArgs = async (req, res) => {
  try {
    const data = await req.body;
    const user = new User(data);
    const token = jwt.sign(user.id, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    user.token = token;
    user.password = hashedPassword;
    await user.save();
    return res.json({ data: { user, token }, error: null });
  } catch (error: any) {
    console.log("Create user error", error);
    if (error.name === "MongoServerError") {
      if (error.code === 11000) {
        if (error.keyPattern.username)
          return res.json({
            data: null,
            error: "This username is already taken!",
          });
      }
    }
    return res.json({ data: null, error });
  }
};

export const login: IControllerArgs = async (req, res) => {
  try {
    const data = await req.body;
    const user = await User.findOne({
      email: data.email,
    });
    if (!user)
      return res.json({ data: null, error: "No user found with this email" });
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return res.json({ data: null, error: "Incorrect Password" });
    const token = jwt.sign(user.id, JWT_SECRET);
    user.token = token;
    await user.save();
    return res.json({
      data: { user, loggedIn: true, token },
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const search: IControllerArgs = async (req, res) => {
  try {
    const { query } = await req.query;
    if (!query) return res.json({ data: null, error: "Query cannot be empty" });
    const data = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("id username avatar");
    return res.json({
      data,
      error: null,
    });
  } catch (error: any) {
    console.log("Error searching", error);
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const getUser: IControllerArgs = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await User.findById(id);
    if (!user)
      return res.json({
        data: null,
        error: "No user found!",
      });
    return res.json({
      data: user,
      error: null,
    });
  } catch (error: any) {
    console.log("Error searching", error);
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const getMe: IControllerArgs = async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      data: user,
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const update: IControllerArgs = async (req, res) => {
  try {
    const body = await req.body;
    const id = req.user.id;
    const user = await User.findByIdAndUpdate(id, body);
    if (!user)
      return res.json({
        data: null,
        error: "No user found!",
      });
    return res.json({
      data: user,
      error: null,
    });
  } catch (error: any) {
    console.log("Error updating user", error);
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const signout: IControllerArgs = async (req, res) => {
  try {
    const user = req.user;
    console.log("user", user);
    if (!user) {
      return res.json({
        data: null,
        error: "No user found!",
      });
    }
    const token = req.token;
    console.log("token", token);
    await User.findByIdAndUpdate(user.id, {
      $unset: { token: 1 },
    });
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    console.log("Error updating user", error);
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const resend: IControllerArgs = async (req, res) => {
  try {
    const { id, email } = await req.query;
    const code = otp();
    const response = await mail(email, code);
    if (response.error)
      return res.json({ data: null, error: "Could not send email" });
    const user = await User.findByIdAndUpdate(id, { verificationCode: code });
    if (!user)
      return res.json({
        data: null,
        error: "No user found!",
      });
    return res.json({
      data: user,
      error: null,
    });
  } catch (error: any) {
    console.log("Error verifying code", error);
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const verify: IControllerArgs = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await User.findByIdAndUpdate(id, {
      verified: true,
      $unset: { verificationCode: 1 },
    });
    if (!user)
      return res.json({
        data: null,
        error: "No user found!",
      });
    return res.json({
      data: user,
      error: null,
    });
  } catch (error: any) {
    console.log("Error verifying user", error);
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};

export const relations: IControllerArgs = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.query;

    let isFollowing = false;
    let followRequested = false;
    let isFriend = false;
    let friendRequested = false;

    // Does follow
    isFollowing = (await Following.findOne({
      userId: id,
      "user.id": userId,
    }))
      ? true
      : false;

    // Has follow requested
    if (!isFollowing) {
      followRequested = (await FollowRequests.findOne({
        to: userId,
      }))
        ? true
        : false;
    }

    // Is Friend
    isFriend = (await Friends.findOne({
      userId: id,
      "user.id": userId,
    }))
      ? true
      : false;

    // Has friend requested
    if (!isFriend) {
      friendRequested = (await FriendRequests.findOne({
        to: userId,
      }))
        ? true
        : false;
    }

    const data = { isFollowing, isFriend, friendRequested, followRequested };

    return res.json({
      data,
      error: null,
    });
  } catch (error: any) {
    console.log("Error verifying user", error);
    return res
      .status(400)
      .json({ data: null, error: "An unexpected error occured" });
  }
};
