import {CANVAS_DEFAULTS} from "./constants";

export function getCanvasDefaults(pages = []) {
    const defaults = CANVAS_DEFAULTS;
    defaults.pages = pages;
    return defaults;
}

export function getBlankPage(pagesLength, group_id) {
    return {
        canvas: "{\"raw_canvas\": []}",
        group_order: pagesLength + 1,
        group_id
    };
}