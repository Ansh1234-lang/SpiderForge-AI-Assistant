const TOKEN_KEY = "spiderforge_token"
const USER_KEY = "spiderforge-user"
export const auth = {
    saveToken(token: string) { localStorage.setItem(TOKEN_KEY, token) },
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },
    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    },
    saveUser(user:{id:string,email:string,role:string}){localStorage.setItem(USER_KEY,JSON.stringify(user))},
    getUser(){
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user):null;
    },
    isAuthenticate() {
        return !!localStorage.getItem(TOKEN_KEY)
    }
}
