import React, { Component } from "react";
import {Container, Alert, Button, Col, Row} from "reactstrap";

// Components
import SnippetForm from "../components/snippetForm";
import NoteForm from "../components/noteForm";
import NoteCard from "../components/notes/note-card";

// Functions/Enums
import {apiCreate} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";
import {buildSnippet} from "../utils/db";
import {chunkArray} from "../utils/utils";

class NewSnippet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isAddingNote: false,
            notes: ['test']
        };
    }

    isValidSnippetForm(title, type, course, raw) {
        if (!title) {
            alert('Please enter a title.');
            return false;
        }
        if (!type) {
            alert('Please select a type.');
            return false;
        }
        if (!course) {
            alert('Please select a course.');
            return false;
        }
        if (raw.length === 0) {
            alert('Please enter a snippet!');
            return false;
        }
        return true;
    }

    createSnippetHandler(e, values) {
        e.preventDefault();
        const title = values.title;
        const type = values.type;
        const course = values.course;
        const raw = values.raw;

        const validForm = this.isValidSnippetForm(title, type, course, raw);
        if (!validForm) {
            return;
        }

        const snippet = buildSnippet(raw);
        let data = {
            title,
            snippet_type: type,
            course,
            raw: snippet
        };

        apiCreate(EndpointsEnum.SNIPPETS, data)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    const err = res.statusText;
                    this.setState({error: err});
                }
            })
            .then(result => {
                if (result) {
                    this.props.history.push('/');
                }
            })
            .catch(e => {
                this.setState({error: e.toString()});
            });
    }

    isValidNoteForm(text) {
        return !!text;
    }

    createNoteHandler(e, values) {
        e.preventDefault();
        const text = values.text;

        const validForm = this.isValidNoteForm(text);
        if (!validForm) {
            return;
        }
        let notes = this.state.notes.slice();
        notes.push(text);
        this.setState({isAddingNote: false, notes});
    }

    deleteNoteHandler(e, i) {
        e.preventDefault();
        console.log('DELETE');
    }

    newNoteButtonHandler(e) {
        e.preventDefault();
        this.setState({isAddingNote: true});
    }

    // rendering
    renderFormError() {
        if (this.state.error) {
            return (
                <Alert color="danger">
                    { this.state.error }
                </Alert>
            );
        }
    }

    renderSingleNote(text, i) {
        return <NoteCard text={ text }
                         key={ i }
                         id={ i }
                         deleteHandler={ (e) => this.deleteNoteHandler(e, i) }
        />;
    }

    renderNotesRow(notes, row_i) {
        return notes.map((text, i) => {
            const index = (row_i + 1) * (i + 1);
            console.log(index);
            return (
                <Col sm="3" key={'col_' + i}>
                    {this.renderSingleNote(text, index)}
                </Col>
            );
        });
    }

    renderNotes() {
        const noteRows = chunkArray(4, this.state.notes);
        return noteRows.map((row, i) => {
            return (
                <Row className="margin-bottom" key={ 'row_' + i }>
                    { this.renderNotesRow(row, i) }
                </Row>
            );
        });
    }

    renderNoteForm() {
        if (this.state.isAddingNote) {
            return (
                <NoteForm handler={ (e, values) => this.createNoteHandler(e, values) }/>
            );
        } else {
            return (
                <Button color="secondary" onClick={ (e) => this.newNoteButtonHandler(e) }>New Note</Button>
            );
        }
    }

    render() {
        return (
            <div>
                <h1>Create New Snippet</h1>
                <Container>
                    { this.renderFormError() }
                    <SnippetForm handler={ (e, values) => this.createSnippetHandler(e, values) }/>

                    <hr />

                    <h2 className="secondary-header">Notes</h2>
                    { this.renderNotes() }
                    { this.renderNoteForm() }
                </Container>

            </div>
        );
    }

}

export default NewSnippet;
