import {CANVAS_DEFAULTS} from "./constants";
import {ILesson} from "../../interfaces/lessons";

export function getCanvasDefaults(pages: ILesson[] = []) {
    const defaults = CANVAS_DEFAULTS;
    defaults.pages = pages;

    if (pages.length > 0) {
        const page = pages[0];
        if (page.title) {
            defaults.title = page.title;
        }
        if (page.course) {
            defaults.course = page.course;
        }
    }

    return defaults;
}

export function getBlankPage(pagesLength: number, group_id?: number) {
    return {
        canvas: "{\"raw_canvas\": []}",
        group_order: pagesLength + 1,
        group_id
    };
}
