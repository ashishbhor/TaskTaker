import API_BASE_URL from "./api";

export async function signup(fullName: string, email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
}

export async function login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);


    localStorage.setItem("token", data.token);
    return data;
}

export function logout() {
    localStorage.removeItem("token");
}
