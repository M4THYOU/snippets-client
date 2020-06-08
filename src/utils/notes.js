import NoteCard from "../components/notes/note-card";
import {Col, Row} from "reactstrap";
import {chunkArray} from "./utils";
import React from "react";

// Rendering notes
function renderSingleNote(text, i, deleteHandler, isMine) {
    return <NoteCard text={ text }
                     key={ i }
                     id={ i }
                     isMine={ isMine }
                     deleteHandler={ (e) => deleteHandler(e, i) }
    />;
}
function renderNotesRow(notesPerRow, notes, row_i, deleteHandler, currentUid) {
    return notes.map((note, i) => {
        const rows = row_i * notesPerRow;
        const col = i + 1;
        const index = rows + col;
        const isMine = +note.created_by_uid === +currentUid;
        return (
            <Col sm={ Math.round(12/notesPerRow) } key={'col_' + i}>
                {renderSingleNote(note.text, index, deleteHandler, isMine)}
            </Col>
        );
    });
}
/**
 * renders the specified array of notes in a table format.
 * @param notesPerRow {Number} number of notes to display in each row
 * @param notes {Object[]} array of object, each is a note object.
 * @param deleteHandler {function} what to do when delete button is pressed
 * @param currentUid {Number} uid of the currently authenticated user.
 * @returns {*[]} components to be rendered
 */
export function renderNotes(notesPerRow, notes, deleteHandler, currentUid) {
    const noteRows = chunkArray(notesPerRow, notes);
    return noteRows.map((row, i) => {
        return (
            <Row className="margin-bottom" key={ 'row_' + i }>
                { renderNotesRow(notesPerRow, row, i, deleteHandler, currentUid) }
            </Row>
        );
    });
}

// empty note
export function genNote(id, raw, snippet_id) {
    const text = rawToTextDBField(raw);
    return {
        id,
        text,
        snippet_id,
        created_at: null,
        updated_at: null,
    };
}

// NOT for snippets raw field, just notes.
export function rawToTextDBField(raw) {
    return {
        'raw': raw
    };
}

// note handling
export function isValidNoteForm(raw) {
    if (raw.length === 0) {
        alert('Please enter a snippet!');
        return false;
    }
    return true;
}
