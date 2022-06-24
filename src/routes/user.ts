import { Router } from "express";
import {
  authenticate,
  getUser,
  resend,
  search,
  signout,
  update,
  verify,
} from "../controllers/user";
const router = Router();

// post
router.post("/authenticate", authenticate);
router.post("/:id/signout", signout);
router.post("/:id/verify", verify);
router.post("/code/resend", resend);

// put
router.put("/update", update);

// get
router.get("/search", search);
router.get("/:id", getUser);

export default router;
