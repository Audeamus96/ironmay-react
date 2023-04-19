import express from "express";
import * as TeamsController from "../controllers/teams";

const router = express.Router();

router.get("/", TeamsController.getTeams);

export default router;