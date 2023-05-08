import express from "express";
import * as UserController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";
import { getUserActivitySummary } from "../controllers/activities";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.get("/all", requiresAuth, UserController.getUsers);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.get("/summary", requiresAuth, getUserActivitySummary);

export default router;