import React, { Component } from "react";
import { Button } from "reactstrap";
import { Editor } from "./latex-editor/editor";
import {IRawPart} from "../interfaces/snippets";

interface Props {
    handler: any;
}
interface State {
    snippet_id?: number,
    text: string,
    raw: IRawPart[],
    createHandler: any,
}

export class NoteForm extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            text: '',
            raw: [],
            createHandler: props.handler,
        };
    }

    // ui
    inputChange(e, field) {
        this.setState({[field]: e.target.value} as Pick<State, keyof State>);
    }
    rawChange(rawString, raw) {
        // we don't actually need the rawString for anything.
        this.setState({raw});
    }

    formSubmitBuilder(e) {
        e.preventDefault();
        const values = {
            snippet_id: undefined,
            raw: this.state.raw
        };
        this.state.createHandler(e, values);
    }

    render() {
        return (
            <div>
                <Editor inputHandler={ (rawString, raw) => this.rawChange(rawString, raw) } />
                <br />
                <Button color="success" onClick={ (e) => this.formSubmitBuilder(e) }>Add Note</Button>
            </div>
        );
    }

}
