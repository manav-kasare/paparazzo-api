import { Router } from "express";
import {
  signup,
  getUser,
  relations,
  resend,
  search,
  signout,
  update,
  verify,
  authenticate,
  getMe,
} from "../controllers/users";
import auth from "../middlewares/auth";
const router = Router();

// post
router.post("/authenticate", authenticate);
router.post("/signup", signup);
router.post("/signout", auth, signout);
router.post("/user/:id/verify", verify);
router.post("/code/resend", resend);

// put
router.put("/update", auth, update);

// get
router.get("/search", auth, search);
router.get("/me", auth, getMe);
router.get("/relations", auth, relations);
router.get("/user/:id", getUser);

export default router;
