import React, { Component } from "react";
import {sendConfirmEmail} from "../../api/functions";

// Components

// Functions/Enums

interface Props {
    email: string;
}

interface State {
    isSaving: boolean;
}

export class PleaseConfirm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isSaving: false,
        };
    }

    componentDidMount() {
    }

    // API
    async resendEmail() {
        this.setState({isSaving: true});
        const { isSuccess, result } = await sendConfirmEmail(this.props.email);
        console.log(isSuccess, result);
        this.setState({isSaving: false});
    }


    // rendering
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
        return (
            <div>
                <p>An email has been sent to { this.props.email }. Click the link to confirm your email address.</p>
                <p onClick={ () => this.resendEmail() } style={ {color: '#0060B6', textDecoration: 'underline'} }>Resend email</p>

                { this.renderSpinner() }
            </div>
        );
    }

}
