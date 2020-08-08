import {DATETIME, IRawPart} from "./snippets";

export interface INote {
    id: number;
    snippet_id: number;
    text: IRawNote;
    created_by_uid?: number;
    created_at?: DATETIME;
    updated_at?: DATETIME;
}

export interface IRawNote {
    raw: IRawPart[];
}
