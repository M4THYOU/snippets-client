import {CanvasMode, PenColour, PenState} from "./enums";
import {ILesson} from "../../interfaces/lessons";
import {ICourseType} from "../../interfaces/snippets";
import {CourseType} from "../../interfaces/db";

export const UNDO_REDO_COUNT = 10;

export const MAX_PEN_WIDTH = 41;
export const MIN_PEN_WIDTH = 1;
export const PEN_SIZE_CHANGE_RATE = 2;

export const CANVAS_HEIGHT = 1000;
export const CANVAS_WIDTH = 2000;

export interface ICanvasDefault {
    mode: CanvasMode;
    pen: PenState;
    lineWidth: number;
    penColour : PenColour;
    penCoords: [number, number];

    pages: ILesson[];
    selectedPageIndex: number;

    points: any[]; // the saved state
    redoStack: any[]; // stack for the redo

    isModalOpen: boolean;

    courses: ICourseType[];
    course: CourseType | string;
    title: string;

    isSaving: boolean;
}

export const CANVAS_DEFAULTS: ICanvasDefault = {
    mode: CanvasMode.DRAW,
    pen: PenState.UP,
    lineWidth: 3,
    penColour : PenColour.BLACK,
    penCoords: [0, 0],

    pages: [],
    selectedPageIndex: 0,

    points: [], // the saved state
    redoStack: [], // stack for the redo

    isModalOpen: false,

    courses: [],
    course: '',
    title: '',

    isSaving: false,
};
