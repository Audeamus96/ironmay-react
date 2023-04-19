import express from "express";
import * as TeamsController from "../controllers/teams";

const router = express.Router();

router.get("/", TeamsController.getTeams);

router.get("/:teamId", TeamsController.getTeam);

router.post("/", TeamsController.createTeam);

export default router;