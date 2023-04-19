import { Button, Form, Modal } from "react-bootstrap";
import { Team } from "../models/team";
import { useForm } from "react-hook-form";
import { TeamInput } from "../network/teams_api";
import * as TeamsApi from "../network/teams_api";

interface AddTeamDialogProps {
    onDismiss: () => void,
    onTeamSaved: (team: Team) => void,
}

const AddTeamDialog = ({onDismiss, onTeamSaved}: AddTeamDialogProps) => {

    // reac-hook-forms stuff
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TeamInput>();

    async function onSubmit(input: TeamInput) {
        try {
            const teamResponse = await TeamsApi.createTeam(input);
            onTeamSaved(teamResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (  
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Create A Team
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addTeamForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Team Name</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Team 1"
                            isInvalid={!!errors.name}
                            {...register("name", { required: "Required" })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addTeamForm"
                    disabled={isSubmitting}
                >
                    Create Team
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default AddTeamDialog;