import mongoose from "mongoose";

const post = new mongoose.Schema(
  {
    username: { type: String, trim: true, required: true, unique: true },
    user: { type: Object, required: true },
    image: { type: String, required: true },
    caption: { type: Object, required: false },
    postedBy: { type: Object, required: true },
  },
  { timestamps: true }
);

post.virtual("id").get(function () {
  return this._id.toHexString();
});

post.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const Post = mongoose.model("Post", post);

export default Post;
