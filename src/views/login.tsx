import React, { Component } from "react";
import {Container, Form, FormGroup, Label, Input, Button, Alert} from "reactstrap";

// Components
import {apiLogin, isAuthenticated, sendConfirmEmail} from "../api/functions";

// Functions/Enums

interface Props {
    history: any;
}

interface State {
    isLoaded: boolean;
    isSaving: boolean;
    error: string,
    errorShouldShowSendEmail: boolean,
    email: string,
    password: string
}

export class Login extends Component<Props, State> {

    DEFAULT_ERROR_MESSAGE = 'Invalid login credentials';

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoaded: false,
            isSaving: false,
            error: '',
            errorShouldShowSendEmail: false,
            email: '',
            password: '',
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

    loginError(error: string, showResendEmail: boolean) {
        const isSaving = false;
        const password = '';
        this.setState({isSaving, error, errorShouldShowSendEmail: showResendEmail, password});
    }

    // API
    async resendEmail() {
        this.setState({isSaving: true});
        const { isSuccess, result } = await sendConfirmEmail(this.state.email);
        if (!isSuccess) {
            console.error(result);
        }
        this.setState({isSaving: false});
    }

    async loginHandler(e) {
        e.preventDefault();
        this.setState({isSaving: true});
        const { isSuccess, result } = await apiLogin(this.state.email, this.state.password);
        if (isSuccess) {
            // because we need to force page refresh to update header values.
            window.location.href = '/';
        } else {
            const error = result.error;
            console.log(error);

            let message = this.DEFAULT_ERROR_MESSAGE;
            if (!!error.user_authentication) {
                message = error.user_authentication;
            }
            this.loginError(message, !!error.confirm_email);
        }
    }

    // UI
    inputChange(e, field: string) {
        this.setState({[field]: e.target.value} as Pick<State, keyof State>);
    }

    passwordKeyDown(e) {
        if (e.key === 'Enter') {
            this.loginHandler(e);
        }
    }

    // rendering
    renderEmailSendButton() {
        if (this.state.errorShouldShowSendEmail) {
            return (
                <span onClick={ () => this.resendEmail() } className="link-text">Resend Confirmation</span>
            );
        }
    }
    renderLoginError() {
        if (!!this.state.error) {
            return (
                <Alert color="danger">
                    { this.state.error } { this.renderEmailSendButton() }
                </Alert>
            );
        }
    }

    renderSpinner() {
        if (this.state.isSaving) {
            return (
                <div className="spinner-overlay">
                    <div className="spinner">
                    </div>
                </div>
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
                            <Input type="password" name="password" id="password" value={ this.state.password }
                                   onChange={(e) => this.inputChange(e, 'password')}
                                   onKeyDown={ (e) => this.passwordKeyDown(e) }
                            />
                        </FormGroup>
                        <br/>
                        <Button color="primary" onClick={(e) => this.loginHandler(e)}>Login</Button>
                    </Form>
                    { this.renderSpinner() }
                </Container>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }

    }

}
