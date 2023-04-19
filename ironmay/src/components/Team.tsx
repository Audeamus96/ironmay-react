import styles from "../styles/Team.module.css"
import { Card } from "react-bootstrap";
import { Team as TeamModel } from "../models/team";

interface TeamProps {
    team: TeamModel,
}

const Team = ({ team } : TeamProps) => {
    const {
        name,
        createdAt,
        updatedAt,
    } = team;
    return (
        <Card className={styles.teamCard}>
            <Card.Body>
                <Card.Title>
                    {name}
                </Card.Title>
                <Card.Text className={styles.cardText}>
                     Hello from {name}!
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Team;