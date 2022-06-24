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
      tokens: { $in: token },
    });
    if (!user) throw new Error();
    req.user = user;
    next && next();
  } catch (error) {
    return res.status(401).send({ data: null, error: "Invalid token!" });
  }
};

export default auth;
