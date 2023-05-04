import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose, { Schema } from "mongoose";
import createHttpError from "http-errors";

import ActivityModel from "../models/activity"
import UserModel from "../models/user"
import TeamModel from "../models/team"

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

export const getAllActivities: RequestHandler = async(req, res, next) => {
    try{        
        const activities = await ActivityModel.find().exec();
        res.status(200).json(activities);
    }catch (error) {
        next(error);
    }
}

interface ActivityBody{
    activity_type?: string,
    distance?: string,
    user?: Schema.Types.ObjectId,
    team?: Schema.Types.ObjectId,
}

export const createActivity: RequestHandler<unknown, unknown, ActivityBody, unknown> = async (req, res, next) => {
    const activity_type = req.body.activity_type;
    const distance = req.body.distance;
    const user = req.body.user;
    const team = req.body.team;

    try {
        if(!activity_type || !distance || !user || !team){
            throw createHttpError(400, "Parameters missing");
        }

        // check if user exists
        const existingUser = await UserModel.findById(user)
        if(!existingUser){
            throw createHttpError(404, "User not found");
        }

        // check if team exists
        const existingTeam = await TeamModel.findById(team)
        if(!existingTeam){
            throw createHttpError(404, "Team not found");
        }

        const newActivity = await ActivityModel.create({
            activity_type: activity_type,
            distance: distance,
            user: user,
            team: team,
        });

        res.status(201).json(newActivity);

    } catch (error) {
        if(error instanceof mongoose.Error.ValidationError){
            if(error.errors.distance){
                const message = error.errors.distance.message;
                return next(createHttpError(400, message));
            }
            else if(error.errors.activity_type){
                const message = error.errors.activity_type.message;
                return next(createHttpError(400, message));
            }
            return next(createHttpError(400, error.message));
        }else{
            next(error);
        }
        
    }
}

// Summary of each teams activities (sums up distance for each activity type)
export const getTeamActivitySummary: RequestHandler = async (req, res, next) => {
    try {
        const teamSummaryPipeline = [
            {
                $group: {
                  _id: {team: '$team'}, 
                  runningDistance: { $sum: { $cond: [{ $eq: ['$activity_type', 'run'] }, '$distance', 0] } },
                  bikingDistance: { $sum: { $cond: [{ $eq: ['$activity_type', 'bike'] }, '$distance', 0] } },
                  swimmingDistance: { $sum: { $cond: [{ $eq: ['$activity_type', 'swim'] }, '$distance', 0] } },
                }
            },
            {
                $lookup: {
                  from: 'teams',
                  localField: '_id.team',
                  foreignField: '_id',
                  as: 'team'
                }
            },
            {
                $project: {
                  _id: 0,
                  teamId: '$_id.team',
                  teamName: { $arrayElemAt: ['$team.name', 0] },
                  runningDistance: { $round: ['$runningDistance', 2]},
                  bikingDistance: { $round: ['$bikingDistance', 2]},
                  swimmingDistance: { $round: ['$swimmingDistance', 2]},
                }
            },
            ];
        
        const teamSummaries = await ActivityModel.aggregate(teamSummaryPipeline);
        res.status(200).json(teamSummaries);
    } catch (error) {
        next(error);
    }
}

// Summary of each users activities (sums up distance for each activity type)
export const getUserActivitySummary: RequestHandler = async (req, res, next) => {
    try {
        const UserSummaryPipeline = [
            {
                $group: {
                  _id: {user: '$user'}, 
                  runningDistance: { $sum: { $cond: [{ $eq: ['$activity_type', 'run'] }, '$distance', 0] } },
                  bikingDistance: { $sum: { $cond: [{ $eq: ['$activity_type', 'bike'] }, '$distance', 0] } },
                  swimmingDistance: { $sum: { $cond: [{ $eq: ['$activity_type', 'swim'] }, '$distance', 0] } },
                }
            },
            {
                $lookup: {
                  from: 'users',
                  localField: '_id.user',
                  foreignField: '_id',
                  as: 'user'
                }
            },
            {
                $project: {
                  _id: 0,
                  userId: '$_id.user',
                  firstName: { $arrayElemAt: ['$user.firstName', 0] },
                  lastName: { $arrayElemAt: ['$user.lastName', 0] },
                  runningDistance: { $round: ['$runningDistance', 2]},
                  bikingDistance: { $round: ['$bikingDistance', 2]},
                  swimmingDistance: { $round: ['$swimmingDistance', 2]},
                }
            },
            ];
        
        const userSummaries = await ActivityModel.aggregate(UserSummaryPipeline);
        res.status(200).json(userSummaries);
    } catch (error) {
        next(error);
    }
}