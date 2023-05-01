import express from "express";
import * as ActivityController from "../controllers/activities";

const router = express.Router();

router.get("/", ActivityController.getActivities);

router.get("/all", ActivityController.getAllActivities);

router.post("/", ActivityController.createActivity);

// router.get("/:activityId", ActivityController.signUp.getActivity)

// router.patch("/:activityId", ActivityController.updateActivity)

// router.delete("/:activityId", ActivityController.deleteActivity)

export default router;