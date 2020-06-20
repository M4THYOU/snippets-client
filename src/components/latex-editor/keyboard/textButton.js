import React, { Component } from "react";
import {Button} from "reactstrap";
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

class TextButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            latex: props.latex,
            handler: props.handler
        };
    }

    handleClick(e) {
        e.preventDefault();
        const returnVal = '`' + this.state.latex + '`';
        this.state.handler(returnVal);
    }

    render() {
        return (
            <Button onClick={ (e) => this.handleClick(e) } outline><TeX math={ this.state.latex }/></Button>
        );
    }

}

export default TextButton;
