import express from "express";
import * as TeamsController from "../controllers/teams";

const router = express.Router();

router.get("/", TeamsController.getTeams);

router.get("/:teamId", TeamsController.getTeam);

router.post("/", TeamsController.createTeam);

router.patch("/:teamId", TeamsController.updateTeam);

router.delete("/:teamId", TeamsController.deleteTeam);

export default router;