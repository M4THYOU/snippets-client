/**
 * Inserts one string into another at the given index.
 * @param s1 {String} string to be inserted into
 * @param i {Number} index to be inserted at
 * @param s2 {String} string to be inserted
 * @returns {String}
 */
export function insertIntoString(s1, i, s2) {
    if (i > 0) {
        return s1.substring(0, i) + s2 + s1.substring(i);
    }
    return s1 + s2;
}

export function rawToRawString(raw) { // TODO
    let s = '';
    raw.forEach(part => {
        if (part.isMath) {
            const newS = '`' + part.value + '`';
            s += newS;
        } else {
            s += part.value;
        }
    });
    return s;
}

export function parseRawString(s) {
    const regMatch = s.split(/`(.*?)`/);
    if (s.length === 0) {
        return [];
    }
    let isMath = false;
    if ((s.charAt() === '`') && (s.charAt(1) !== '`') && (regMatch[0] === '')) {
        isMath = true;
    }
    let arr = [];
    regMatch.forEach(regS => {
        if (!!regS) {
            const obj = {
                isMath,
                value: regS
            };
            arr.push(obj);
            isMath = !isMath;
        }
    });
    return arr;
}
