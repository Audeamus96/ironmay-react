import { cleanEnv } from "envalid";
import {port, str } from "envalid/dist/validators"

// ensure that the environment variable defined below are valid
// returns the sanatized environment object
export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(), 
    PORT: port(),
});