import React, { Component } from "react";
import {Container, Alert, Button} from "reactstrap";

// Components
import SnippetForm from "../components/snippetForm";
import NoteForm from "../components/noteForm";

// Functions/Enums
import {apiPost, isAuthenticated} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";
import {buildSnippet} from "../utils/snippets";
import {genNote, isValidNoteForm, renderNotes} from "../utils/notes";
import {isValidSnippetForm} from "../utils/snippets";

class NewSnippet extends Component {

    notesPerRow = 4;

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            isAddingNote: false,
            notes: []//this.genNotes(14)
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                if (isAuthorized) {
                    const user = data.user;
                    this.setState({isLoaded: true, user});
                } else {
                    this.props.history.push('/login');
                }
            });
    }

    genNotes(count) {
        let temp = [];
        for (let i = 1; i <= count; i++) {
            temp.push(genNote(i, `${i}`, null));
        }
        return temp;
    }

    createSnippetHandler(e, values) {
        e.preventDefault();
        const rawTitle = values.rawTitle;
        const type = values.type;
        const course = values.course;
        const raw = values.raw;

        const validForm = isValidSnippetForm(rawTitle, type, course, raw);
        if (!validForm) {
            return;
        }

        const snippet = buildSnippet(raw);
        const title = buildSnippet(rawTitle);
        let data = {
            title,
            snippet_type: type,
            course,
            raw: snippet,
        };

        apiPost(EndpointsEnum.SNIPPETS, data)
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
                    apiPost(EndpointsEnum.NOTES, notes);
                    this.props.history.push('/');
                }
            })
            .catch(e => {
                this.setState({error: e.toString()});
            });
    }

    createNoteHandler(e, values) {
        e.preventDefault();
        const raw = values.raw;

        const validForm = isValidNoteForm(raw);
        if (!validForm) {
            return;
        }
        let notes = this.state.notes.slice();
        let newNote = genNote(null, raw, null);
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
        if (this.state.isLoaded) {
            return (
                <div>
                    <h1>Create New Snippet</h1>
                    <Container>
                        {this.renderFormError()}
                        <SnippetForm handler={(e, values) => this.createSnippetHandler(e, values)}/>

                        <hr/>
                        <h2 className="secondary-header">Notes</h2>
                        { renderNotes(this.notesPerRow, this.state.notes, (e, i) => this.deleteNoteHandler(e, i), +this.state.user.id) }
                        {this.renderNoteForm()}
                    </Container>

                </div>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }
    }

}

export default NewSnippet;
