const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export default API_BASE_URL;

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}
