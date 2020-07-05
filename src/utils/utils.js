/**
 * Converts an array into a nested array where each subarray is (max) of length size.
 * @param size {Number} size of each subarray.
 * @param arr {[]} array to be parsed.
 * @returns {[]|*[]}
 */
export function chunkArray(size, arr) {
    if (size < 1) {
        return [];
    }

    let newArr = []
    let i, j, temp, chunk = size;
    for (i=0,j=arr.length; i<j; i+=chunk) {
        temp = arr.slice(i,i+chunk);
        newArr.push(temp);
    }
    return newArr;
}

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

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
