import React, { Component } from "react";
import {Input} from "reactstrap";
import { RawSnippet } from "./rawSnippet";
import {IRawPart} from "../../../interfaces/snippets";

interface Props {
    reference: React.RefObject<HTMLInputElement>;
    textChangeHandler: any;
    raw: IRawPart[];
    rawString: string;
}
interface State {
    ref: React.RefObject<HTMLInputElement>;
    textChangeHandler: any;
}

export class TextArea extends Component<Props, State> {

    constructor(props: Props) {
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
