export enum Apis {
    LOCAL = 'http://localhost:3000',
    DEPLOY = 'https://snippets-api-v1.herokuapp.com'
}

enum ApiVersions {
    V1 = 'v1/'
}

let base: string;
// eslint-disable-next-line no-restricted-globals
switch (location.hostname) {
    case 'localhost':
        base = Apis.LOCAL;
        break
    default:
        base = Apis.DEPLOY;
}

// Start config
const version = ApiVersions.V1;
// End config

const apiUrlBase = base + '/api/' + version;
export default apiUrlBase;

