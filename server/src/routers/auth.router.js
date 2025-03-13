import { Router } from "express";
const router = Router();
import {
  signUp,
  signIn,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);

export default router;
