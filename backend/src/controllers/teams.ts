import { RequestHandler } from "express";
import TeamModel from "../models/team"
import createHttpError from "http-errors";
import mongoose from "mongoose";

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
        if(!mongoose.isValidObjectId(teamId)){ 
            throw createHttpError(400, "Invalid Team id"); 
        }

        const team = await TeamModel.findById(teamId).exec();

        if(!team){ 
            throw createHttpError(404, "Team not found");
        }

        res.status(200).json(team);
    } catch (error) {
        next(error);
    }
}

interface CreateTeamBody {
    name?: string,
}

export const createTeam: RequestHandler<unknown, unknown, CreateTeamBody, unknown> = async (req, res, next) => {
   const teamName = req.body.name
    try {
        if(!teamName){
            throw createHttpError(400, "Team must have a name");
        }

        const newTeam = await TeamModel.create({
            name: teamName,
        });
        res.status(201).json(newTeam);
    } catch (error) { 
        next(error);
    }
}

interface updateTeamParams{
    teamId: string,
}

interface UpdateTeamBody{
    name?: string,
}

export const updateTeam: RequestHandler<updateTeamParams, unknown, UpdateTeamBody, unknown> = async(req, res, next) => {
    const teamId = req.params.teamId;
    const newName = req.body.name;

    try {
        if(!mongoose.isValidObjectId(teamId)){ 
            throw createHttpError(400, "Invalid Team id"); 
        }
        if(!newName){
            throw createHttpError(400, "Team must have a name");
        }

        const team = await TeamModel.findById(teamId).exec();

        if(!team){ 
            throw createHttpError(404, "Team not found");
        }

        team.name = newName;

        const updatedTeam = await team.save();

        res.status(200).json(updatedTeam);

    } catch (error) {
        next(error);
    }
};

export const deleteTeam: RequestHandler = async (req, res, next) => {
    const teamId = req.params.teamId;
    try {
        if(!mongoose.isValidObjectId(teamId)){ 
            throw createHttpError(400, "Invalid Team id"); 
        }

        const team = await TeamModel.findById(teamId).exec();

        if(!team){
            throw createHttpError(404, "Team not found");
        }

        await TeamModel.findByIdAndDelete(teamId);

        res.sendStatus(204);
    } catch (error) {

        next(error);
    }
}