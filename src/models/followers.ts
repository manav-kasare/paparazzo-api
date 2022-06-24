import mongoose from "mongoose";

const followers = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    user: { type: Object, required: true },
  },
  { timestamps: true }
);

followers.virtual("id").get(function () {
  return this._id.toHexString();
});

followers.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const Followers = mongoose.model("Followers", followers);

export default Followers;
