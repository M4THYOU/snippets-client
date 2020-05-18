import React, { Component } from "react";
import {Container, Alert, Button} from "reactstrap";

// Components
import SnippetForm from "../components/snippetForm";
import NoteForm from "../components/noteForm";
import Editor from "../components/latex-editor/editor";

// Functions/Enums
import {apiCreate} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";
import {buildSnippet} from "../utils/db";
import {genNote, renderNotes} from "../utils/notes";

class NewSnippet extends Component {

    notesPerRow = 4;

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isAddingNote: false,
            notes: []//this.genNotes(14)
        };
    }

    genNotes(count) {
        let temp = [];
        for (let i = 1; i <= count; i++) {
            temp.push(genNote(i, `${i}`, null));
        }
        return temp;
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
            raw: snippet,
            is_title_math: 0
        };

        // if title is wrapped in backticks, it must be math.
        if (title[0] === "`" && title[title.length - 1] === "`") {
            data.title = data.title.substring(1, data.title.length-1);
            data.is_title_math = 1;
        }

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
                    const notesArray = this.state.notes.map(note => note.text);
                    const notes = {
                        'notes': notesArray,
                        'snippet_id': result.data.id
                    }
                    apiCreate(EndpointsEnum.NOTES, notes);
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
        let newNote = genNote(null, text, null);
        notes.push(newNote);
        this.setState({isAddingNote: false, notes});
    }

    deleteNoteHandler(e, i) {
        e.preventDefault();

        const listIndex = i - 1;
        const notes = this.state.notes.slice();

        notes.splice(listIndex, 1);
        this.setState({notes});
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
                    <Editor />

                    <h2 className="secondary-header">Notes</h2>
                    { renderNotes(this.notesPerRow, this.state.notes, (e, i) => this.deleteNoteHandler(e, i)) }
                    { this.renderNoteForm() }
                </Container>

            </div>
        );
    }

}

export default NewSnippet;
