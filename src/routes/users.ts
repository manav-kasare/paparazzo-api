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
router.post("/:id/verify", verify);
router.post("/code/resend", resend);

// put
router.put("/update", auth, update);

// get
router.get("/search", search);
router.get("/:id", getUser);
router.get("/me", auth, getMe);
router.get("/:id/relations", auth, relations);

export default router;
