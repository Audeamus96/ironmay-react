import React, { useContext } from 'react';
import { Button, Form } from "react-bootstrap";
import { useForm } from 'react-hook-form';

import styleUtils from '../styles/utils.module.css';

import AuthContext from "../context/AuthProvider";
import { ActivityCreationBody } from '../network/activities_api';
import * as ActivityApi from '../network/activities_api';
import { Activity } from '../models/activity'

interface ActivityCreationProps {
    onActivityAdded: (activity: Activity) => void,
}

const AddActivityForm = ({onActivityAdded} : ActivityCreationProps) => {
    const { auth } = useContext(AuthContext);
    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<ActivityCreationBody>();
    
    async function onSubmit(input: ActivityCreationBody) {
        try {
            if(!auth){ throw Error("Cannot find user"); }
            input.user = auth._id;
            input.team = auth.team;
            const activityRes = await ActivityApi.createActivity(input);
            onActivityAdded(activityRes);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <>
            <h4>Add Activity</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Activity Type</Form.Label>
                    <Form.Select 
                        aria-label="Default select example"
                        isInvalid={!!errors.activity_type}
                        {...register("activity_type", { required: "Must Choose an Activity" })}
                        >
                        <option value="">Choose an activity</option>
                        <option value="run">Running</option>
                        <option value="bike">Biking</option>
                        <option value="swim">Swimming</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.activity_type?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Distance</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="0"
                        isInvalid={!!errors.distance}
                        {...register("distance", { required: "Distance is required", min: {value:0, message:"distances cannot be negative"} })}
                    />
                    <Form.Control.Feedback type="invalid">
                            {errors.distance?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button 
                    variant="primary"
                    type="submit"
                    className={styleUtils.width100}
                    disabled={isSubmitting}
                >
                    Submit
                </Button> 
            </Form>
        </>
    );
}

export default AddActivityForm;