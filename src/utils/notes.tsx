import {INote} from "../interfaces/notes";

// empty note
export function genNote(id: number, raw, snippet_id: number): INote {
    const text = rawToTextDBField(raw);
    return {
        id,
        text,
        snippet_id,
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
