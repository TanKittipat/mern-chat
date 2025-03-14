import { Router } from "express";
const router = Router();
import {
  getUsersForSidebar,
  getMessage,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

router.get("/users", protectedRoute, getUsersForSidebar);

router.get("/:id", protectedRoute, getMessage);

router.post("/send/:id", protectedRoute, sendMessage);

export default router;
