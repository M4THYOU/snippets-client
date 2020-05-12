import apiUrlBase from './config';

function buildUrl(endpoint, id) {
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
    return url;
}

export function apiGet(endpoint, id) {
    const url = buildUrl(endpoint, id);
    return fetch(url);
}
