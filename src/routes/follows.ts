import { Router } from "express";
import {
  accept,
  follow,
  followers,
  following,
  reject,
  remove,
  removeRequest,
  request,
  unfollow,
} from "../controllers/follows";
import auth from "../middlewares/auth";
const router = Router();

// post
router.post("/follow", auth, follow);
router.post("/remove", auth, remove);
router.post("/request", auth, request);
router.post("/request/:id/accept", auth, accept);
router.post("/request/:id/reject", auth, reject);
router.post("/request/:id/remove", auth, removeRequest);
router.post("/:id/unfollow", auth, unfollow);

// get
router.get("/followers", auth, followers);
router.get("/following", auth, following);

export default router;
