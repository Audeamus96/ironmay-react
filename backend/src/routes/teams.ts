import express from "express";
import { requiresAuth } from "../middleware/auth";

import * as TeamsController from "../controllers/teams";
import { getTeamActivitySummary } from "../controllers/activities";

const router = express.Router();

router.get("/", TeamsController.getTeams);

router.get("/summary", requiresAuth ,getTeamActivitySummary);

router.get("/:teamId", TeamsController.getTeam);

router.post("/", TeamsController.createTeam);

router.patch("/:teamId", TeamsController.updateTeam);

router.delete("/:teamId", requiresAuth, TeamsController.deleteTeam);

export default router;