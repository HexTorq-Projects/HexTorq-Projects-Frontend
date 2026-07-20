import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { ApiError, API_BASE_URL } from "./client";

interface RequestOptions extends RequestInit {
  /** endpoints that require a valid admin session: clear the admin session on a 401 */
  auth?: boolean;
}

/** Same choke-point pattern as apiFetch, but scoped to the admin session/token. */
export async function adminApiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...rest } = opts;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  const token = useAdminAuthStore.getState().token;
  if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  if (res.status === 401 && auth) {
    useAdminAuthStore.getState().clear();
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
