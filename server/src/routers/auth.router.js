import { Router } from "express";
const router = Router();
import {
  signUp,
  signIn,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", logout);

router.put("/update-profile", updateProfile);

export default router;
