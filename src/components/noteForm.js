import React, { Component } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import Editor from "./latex-editor/editor";

class NoteForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snippet_id: null,
            text: '',
            raw: [],
            createHandler: props.handler,
        };
    }

    // ui
    inputChange(e, field) {
        this.setState({[field]: e.target.value});
    }
    rawChange(rawString, raw) {
        // we don't actually need the rawString for anything.
        this.setState({raw});
    }

    formSubmitBuilder(e) {
        e.preventDefault();
        const values = {
            snippet_id: this.state.snippet_type,
            //text: this.state.text
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
        /*
         <FormGroup row>
         <Label for="raw" sm={2}>Note</Label>
         <Input type="textarea" value={ this.state.text } onChange={ (e) => this.inputChange(e, 'text')} name="raw" id="raw" />
         </FormGroup>
         */
    }

}

export default NoteForm;
