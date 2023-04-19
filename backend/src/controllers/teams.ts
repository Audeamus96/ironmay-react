import { RequestHandler } from "express";
import TeamModel from "../models/team"

export const getTeams: RequestHandler =  async (req, res, next) => {
    try {
        const teams = await TeamModel.find().exec();
        res.status(200).json(teams);
    } catch (error) { 
        next(error);
    }
}