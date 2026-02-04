import { apiFetch } from "./api";

export function signup(fullName: string, email: string, password: string) {
    return apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
    });
}

export async function login(email: string, password: string) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", data.token);
    return data;
}

export function logout() {
    localStorage.removeItem("token");
}
