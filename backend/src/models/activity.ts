// User Activity Entry Schema
import { InferSchemaType, Schema, model} from "mongoose";

const activitySchema = new Schema({
    activity_type: { type: String, required: true },
    distance: { type: Number, min: 0, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: {type: Schema.Types.ObjectId, ref:'Team', required: true},
}, { timestamps: true });

type Activity = InferSchemaType<typeof activitySchema>;

export default model<Activity>("Activity", activitySchema);