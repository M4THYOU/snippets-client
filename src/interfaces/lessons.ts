import {DATETIME} from "./snippets";
import {CourseType, URoleType} from "./db";

export interface ILesson {
    id?: number;
    title?: string;
    course?: CourseType;
    canvas: string; // IRawCanvas;
    created_by_uid?: number;
    created_at?: DATETIME;
    updated_at?: DATETIME;
    group_id?: number;
    group_order: number;
}

export interface ILessonWithRole extends ILesson {
    role_type: URoleType
}

export interface IRawCanvas {
    raw_canvas: IRawCanvasPart[]
}
export interface IRawCanvasPart {
    x: number; // x coordinate
    y: number; // y coordinate
    s: number; // stroke size
    c: string; // color
    m: string; // mode/action taken
}
