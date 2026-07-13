import { useAuthStore } from "@/store/useAuthStore";

const DEFAULT_API_BASE = import.meta.env.PROD
  ? "https://git-pipeline.metatronhost.in/hextorq-projects-web"
  : "http://localhost:4001";
const BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  /** endpoints that require a valid session: clear auth on a 401 */
  auth?: boolean;
}

/**
 * Single choke point for all API access. Injects the bearer token from the
 * auth store, normalizes errors into ApiError, and clears the session on a
 * 401 from a protected endpoint.
 */
export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...rest } = opts;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  const token = useAuthStore.getState().token;
  if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...rest, headers: finalHeaders });

  if (res.status === 401 && auth) {
    useAuthStore.getState().clear();
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || res.statusText;
    throw new ApiError(res.status, message, data && data.details);
  }

  return data as T;
}

export const API_BASE_URL = BASE;
