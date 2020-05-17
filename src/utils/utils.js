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
