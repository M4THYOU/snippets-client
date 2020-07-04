import {CANVAS_DEFAULTS} from "./constants";

export function getCanvasDefaults(pages = []) {
    const defaults = CANVAS_DEFAULTS;
    defaults.pages = pages;

    if (pages.length > 0) {
        defaults.title = pages[0].title;
        defaults.course = pages[0].course;
    }

    return defaults;
}

export function getBlankPage(pagesLength, group_id) {
    return {
        canvas: "{\"raw_canvas\": []}",
        group_order: pagesLength + 1,
        group_id
    };
}
