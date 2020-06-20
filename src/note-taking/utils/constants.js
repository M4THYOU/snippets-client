import {CanvasModesEnum, PenColoursEnum, PenStatesEnum} from "./enums";

export const MAX_PEN_WIDTH = 41;
export const MIN_PEN_WIDTH = 1;

export const CANVAS_DEFAULTS = {
    mode: CanvasModesEnum.DRAW,
    pen: PenStatesEnum.UP,
    lineWidth: 6,
    penColour : PenColoursEnum.BLACK,
    penCoords: [0, 0],

    scale: 1,
    scaleStep: 0.25
};