// Team Schema
import { InferSchemaType, Schema, model} from "mongoose";

const teamSchema = new Schema({
    name: { type: String, required: true, unique: true},
}, { timestamps: true});

type Team = InferSchemaType<typeof teamSchema>;

export default model<Team>("Team", teamSchema);