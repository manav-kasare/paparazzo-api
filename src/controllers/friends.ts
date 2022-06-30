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

export const requests: IControllerArgs = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("friends requests for: ", id);
    const data = await FriendRequests.find({
      to: id,
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

export const getRequest: IControllerArgs = async (req, res) => {
  try {
    const { userId } = await req.query;
    const { id } = req.user;
    const request = await FriendRequests.findOne({
      "from.id": id,
      to: userId,
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
    console.log("request", request);
    await Friends.create({
      ids: [request.from.id, user.id],
      users: { [request.from.id]: request.from, [user.id]: user },
    });
    await User.findByIdAndUpdate(user.id, { $inc: { friends: 1 } });
    await User.findByIdAndUpdate(request.from.id, { $inc: { friends: 1 } });
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    console.log("error accepting friend", error);
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
    const { id } = await req.query;
    console.log("id", id);
    const friend = await Friends.findById(id);
    const { ids } = friend;
    await User.findByIdAndUpdate(ids[0], { $inc: { friends: -1 } });
    await User.findByIdAndUpdate(ids[1], { $inc: { friends: -1 } });
    await Friends.findByIdAndDelete(id);
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    console.log("error removing friend", error);
    return res.json({ data: null, error: "Unexpected error occured" });
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
