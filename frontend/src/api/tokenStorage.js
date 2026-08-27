// sessionStorage is isolated per browser tab (unlike cookies/localStorage, which are shared
// across every tab of the same origin) — so a user and an admin can be logged in
// simultaneously in two tabs of the same browser without one session overwriting the other.
const STORAGE_KEY = "campuscode-token";

export const getToken = () => sessionStorage.getItem(STORAGE_KEY);
export const setToken = (token) => sessionStorage.setItem(STORAGE_KEY, token);
export const clearToken = () => sessionStorage.removeItem(STORAGE_KEY);
