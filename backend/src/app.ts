import "dotenv/config"
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

import teamsRoutes from "./routes/teams";
import usersRoutes from "./routes/users"
import activityRoutes from "./routes/activities"
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));

// allow express to accept json bodies
app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/api/users/", usersRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/activities", requiresAuth ,activityRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);

    // default error values for any we don't handle
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;

    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;
