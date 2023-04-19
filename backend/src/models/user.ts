// User Schema
import { InferSchemaType, Schema, model} from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    team: {type: Schema.Types.ObjectId, ref:'Team', required: true},
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);