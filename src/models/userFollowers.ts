import mongoose from "mongoose";

const userFollowers = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    users: { type: Object, required: true },
  },
  { timestamps: true }
);

userFollowers.virtual("id").get(function () {
  return this._id.toHexString();
});

userFollowers.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const UserFollowers = mongoose.model("UserFollowers", userFollowers);

export default UserFollowers;
