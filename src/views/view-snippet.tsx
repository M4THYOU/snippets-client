import React, {Component} from "react";
import {Button, Container} from "reactstrap";

// Components
import { RawSnippet } from "../components/latex-editor/partials/rawSnippet";

// Functions/Enums
import {apiDelete, apiGet, apiPost, isAuthenticated} from "../api/functions";
import {Endpoint} from "../api/endpoints";
import { NoteForm } from "../components/noteForm";
import {isValidNoteForm, rawToTextDBField, renderNotes} from "../utils/notes";
import {INote} from "../interfaces/notes";
import {CourseType, DATETIME, IRawPart, SnippetType} from "../interfaces/snippets";
import {IUser} from "../interfaces/users";

interface Props {
    history: any;
}

interface State {
    id: number;
    isLoaded: boolean;
    error?: string;

    isAddingNote: boolean;
    isMine: boolean;

    notes: INote[];
    raw: IRawPart[];

    user?: IUser;
    title?: string;
    course?: CourseType;
    type?: SnippetType;
    created_at?: DATETIME;
    updated_at?: DATETIME;
}

export class ViewSnippet extends Component<Props, State> {

    NOTES_PER_ROW = 3;

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            isLoaded: false,
            isMine: false,
            notes: [],
            raw: [],
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
        apiGet(Endpoint.SNIPPETS, this.state.id)
            .then(res => res.json())
            .then(result => {
                const snippet = result.data;
                snippet['raw'] = JSON.parse(snippet.raw).raw_snippet;
                snippet['isMine'] = (!!this.state.user && +snippet.created_by_uid === +this.state.user.id);
                snippet['isLoaded'] = true;
                this.setState(snippet);
            })
            .catch(e => {
                console.error(e);
            })
    }
    getNotes() {
        const params = {'snippet_id': this.state.id};
        apiGet(Endpoint.NOTES, undefined, params)
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
        apiDelete(Endpoint.SNIPPETS, this.state.id)
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
        apiPost(Endpoint.NOTES, data)
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

        apiDelete(Endpoint.NOTES, note.id);
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
        let jsonTitle = [];
        if (this.state.title) {
            jsonTitle = JSON.parse(this.state.title).raw_snippet;
        }
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
        if (this.state.isLoaded && !!this.state.user) {
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
                    { renderNotes(this.NOTES_PER_ROW, this.state.notes, (e, i) => this.deleteNoteHandler(e, i), this.state.user.id) }
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
