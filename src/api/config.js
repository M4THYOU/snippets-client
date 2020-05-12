const EndpointsEnum = Object.freeze({
    'local':'http://localhost:3000/api/'
});
const ApiVersionsEnum = Object.freeze({
    'V1':'v1/'
});

// Start config
const base = EndpointsEnum.local;
const version = ApiVersionsEnum.V1;
// End config

const apiUrlBase = base + version;
export default apiUrlBase;

