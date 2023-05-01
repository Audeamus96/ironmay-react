// User Activity Entry Schema
import { InferSchemaType, Schema, model} from "mongoose";

const activitySchema = new Schema({
    activity_type: { 
        type: String,
        required: true,
        enum:{values: ["swim","run", "bike"], message:'{VALUE} is not a supported activity type' }
    },
    distance: { type: Number, min: [0, 'Distance must be greater than zero, you input was:{VALUE}'], required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: {type: Schema.Types.ObjectId, ref:'Team', required: true},
}, { timestamps: true });

type Activity = InferSchemaType<typeof activitySchema>;

export default model<Activity>("Activity", activitySchema);