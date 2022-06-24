import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    email: { type: String, trim: true, required: true, unique: true },
    username: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    fcm: { type: String, required: true },
    avatar: { type: String, required: true },
    tokens: [mongoose.Schema.Types.String],
    followers: { type: Number, required: true },
    following: { type: Number, required: true },
    friends: { type: Number, required: true },
    isPrivate: { type: Boolean, required: true },
    verified: { type: Boolean, required: true },
    verificationCode: { type: Number, required: false },
  },
  { timestamps: true }
);

user.virtual("id").get(function () {
  return this._id.toHexString();
});

user.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const User = mongoose.model("User", user);

export default User;
