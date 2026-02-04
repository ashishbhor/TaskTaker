import { apiFetch } from "./api";
import { authHeader } from "./authHeader";

export function getTasks(page = 1, limit = 5, sort = "newest") {
    return apiFetch(`/tasks?page=${page}&limit=${limit}&sort=${sort}`, {
        headers: authHeader(),
    });
}

export function createTask(task: any) {
    return apiFetch("/tasks", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(task),
    });
}

export function updateTask(id: string, task: any) {
    return apiFetch(`/tasks/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(task),
    });
}

export function deleteTask(id: string) {
    return apiFetch(`/tasks/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
}
