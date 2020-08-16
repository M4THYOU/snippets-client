import React, { Component } from "react";

// Components
import {apiPatch} from "../api/functions";
import {Endpoint} from "../api/endpoints";

// Functions/Enums

interface Props {
    history: any;
    match: any;
}

interface State {
    token: string;
    isSaving: boolean;
}

export class ConfirmEmail extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            token: props.match.params.id,
            isSaving: true
        };
    }

    componentDidMount() {
        this.sendConfirmation();
    }

    // API
    sendConfirmation() {
        const data = {
            id: this.state.token,
        };

        this.setState({isSaving: true});
        apiPatch(Endpoint.CONFIRM_EMAIL, undefined, data)
            .then(res => res.json())
            .then(result => {
                if (result) {
                    this.props.history.push('/');
                }
            })
            .catch(e => {
                this.setState({isSaving: false});
                console.error(e);
            });
    }

    // UI
    inputChange(e, field: string) {
        this.setState({[field]: e.target.value} as Pick<State, keyof State>);
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
        return this.renderSpinner();

    }

}
