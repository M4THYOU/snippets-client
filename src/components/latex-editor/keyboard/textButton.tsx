import React, { Component } from "react";
import {Button} from "reactstrap";
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

interface Props {
    latex: string;
    handler: any;
}
interface State {
    latex: string;
    handler: any;
}

export class TextButton extends Component<Props, State> {

    constructor(props: Props) {
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
