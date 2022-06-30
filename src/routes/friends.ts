import { Router } from "express";
import {
  accept,
  reject,
  removeRequest,
  request,
  remove,
  friends,
  getRequest,
  requests,
} from "../controllers/friends";
import auth from "../middlewares/auth";
const router = Router();

// post
router.post("/requests", auth, request);
router.post("/requests/:id/accept", auth, accept);
router.post("/requests/:id/reject", auth, reject);
router.post("/requests/:id/remove", auth, removeRequest);
router.post("/remove", auth, remove);

// get
router.get("/", auth, friends);
router.get("/request", auth, getRequest);
router.get("/requests", auth, requests);

export default router;
