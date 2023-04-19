import { Button, Form, Modal } from "react-bootstrap";

interface AddTeamDialogProps {
    onDismiss: () => void,
}

const AddTeamDialog = ({onDismiss}: AddTeamDialogProps) => {
    return (  
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Create A Team
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addTeamForm">
                    <Form.Group className="mb-3">
                        <Form.Label>Team Name</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Team 1"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addTeamForm"
                >
                    Create Team
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default AddTeamDialog;