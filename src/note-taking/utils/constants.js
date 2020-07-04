import {CanvasModesEnum, PenColoursEnum, PenStatesEnum} from "./enums";

export const UNDO_REDO_COUNT = 10;

export const MAX_PEN_WIDTH = 41;
export const MIN_PEN_WIDTH = 1;
export const PEN_SIZE_CHANGE_RATE = 2;

export const CANVAS_HEIGHT = 1000;
export const CANVAS_WIDTH = 2000;

export const CANVAS_DEFAULTS = {
    mode: CanvasModesEnum.DRAW,
    pen: PenStatesEnum.UP,
    lineWidth: 3,
    penColour : PenColoursEnum.BLACK,
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
