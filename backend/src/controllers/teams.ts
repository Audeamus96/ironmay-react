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

export const getTeam: RequestHandler = async (req, res, next) => {
    const teamId = req.params.teamId;
    try {
        const team = await TeamModel.findById(teamId).exec();
        res.status(200).json(team);
    } catch (error) {
        next(error);
    }
}

export const createTeam: RequestHandler = async (req, res, next) => {
   const teamName = req.body.name
    try {
        const newTeam = await TeamModel.create({
            name: teamName,
        });
        res.status(201).json(newTeam);
    } catch (error) { 
        next(error);
    }
}