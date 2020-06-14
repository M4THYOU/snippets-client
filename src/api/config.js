const EndpointsEnum = Object.freeze({
    'local':'http://localhost:3000/api/',
    'deploy': 'https://snippets-api-v1.herokuapp.com/api/'
});
const ApiVersionsEnum = Object.freeze({
    'V1':'v1/'
});

let base;
// eslint-disable-next-line no-restricted-globals
switch (location.hostname) {
    case 'localhost':
        base = EndpointsEnum.local;
        break
    default:
        base = EndpointsEnum.deploy;
}

// Start config
const version = ApiVersionsEnum.V1;
// End config

const apiUrlBase = base + version;
export default apiUrlBase;

