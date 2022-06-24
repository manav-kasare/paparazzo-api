import mongoose from "mongoose";

const followRequests = new mongoose.Schema(
  {
    to: { type: String, required: true },
    from: { type: Object, required: true },
  },
  { timestamps: true }
);

followRequests.virtual("id").get(function () {
  return this._id.toHexString();
});

followRequests.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const FollowRequests = mongoose.model("FollowRequests", followRequests);

export default FollowRequests;
