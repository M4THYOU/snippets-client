import React, { Component } from "react";
import {Container, Form, FormGroup, Label, Input, Button, Alert, Row, Col} from "reactstrap";

// Components
import {apiPost, isAuthenticated} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";

// Functions/Enums

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            doesAgree: false
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                if (isAuthorized) {
                    this.props.history.push('/');
                } else {
                    this.setState({isLoaded: true});
                }
            });
    }

    isValidRegisterForm(email, firstName, lastName, password, confirmPassword, doesAgree) {
        // const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (!email || !re.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (!firstName) {
            alert('Please enter your first name.');
            return false;
        }
        if (!lastName) {
            alert('Please enter your last name.');
            return false;
        }

        if (!password) {
            alert('Please enter a password.');
            return false;
        }
        if (password.length < 6) {
            alert('Your password must be at least 6 characters.');
            return false;
        }
        if (password !== confirmPassword) {
            alert('Your passwords must match.');
            return false;
        }

        if (!doesAgree) {
            alert('Please agree to the terms of service.');
            return false;
        }

        return true;
    }

    registerError() {
        const isError = true;
        const password = '';
        const password_confirmation = '';
        this.setState({isError, password, password_confirmation});
    }

    // API
    async registerHandler(e) {
        e.preventDefault();
        const email = this.state.email;
        const first_name = this.state.firstName;
        const last_name = this.state.lastName;
        const password = this.state.password;
        const password_confirmation = this.state.confirmPassword;
        const does_agree = this.state.doesAgree;
        
        const validForm = this.isValidRegisterForm(email, first_name, last_name, password, password_confirmation, does_agree);
        if (!validForm) {
            return;
        }

        const data = {email, first_name, last_name, password, password_confirmation, does_agree};
        apiPost(EndpointsEnum.USERS, data)
            .then(res => res.json())
            .then(result => {
                console.log('a');
                if ((result.status === 'ERROR') || (Number.isInteger(result.status) && result.status >= 400)) {
                    this.setState({error: result.message || result.error });
                } else {
                    this.props.history.push('/login');
                }
            })
            .catch(e => {
                console.error(e);
                this.setState({error: 'Error occurred.' });
            });
        /*
        const isValidLogin = await apiLogin(this.state.email, this.state.password);
        if (isValidLogin) {
            this.props.history.push('/');
        } else {
            this.loginError();
        }*/
    }

    // UI
    inputChange(e, field) {
        if (field === 'doesAgree') {
            this.setState({[field]: e.target.checked});
        } else {
            this.setState({[field]: e.target.value});
        }
    }

    // rendering
    renderRegisterError() {
        if (this.state.error) {
            return (
                <Alert color="danger">
                    { this.state.error }
                </Alert>
            );
        }
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <Container>
                    <h1>Register</h1>
                    <hr/>
                    { this.renderRegisterError() }
                    <Form className="left-align">
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" placeholder="example@example.com"
                                   value={this.state.email}
                                   onChange={(e) => this.inputChange(e, 'email')}
                            />
                        </FormGroup>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="firstName">First Name</Label>
                                    <Input type="text" name="firstName" id="firstName"
                                           value={this.state.firstName}
                                           onChange={(e) => this.inputChange(e, 'firstName')}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="lastName">Last Name</Label>
                                    <Input type="text" name="lastName" id="lastName"
                                           value={this.state.lastName}
                                           onChange={(e) => this.inputChange(e, 'lastName')}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input type="password" name="password" id="password"
                                           value={this.state.password}
                                           onChange={(e) => this.inputChange(e, 'password')}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="confirmPassword">Confirm Password</Label>
                                    <Input type="password" name="confirmPassword" id="confirmPassword"
                                           value={this.state.confirmPassword}
                                           onChange={(e) => this.inputChange(e, 'confirmPassword')}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup check>
                            <Input type="checkbox" name="doesAgree" id="doesAgree"
                                   checked={this.state.doesAgree}
                                   onChange={(e) => this.inputChange(e, 'doesAgree')}
                            />
                            <Label for="exampleCheck" check>Agree to terms of service</Label>
                        </FormGroup>
                        <br />
                        <Button color="primary" onClick={ (e) => this.registerHandler(e) }>Register</Button>
                    </Form>
                </Container>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }

    }

}

export default Register;
