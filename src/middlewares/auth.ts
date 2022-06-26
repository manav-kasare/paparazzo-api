import jwt from "jsonwebtoken";
import User from "../models/user";
import config from "../services/config";
import { IControllerArgs } from "../types";

const { JWT_SECRET } = config;

const auth: IControllerArgs = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded,
      token,
    });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next && next();
  } catch (error) {
    return res.json({ data: null, error: "Invalid token!" });
  }
};

export default auth;
