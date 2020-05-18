import React, { Component } from "react";
import {Button, Container} from "reactstrap";

// Components
import RawSnippet from "../components/latex-editor/partials/rawSnippet";

// Functions/Enums
import {apiCreate, apiDelete, apiGet} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";
import NoteForm from "../components/noteForm";
import {renderNotes} from "../utils/notes";

class ViewSnippet extends Component {

    notesPerRow = 3;

    constructor(props) {
        super(props);

        this.state = {
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
        this.getSnippet();
        this.getNotes();
    }

    // api
    getSnippet() {
        apiGet(EndpointsEnum.SNIPPETS, this.state.id)
            .then(res => res.json())
            .then(result => {
                const snippet = result.data;
                snippet['raw'] = JSON.parse(snippet.raw).raw_snippet;
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
                const notes = result.data;
                this.setState({notes});
            })
            .catch(e => {
                console.error(e);
            });
    }

    // note handling
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

        const data = {notes: [text], snippet_id: this.state.id};
        apiCreate(EndpointsEnum.NOTES, data)
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let notes = this.state.notes.slice();
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
        if (this.state.is_title_math) {
            const math = [{
                isMath: true,
                value: this.state.title
            }];
            return (
                <h1><RawSnippet raw={ math } /></h1>
            );
        } else {
            return (
                <h1>{ this.state.title }</h1>
            );
        }
    }

    render() {
        return (
            <Container>
                { this.renderTitle() }
                <hr />
                <RawSnippet raw={this.state.raw}/>
                <hr />
                <h2 className="secondary-header">Notes</h2>
                { renderNotes(this.notesPerRow, this.state.notes, (e, i) => this.deleteNoteHandler(e, i)) }
                { this.renderNoteForm() }
            </Container>
        );
    }

}

export default ViewSnippet;
