import mongoose from "mongoose";

const friends = new mongoose.Schema(
  {
    users: { type: Object, required: true },
    ids: { type: Array, required: true },
  },
  { timestamps: true }
);

friends.virtual("id").get(function () {
  return this._id.toHexString();
});

friends.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const Friends = mongoose.model("Friends", friends);

export default Friends;
