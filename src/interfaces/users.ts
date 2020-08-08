import {DATETIME} from "./snippets";

export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    username?: string;
    email: string;
    created_at: DATETIME;
    updated_at: DATETIME;
}
