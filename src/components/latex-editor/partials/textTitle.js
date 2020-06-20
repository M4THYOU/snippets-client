import React, { Component } from "react";
import {
    Input,
} from 'reactstrap';

class TextTitle extends Component {

    constructor(props) {
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

export default TextTitle;
