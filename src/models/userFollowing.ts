import mongoose from "mongoose";

const userFollowing = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    users: { type: Object, required: true },
  },
  { timestamps: true }
);

userFollowing.virtual("id").get(function () {
  return this._id.toHexString();
});

userFollowing.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const UserFollowing = mongoose.model("UserFollowing", userFollowing);

export default UserFollowing;
