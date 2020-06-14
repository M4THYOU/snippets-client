import apiUrlBase, {ApisEnum} from './config';
import {EndpointsEnum} from "./endpoints";

const jwtStorageKey = 'jwt';

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

function authHeader() {
    const jwt = localStorage.getItem(jwtStorageKey);
    return jwt || '';
}
function corsHeader() {
    return ApisEnum.deploy;
}

export function apiGet(endpoint, id, params) {
    const url = buildUrl(endpoint, id, params);
    return fetch(url, {
        headers: {
            'Authorization': authHeader(),
            'Access-Control-Allow-Origin': corsHeader()
        }
    });
}

export function apiPost(endpoint, data) {
    const url = buildUrl(endpoint, null);
    const jsonData = JSON.stringify(data);
    return fetch(url, {
        method: 'POST',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader(),
            'Access-Control-Allow-Origin': corsHeader()
        },
    })
}

export function apiPatch(endpoint, id, data) {
    const url = buildUrl(endpoint, id);
    const jsonData = JSON.stringify(data);
    return fetch(url, {
        method: 'PATCH',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader(),
            'Access-Control-Allow-Origin': corsHeader()
        },
    })
}

export function apiDelete(endpoint, id) {
    const url = buildUrl(endpoint, id);
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': authHeader(),
            'Access-Control-Allow-Origin': corsHeader()
        }
    })
}

// Auth functions
export function apiLogin(email, password) {
    const data = { email, password };
    return apiPost(EndpointsEnum.AUTHENTICATE, data)
        .then(res => res.json())
        .then(result => {
            if (!!result.error) {
                return false;
            }
            localStorage.setItem(jwtStorageKey, result.auth_token);
            return true;
        })
        .catch(e => {
            return false;
        });
}

export function apiLogout() {
    localStorage.removeItem(jwtStorageKey);
}

export async function isAuthenticated() {
    return apiGet(EndpointsEnum.AUTHENTICATE)
        .then(res => res.json())
        .then(result => {
            return result;
        })
        .catch(e => {
            console.error(e);
            return false;
        });
}
