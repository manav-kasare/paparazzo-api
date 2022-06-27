import FriendRequests from "../models/friendRequests";
import Friends from "../models/friends";
import User from "../models/user";
import { IControllerArgs } from "../types";

export const request: IControllerArgs = async (req, res) => {
  try {
    const { me, userId } = await req.body;
    await FriendRequests.create({ to: userId, from: me });
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const getRequest: IControllerArgs = async (req, res) => {
  try {
    const { userId } = await req.query;
    const { id } = req.user;
    const request = await FriendRequests.findOne({
      "from.id": id,
      "to.id": userId,
    });
    if (!request)
      return res.json({
        data: null,
        error: "No friend request found",
      });
    return res.json({
      data: request,
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const removeRequest: IControllerArgs = async (req, res) => {
  try {
    const { id } = await req.params;
    await FriendRequests.findByIdAndDelete(id);
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const accept: IControllerArgs = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await req.user;
    const request = await FriendRequests.findByIdAndDelete(id);
    await Friends.create({
      ids: [request.from.id, user.id],
      users: { [request.from.id]: request.from, [user.id]: user },
    });
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const reject: IControllerArgs = async (req, res) => {
  try {
    const { id } = await req.params;
    await FriendRequests.findByIdAndDelete(id);
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const remove: IControllerArgs = async (req, res) => {
  try {
    const { userId } = await req.query;
    const { id } = await req.user;

    await User.findByIdAndUpdate(id, { friends: { $inc: -1 } });
    await User.findByIdAndUpdate(userId, { friends: { $inc: -1 } });

    const friend = await Friends.findOne({
      $and: [{ ids: { $in: id } }, { ids: { $in: userId } }],
    });

    console.log("friend");

    // await Friends.findByIdAndDelete(id);
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const friends: IControllerArgs = async (req, res) => {
  try {
    const id = req.user.id;
    const data = await Friends.find({
      ids: { $in: id },
    });
    return res.json({
      data,
      error: null,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};
