export async function authedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Response> {
    const res = await fetch(input, { ...init, credentials: "include" });

    if (res.status === 401) {
        fetch("/api/auth/logout", { method: "POST" }).catch(() => { });

        if (typeof window !== "undefined") {
            const next = window.location.pathname + window.location.search;
            window.location.href = `/login?next=${encodeURIComponent(next)}`;
        }
        throw new Error("Session expired");
    }

    return res;
}