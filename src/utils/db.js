/**
 * Converts a raw snippet into a string the api/db is capable of parsing.
 * @param snippet {Object[]} Where each object has the fields isMath{bool} and value{string}.
 * @return {String}
 */
export function buildSnippet(snippet) {
    const rawJson = {
        raw_snippet: snippet
    }
    return JSON.stringify(rawJson);
}
