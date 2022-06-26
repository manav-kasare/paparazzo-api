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
  requests,
} from "../controllers/follows";
import auth from "../middlewares/auth";
const router = Router();

// post
router.post("/follow", auth, follow);
router.post("/remove", auth, remove);
router.post("/requests", auth, request);
router.post("/requests/:id/accept", auth, accept);
router.post("/requests/:id/reject", auth, reject);
router.post("/requests/:id/remove", auth, removeRequest);
router.post("/unfollow", auth, unfollow);

// get
router.get("/followers", auth, followers);
router.get("/following", auth, following);
router.get("/requests", auth, requests);

export default router;
