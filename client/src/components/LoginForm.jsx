import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm({ login }) {
    const [username, setUsername] = useState('test@polito.it');
    const [password, setPassword] = useState('password123');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        login({ username, password }).then(() => {
            navigate('/studyPlan');
        }).catch((err) => {
            setErrorMessage('Incorrect Email or Password.');
        });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2>Sign in to your Study Plan</h2>

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">Sign In</Button>

                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginForm;