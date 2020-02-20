const LOCAL_STORAGE_ACCESS_TOKEN = 'access-token';
const LOCAL_STORAGE_REFRESH_TOKEN = 'refresh-token';

export default class AuthService {
    storeTokens(accessToken, refreshToken) {
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, refreshToken);
    }

    clear() {
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
    }

    getAccessToken() {
        return localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    }
}
