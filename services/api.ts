const API_BASE_URL = "http://localhost:5000/api/v1";
export default API_BASE_URL;

export async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}
