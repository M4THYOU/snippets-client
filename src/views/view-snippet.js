import React, { Component } from "react";
import {Button, Container} from "reactstrap";

// Components
import RawSnippet from "../components/latex-editor/partials/rawSnippet";

// Functions/Enums
import {apiPost, apiDelete, apiGet, isAuthenticated} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";
import NoteForm from "../components/noteForm";
import {isValidNoteForm, rawToTextDBField, renderNotes} from "../utils/notes";

class ViewSnippet extends Component {

    notesPerRow = 3;

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            course: null,
            created_at: null,
            id: props.match.params.id,
            is_title_math: 0,
            notes: [],
            raw: [],
            type: null,
            title: null,
            updated_at: null,
            isAddingNote: false
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                if (isAuthorized) {
                    const user = data.user;
                    this.setState({user});
                    this.getSnippet();
                    this.getNotes();
                } else {
                    this.props.history.push('/login');
                }
            });
    }

    parseNotes(notesS) {
        return notesS.map(note => {
            note.text = JSON.parse(note.text);
            return note;
        });
    }

    // api
    getSnippet() {
        apiGet(EndpointsEnum.SNIPPETS, this.state.id)
            .then(res => res.json())
            .then(result => {
                const snippet = result.data;
                snippet['raw'] = JSON.parse(snippet.raw).raw_snippet;
                const isMine = +snippet.created_by_uid === +this.state.user.id;
                snippet['isMine'] = isMine;
                snippet['isLoaded'] = true;
                this.setState(snippet);
            })
            .catch(e => {
                console.error(e);
            })
    }
    getNotes() {
        const params = {'snippet_id': this.state.id};
        apiGet(EndpointsEnum.NOTES, null, params)
            .then(res => res.json())
            .then(result => {
                const notesS = result.data;
                const notes = this.parseNotes(notesS);
                this.setState({notes});
            })
            .catch(e => {
                console.error(e);
            });
    }

    deleteSnippetHandler(e) {
        e.preventDefault();
        apiDelete(EndpointsEnum.SNIPPETS, this.state.id)
            .then(res => res.json())
            .then(result => {
                this.props.history.push('/');
            })
            .catch(e => {
                console.error(e);
            });
    }

    editSnippetHandler(e) {
        e.preventDefault();
        this.props.history.push('/snippet/' + this.state.id + '/edit');
    }

    createNoteHandler(e, values) {
        e.preventDefault();
        const raw = values.raw;

        const validForm = isValidNoteForm(raw);
        if (!validForm) {
            return;
        }

        const note = rawToTextDBField(raw);
        const data = {notes: [note], snippet_id: this.state.id};
        apiPost(EndpointsEnum.NOTES, data)
            .then(res => res.json())
            .then(result => {
                let note = result.data;
                let notes = this.state.notes.slice();

                note.text = JSON.parse(note.text);
                notes.push(result.data);
                this.setState({isAddingNote: false, notes});
            })
            .catch(e => {
                console.error(e);
            });

    }

    deleteNoteHandler(e, i) {
        e.preventDefault();
        const listIndex = i - 1;
        const notes = this.state.notes.slice();

        const note = notes[listIndex];
        notes.splice(listIndex, 1);
        this.setState({notes});

        apiDelete(EndpointsEnum.NOTES, note.id);
    }

    newNoteButtonHandler(e) {
        e.preventDefault();
        this.setState({isAddingNote: true});
    }

    // ui
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

    renderTitle () {
        const jsonTitle = JSON.parse(this.state.title).raw_snippet;
        return (
            <h1><RawSnippet raw={ jsonTitle } /></h1>
        );
    }

    renderDeleteButton() {
        // if (!! this.state.snippet && (this.state.user.id === this.state.snippet.created_by_uid)) {
        if (this.state.isMine) {
            return (
                <Button outline color="danger" className="snippet-button"
                        onClick={(e) => this.deleteSnippetHandler(e)}>Delete</Button>
            );
        }
    }

    renderEditButton() {
        // if (!! this.state.snippet && (this.state.user.id === this.state.snippet.created_by_uid)) {
        if (this.state.isMine) {
            return (
                <Button outline color="info" className="snippet-button"
                        onClick={(e) => this.editSnippetHandler(e)}>Edit</Button>
            );
        }
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <Container>
                    <div>
                        { this.renderDeleteButton() }
                        { this.renderEditButton() }
                        {this.renderTitle()}
                    </div>
                    <hr/>
                    <RawSnippet raw={this.state.raw}/>
                    <hr/>
                    <h2 className="secondary-header">Notes</h2>
                    { renderNotes(this.notesPerRow, this.state.notes, (e, i) => this.deleteNoteHandler(e, i), this.state.user.id) }
                    {this.renderNoteForm()}
                </Container>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }
    }

}

export default ViewSnippet;
