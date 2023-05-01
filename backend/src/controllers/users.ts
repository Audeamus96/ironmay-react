import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"

import UserModel from "../models/user"
import TeamModel from "../models/team"

export const getAuthenticatedUser: RequestHandler =async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const getUsers: RequestHandler =async (req, res, next) => {
    try {
        const users = await UserModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

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

        // req.session.userId = newUser._id;

        res.status(201).json(newUser._id);

    } catch (error) {
        next(error);
    }
};

interface LoginBody{
    email?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if(!email || !password){
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({email: email}).select("+password").exec();

        if(!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(201).json(user);
        
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error){
            next(error);
        }else{
            res.sendStatus(200);
        }
    })
};