import mongoose from "mongoose";

const friendRequests = new mongoose.Schema(
  {
    to: { type: String, required: true },
    from: { type: Object, required: true },
  },
  { timestamps: true }
);

friendRequests.virtual("id").get(function () {
  return this._id.toHexString();
});

friendRequests.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const FriendRequests = mongoose.model("FriendRequests", friendRequests);

export default FriendRequests;
