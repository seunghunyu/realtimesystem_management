// ── Base API Client ──────────────────────────────────────────────────────────
// Usage: import { apiClient } from "@/app/lib/apiClient"
//
// Base URL resolves in order:
//   1. VITE_API_BASE_URL env variable  (set in .env)
//   2. Falls back to http://localhost:8080

const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8111";

// ── types ────────────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export interface ApiError {
  ok: false;
  status: number;
  message: string;
  /** raw response body, if any */
  detail?: unknown;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  /** additional headers merged on top of defaults */
  headers?: Record<string, string>;
  /** abort signal for cancellation */
  signal?: AbortSignal;
}

// ── internals ────────────────────────────────────────────────────────────────

function defaultHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Attach Bearer token if stored in sessionStorage / localStorage
  const token =
    sessionStorage.getItem("access_token") ??
    localStorage.getItem("access_token");
  if (token) h["Authorization"] = `Bearer ${token}`;

  return h;
}

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const url = `${BASE_URL}${path}`;

  const init: RequestInit = {
    method,
    headers: { ...defaultHeaders(), ...options.headers },
    signal: options.signal,
  };

  if (body !== undefined && method !== "GET" && method !== "DELETE") {
    init.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, init);

    // Try to parse JSON; fall back to text
    let data: unknown;
    const contentType = res.headers.get("Content-Type") ?? "";
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractMessage(data) ?? `HTTP ${res.status}`,
        detail: data,
      };
    }

    return { ok: true, status: res.status, data: data as T };
  } catch (err: unknown) {
    // Network-level error (DNS, CORS, offline, AbortError …)
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    return {
      ok: false,
      status: isAbort ? 0 : -1,
      message: isAbort ? "요청이 취소되었습니다." : "네트워크 오류가 발생했습니다.",
      detail: err,
    };
  }
}

function extractMessage(body: unknown): string | undefined {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    const candidate = b["message"] ?? b["error"] ?? b["detail"];
    if (typeof candidate === "string") return candidate;
  }
  return undefined;
}

// ── public API ───────────────────────────────────────────────────────────────

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>("GET", path, undefined, options);
  },

  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>("POST", path, body, options);
  },

  put<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>("PUT", path, body, options);
  },

  patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>("PATCH", path, body, options);
  },

  delete<T = void>(path: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>("DELETE", path, undefined, options);
  },
};
