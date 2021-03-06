/**
 * Converts a raw snippet into a string the api/db is capable of parsing.
 * @param snippet {Object[]} Where each object has the fields isMath{bool} and value{string}.
 * @return {String}
 */
import {IRawPart} from "../interfaces/snippets";
import {CourseType, SnippetType} from "../interfaces/db";

export function buildSnippet(snippet: IRawPart[]) {
    const rawJson = {
        raw_snippet: snippet
    }
    return JSON.stringify(rawJson);
}

export function isValidSnippetForm(rawTitle: IRawPart[], type: SnippetType, course: CourseType, raw: IRawPart[]) {
    if (rawTitle.length === 0) {
        alert('Please enter a title.');
        return false;
    }
    if (!type) {
        alert('Please select a type.');
        return false;
    }
    if (!course) {
        alert('Please select a course.');
        return false;
    }
    if (raw.length === 0) {
        alert('Please enter a snippet!');
        return false;
    }
    return true;
}
