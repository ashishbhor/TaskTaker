import API_BASE_URL from "./api";
import { authHeader } from "./authHeader";

export async function getTasks() {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
        headers: authHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
}

export async function createTask(task: any) {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        },
        body: JSON.stringify(task),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
}

export async function updateTask(id: string, task: any) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        },
        body: JSON.stringify(task),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
}

export async function deleteTask(id: string) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
}
