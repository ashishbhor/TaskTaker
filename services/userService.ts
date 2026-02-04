import { apiFetch } from "./api";
import { authHeader } from "./authHeader";

export function getProfile() {
    return apiFetch("/me", {
        headers: authHeader(),
    });
}

export function updateMe(fullName: string) {
    return apiFetch("/me", {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ fullName }),
    });
}
