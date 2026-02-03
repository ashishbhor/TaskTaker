import API_BASE_URL from "./api";
import { authHeader } from "./authHeader";
import { apiFetch } from "./api";

export async function getProfile() {
    return apiFetch(`${API_BASE_URL}/me`, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        },
    });
}

export async function updateMe(fullName: string) {
    return apiFetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        },
        body: JSON.stringify({ fullName }),
    });
}
