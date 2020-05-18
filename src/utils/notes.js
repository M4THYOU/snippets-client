import NoteCard from "../components/notes/note-card";
import {Col, Row} from "reactstrap";
import {chunkArray} from "./utils";
import React from "react";

// Rendering notes
function renderSingleNote(text, i, deleteHandler) {
    return <NoteCard text={ text }
                     key={ i }
                     id={ i }
                     deleteHandler={ (e) => deleteHandler(e, i) }
    />;
}
function renderNotesRow(notesPerRow, notes, row_i, deleteHandler) {
    return notes.map((note, i) => {
        const rows = row_i * notesPerRow;
        const col = i + 1;
        const index = rows + col;
        return (
            <Col sm={ Math.round(12/notesPerRow) } key={'col_' + i}>
                {renderSingleNote(note.text, index, deleteHandler)}
            </Col>
        );
    });
}
/**
 * renders the specified array of notes in a table format.
 * @param notesPerRow {Number} number of notes to display in each row
 * @param notes {Object[]} array of object, each is a note object.
 * @param deleteHandler {function} what to do when delete button is pressed
 * @returns {*[]} components to be rendered
 */
export function renderNotes(notesPerRow, notes, deleteHandler) {
    const noteRows = chunkArray(notesPerRow, notes);
    return noteRows.map((row, i) => {
        return (
            <Row className="margin-bottom" key={ 'row_' + i }>
                { renderNotesRow(notesPerRow, row, i, deleteHandler) }
            </Row>
        );
    });
}

// empty note
export function genNote(id, text, snippet_id) {
    return {
        id,
        text,
        snippet_id,
        created_at: null,
        updated_at: null,
    };
}
