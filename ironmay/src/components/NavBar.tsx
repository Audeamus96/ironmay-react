import { Button, Container, Navbar, NavbarBrand } from "react-bootstrap";
import { User } from "../models/user";
import * as UserApi from "../network/users_api"

interface NavBarProps{
    loggedInUser: User | null,
    onLogoutSuccessfull: () => void,
}

const NavBar = ({loggedInUser, onLogoutSuccessfull} : NavBarProps) => {

    async function logout() {
        try {
            await UserApi.logout();
            onLogoutSuccessfull();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (  
        <Navbar bg="dark" variant="dark" expand="md" sticky="top">
            <Container>
                <NavbarBrand>
                    Ironmay
                </NavbarBrand>
                <Button 
                    variant="outline-danger"
                    onClick={logout}>
                    Logout
                </Button>

            </Container>
        </Navbar>
    );
}
 
export default NavBar;