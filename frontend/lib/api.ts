import { tokenStore } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = "Une erreur est survenue";
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {}
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Auth
  register: (body: { email: string; username: string; password: string }) =>
    request<{ access_token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: async (email: string, password: string) => {
    // OAuth2 attend un form-urlencoded (champ "username")
    const form = new URLSearchParams({ username: email, password });
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new ApiError(res.status, data.detail || "Connexion impossible");
    }
    return res.json() as Promise<{ access_token: string }>;
  },
  me: () => request<import("./types").User>("/api/auth/me"),
  updateMe: (body: { username?: string; avatar_color?: string }) =>
    request<import("./types").User>("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Tasks
  listTasks: () => request<import("./types").Task[]>("/api/tasks"),
  createTask: (body: Partial<import("./types").Task>) =>
    request<import("./types").Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateTask: (id: number, body: Partial<import("./types").Task>) =>
    request<import("./types").Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  completeTask: (id: number) =>
    request<import("./types").CompleteResult>(`/api/tasks/${id}/complete`, {
      method: "POST",
    }),
  reopenTask: (id: number) =>
    request<import("./types").Task>(`/api/tasks/${id}/reopen`, { method: "POST" }),
  deleteTask: (id: number) =>
    request<void>(`/api/tasks/${id}`, { method: "DELETE" }),

  // Stats & achievements
  stats: () => request<import("./types").Stats>("/api/stats"),
  achievements: () => request<import("./types").Achievement[]>("/api/achievements"),
};

export { ApiError };
