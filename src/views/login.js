import React, { Component } from "react";
import {Container, Form, FormGroup, Label, Input, Button, Alert} from "reactstrap";

// Components
import {apiLogin, isAuthenticated} from "../api/functions";

// Functions/Enums

class Login extends Component {

    loginErrorMessage = 'Invalid login credentials';

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isError: false,
            email: '',
            password: ''
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(isAuthorized => {
                if (isAuthorized) {
                    this.props.history.push('/');
                } else {
                    this.setState({isLoaded: true});
                }
            });
    }

    loginError() {
        const isError = true;
        const email = '';
        const password = '';
        this.setState({isError, email, password});
    }

    // API
    async loginHandler(e) {
        e.preventDefault();

        const isValidLogin = await apiLogin(this.state.email, this.state.password);
        if (isValidLogin) {
            this.props.history.push('/');
        } else {
            this.loginError();
        }
    }

    // UI
    inputChange(e, field) {
        this.setState({[field]: e.target.value});
    }

    passwordKeyDown(e) {
        if (e.key === 'Enter') {
            this.loginHandler(e);
        }
    }

    // rendering
    renderLoginError() {
        if (this.state.isError) {
            return (
                <Alert color="danger">
                    { this.loginErrorMessage }
                </Alert>
            );
        }
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <Container>
                    <h1>Login</h1>
                    <hr/>
                    {this.renderLoginError()}
                    <Form className="left-align">
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="email" className="mr-sm-2">Email</Label>
                            <Input type="email" name="email" id="email" placeholder="example@example.com"
                                   onChange={(e) => this.inputChange(e, 'email')}
                            />
                        </FormGroup>
                        <br/>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="password" className="mr-sm-2">Password</Label>
                            <Input type="password" name="password" id="password"
                                   onChange={(e) => this.inputChange(e, 'password')}
                                   onKeyDown={ (e) => this.passwordKeyDown(e) }
                            />
                        </FormGroup>
                        <br/>
                        <Button color="primary" onClick={(e) => this.loginHandler(e)}>Login</Button>
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

export default Login;