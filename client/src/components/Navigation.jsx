import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Navigation({ loggedIn, user, handleLogout }) {
    const navigate = useNavigate();
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>

                <Navbar.Brand as={Link} to="/">My Study Plan PoliTo</Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    {loggedIn ? (
                        <Navbar.Text>
                            <span className="me-3">Welcome, {user?.name}!</span>
                            <Button onClick={() => {
                                handleLogout();
                                navigate('/');
                            }}>Logout</Button>
                        </Navbar.Text>
                    ) : (
                        <Button as={Link} to="/login">Login</Button>
                    )}
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default Navigation;