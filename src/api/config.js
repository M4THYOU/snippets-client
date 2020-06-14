export const ApisEnum = Object.freeze({
    'local':'http://localhost:3000',
    'deploy': 'https://snippets-api-v1.herokuapp.com'
});
const ApiVersionsEnum = Object.freeze({
    'V1':'v1/'
});

let base;
// eslint-disable-next-line no-restricted-globals
switch (location.hostname) {
    case 'localhost':
        base = ApisEnum.local;
        break
    default:
        base = ApisEnum.deploy;
}

// Start config
const version = ApiVersionsEnum.V1;
// End config

const apiUrlBase = base + '/api/' + version;
export default apiUrlBase;

