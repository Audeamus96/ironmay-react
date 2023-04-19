import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"

import UserModel from "../models/user"
import TeamModel from "../models/team"


// values have to be optional because we don't know if user sent them or not
interface SignUpBody {
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    team?: Schema.Types.ObjectId,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    const team = req.body.team;

    try {
        if(!firstName || !lastName || !email || !passwordRaw || !team){
            throw createHttpError(400, "Parameters missing");
        }

        // check if email already exists
        const existingEmail = await UserModel.findOne({email: email}).exec();
        if(existingEmail){
            throw createHttpError(409, "Email already exists. Please login or contact system administrator");
        }

        // check if team exists
        const existingTeam = await TeamModel.findById(team)//.exists({team: team});
        if(!existingTeam){
            throw createHttpError(404, "Team not found");
        }

        // hash password
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHashed,
            team: team,
        });

        res.status(201).json(newUser);

    } catch (error) {
        next(error);
    }
};