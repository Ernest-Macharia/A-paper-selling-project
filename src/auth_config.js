// src/auth_config.js

export const authConfig = {
    domain: 'gradesworld.us.auth0.com',
    clientId: '<YOUR_AUTH0_CLIENT_ID>',
    authorizationParams: {
        audience: 'https://gradesworld.us.auth0.com/api/v2/',
        redirect_uri: window.location.origin,
    },
};
