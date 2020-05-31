import React, { Component } from "react";
import {Input} from "reactstrap";
import RawSnippet from "./rawSnippet";

class TextArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ref: props.reference,
            textChangeHandler: props.textChangeHandler
        };
    }

    render() {
        return (
            <div>
                <RawSnippet raw={ this.props.raw } />
                <Input type="textarea"
                       value={ this.props.rawString }
                       onChange={ (e) => this.state.textChangeHandler(e)}
                       innerRef={ this.state.ref }
                />
            </div>
        );
    }

}

export default TextArea;
