
export type DATETIME = string | Date;

export enum CourseType {
    MATH_136 = 'Math 136',
    MATH_138 = 'Math 138',
}

export enum SnippetType {
    THEOREM = 'Theorem',
    DEFINITION = 'Definition',
}

export interface ISnippetType {
    id: number;
    name: SnippetType;
    created_at: DATETIME;
    updated_at: DATETIME;
}
export interface ICourseType {
    id: number;
    name: string;
    code: CourseType;
    created_at: DATETIME;
    updated_at: DATETIME;
}

export interface ISnippet {
    id: number;
    title: IRawSnippet;
    snippet_type: SnippetType;
    course: CourseType;
    raw: IRawSnippet;
    created_by_uid: number;
    created_at: DATETIME;
    updated_at: DATETIME;
}

// in case we need to add additional data to each snippet in the future.
export interface IRawSnippet {
    raw_snippet: IRawPart[];
}
export interface IRawPart {
    isMath: boolean;
    value: string;
}
