import mongoose from "mongoose";

const following = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    user: { type: Object, required: true },
  },
  { timestamps: true }
);

following.virtual("id").get(function () {
  return this._id.toHexString();
});

following.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const Following = mongoose.model("Following", following);

export default Following;
