import { Router } from "express";
const router = Router();
import { getUsersForSidebar } from "../controllers/message.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

router.get("/users", protectedRoute, getUsersForSidebar);

export default router;
