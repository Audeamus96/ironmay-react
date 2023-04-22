import { RequestHandler } from "express";
import ActivityModel from "../models/activity"
import { assertIsDefined } from "../util/assertIsDefined";

export const getActivities: RequestHandler = async(req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try{
        assertIsDefined(authenticatedUserId);
        
        const activities = await ActivityModel.find({userId: authenticatedUserId}).exec();
        res.status(200).json(activities);
    }catch (error) {
        next(error);
    }
}