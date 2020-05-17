import React, { Component } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";

class NoteForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snippet_id: null,
            text: '',
            createHandler: props.handler,
        };
    }

    // ui
    inputChange(e, field) {
        this.setState({[field]: e.target.value});
    }

    formSubmitBuilder(e) {
        e.preventDefault();
        const values = {
            snippet_id: this.state.snippet_type,
            text: this.state.text
        };
        this.state.createHandler(e, values);
    }

    render() {
        return (
            <div>
                <FormGroup row>
                    <Label for="raw" sm={2}>Note</Label>
                    <Input type="textarea" value={ this.state.text } onChange={ (e) => this.inputChange(e, 'text')} name="raw" id="raw" />
                </FormGroup>
                <Button color="success" onClick={ (e) => this.formSubmitBuilder(e) }>Add Note</Button>
            </div>
        );
    }

}

export default NoteForm;
