import apiUrlBase from './config';

/**
 * Appends specified params to the given url.
 * @param url {String} current valid url, without any params (and no trailing slash)
 * @param params {Object} object with all key value pairs for the params to append
 * @returns {string} a valid url
 */
function addParams(url, params) {
    let appension = url + '?';
    Object.keys(params).forEach((key, i) => {
        if (i) { // not the first
            appension += '&';
        }
        appension += `${key}=${params[key]}`;
    });
    return appension;
}

/**
 * Builds a url for the specified api and endpoint.
 * @param endpoint {String} api endpoint to access
 * @param [id] {Number} optional id to append
 * @param [params] {Object} optional object with all key value pairs for the params to append
 * @returns {string} a valid url
 */
function buildUrl(endpoint, id, params) {
    // because apiUrlBase has a trailing slash
    if (endpoint.charAt() === '/') {
        endpoint = endpoint.substring(1);
    }

    let url = apiUrlBase + endpoint;
    if (id && (url.slice(-1) === '/')) {
        url += id;
    } else if (id) {
        url = url + '/' + id;
    }

    // remove trailing '/'
    if (url.slice(-1) === '/') {
        url = url.slice(0, -1);
    }

    // append params if any are specified
    if (params) {
        url = addParams(url, params);
    }

    return url;
}

export function apiGet(endpoint, id, params) {
    const url = buildUrl(endpoint, id, params);
    return fetch(url);
}

export function apiCreate(endpoint, data) {
    const url = buildUrl(endpoint, null);
    const jsonData = JSON.stringify(data);
    return fetch(url, {
        method: 'POST',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
}

export function apiDelete(endpoint, id) {
    const url = buildUrl(endpoint, id);
    return fetch(url, {
        method: 'DELETE',
    })
}
