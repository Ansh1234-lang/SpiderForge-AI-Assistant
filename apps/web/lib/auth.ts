const TOKEN_KEY = "spiderforge_token"

export const auth = {
    saveToken(token: string) { localStorage.setItem(TOKEN_KEY, token) },
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },
    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    },
    isAuthenticate() {
        return !!localStorage.getItem(TOKEN_KEY)
    }
}
