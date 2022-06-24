import Followers from "../models/followers";
import Following from "../models/following";
import FollowRequests from "../models/followRequests";
import User from "../models/user";
import { IControllerArgs } from "../types";

export const request: IControllerArgs = async (req, res) => {
  try {
    const data = await req.body;
    const { me, remoteId } = data;

    await FollowRequests.create({ to: remoteId, from: me });

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

export const removeRequest: IControllerArgs = async (req, res) => {
  try {
    const { id } = await req.params;

    await FollowRequests.findByIdAndDelete(id);

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
    const userId = req.user.id;
    const data = await FollowRequests.find({ to: userId }).limit(10);
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

export const accept: IControllerArgs = async (req, res) => {
  try {
    const { id } = await req.params;
    const data = await req.body;
    const { me, remote } = data;

    // Me
    await Followers.create({ userId: me.id, user: remote });
    await User.findByIdAndUpdate(data.me.id, { $inc: { followers: 1 } });

    // Remote
    await Following.create({ userId: remote.id, user: me });
    await User.findByIdAndUpdate(data.remote.id, { $inc: { following: 1 } });

    await FollowRequests.findByIdAndDelete(id);

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

    await FollowRequests.findByIdAndDelete(id);

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

export const follow: IControllerArgs = async (req, res) => {
  try {
    const data = await req.body;
    const { me, remote } = data;

    // Me
    await Following.create({ userId: me.id, user: remote });
    await User.findByIdAndUpdate(data.me.id, { $inc: { following: 1 } });

    // Remote
    await Followers.create({ userId: remote.id, user: me });
    await User.findByIdAndUpdate(data.remote.id, { $inc: { followers: 1 } });

    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    console.log("Error following user", error);
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const unfollow: IControllerArgs = async (req, res) => {
  try {
    const { remoteId } = await req.query;
    const myId = req.user.id;

    // Me
    await Following.findOneAndDelete({ userId: myId, "user.id": remoteId });
    await User.findByIdAndUpdate(myId, {
      $inc: { following: -1 },
    });

    // Remote
    await Followers.findOneAndDelete({
      userId: remoteId,
      "user.id": myId,
    });
    await User.findByIdAndUpdate(remoteId, {
      $inc: { followers: -1 },
    });

    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    console.log("Error following user", error);
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const remove: IControllerArgs = async (req, res) => {
  try {
    const { remoteId } = await req.query;
    const myId = req.user.id;

    // Me
    await Followers.findOneAndDelete({ userId: myId, "user.id": remoteId });
    await User.findByIdAndUpdate(myId, {
      $inc: { followers: -1 },
    });

    // Remote
    await Following.findOneAndDelete({
      userId: remoteId,
      "user.id": myId,
    });
    await User.findByIdAndUpdate(remoteId, {
      $inc: { following: -1 },
    });
    return res.json({
      data: "Success",
      error: null,
    });
  } catch (error: any) {
    console.log("Error following user", error);
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const followers: IControllerArgs = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await Followers.find({ userId }).limit(10);
    return res.json({
      data,
      error: null,
    });
  } catch (error: any) {
    console.log("Error get followers", error);
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};

export const following: IControllerArgs = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await Following.find({ userId }).limit(10);
    return res.json({
      data,
      error: null,
    });
  } catch (error: any) {
    console.log("Error get following", error);
    return res
      .status(400)
      .json({ data: null, error: "Unexpected error occured" });
  }
};
