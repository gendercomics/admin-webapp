import Keycloak from 'keycloak-js';

export default new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_AUTH_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: 'gendercomics-admin',
});
