import React, { Component } from "react";
import {
    Input,
} from 'reactstrap';

interface Props {
    id: string;
    name: string;
    changeHandler: any;
    value: string;
}
interface State {
    id: string;
    name: string;
    changeHandler: any;
}

export class TextTitle extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            id: props.id,
            name: props.name,
            changeHandler: props.changeHandler,
        };
    }

    rawChange(val) {
        this.state.changeHandler(val);
    }

    render() {
        return (
            <Input id={ this.state.id }
                   name={ this.state.name }
                   value={ this.props.value }
                   type="text"
                   onChange={ (e) => this.rawChange(e.target.value) }
            />
        );
    }

}
