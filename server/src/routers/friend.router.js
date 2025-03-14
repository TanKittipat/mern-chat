import { Router } from "express";
const router = Router();
import { acceptFriend, addFriend } from "../controllers/friend.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

router.post("/add", protectedRoute, addFriend);

router.post("/accept", protectedRoute, acceptFriend);

export default router;
