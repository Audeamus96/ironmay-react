// User Schema
import { InferSchemaType, Schema, model} from "mongoose";

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, select: false },
    password: { type: String, required: true, select: false},
    team: {type: Schema.Types.ObjectId, ref:'Team', required: true},
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);