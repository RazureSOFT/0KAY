/** Shared HTTP helpers. Every Core API call goes through here so response
 *  handling (errors, non-JSON bodies) stays consistent. */

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Parse a JSON response, turning non-JSON bodies (404/HTML) into readable errors.
 *
 *  The body shape is endpoint-specific and genuinely dynamic, so callers supply
 *  `T` (default `unknown`); this helper only guarantees parsed JSON or an
 *  `ApiError` — it does not validate the shape at runtime. */
export async function readApiResponse<T = unknown>(res: Response): Promise<T | null> {
  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new ApiError(text.trim().slice(0, 200) || `HTTP ${res.status}`, res.status)
    }
  }
  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error
    throw new ApiError(message || `HTTP ${res.status}`, res.status)
  }
  return data as T | null
}

export async function apiGet<T = unknown>(path: string): Promise<T | null> {
  return readApiResponse<T>(await fetch(path))
}

export async function apiSend<T = unknown>(path: string, method: string, body?: unknown): Promise<T | null> {
  return readApiResponse<T>(await fetch(path, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }))
}

export const apiPost = <T = unknown>(path: string, body?: unknown) => apiSend<T>(path, 'POST', body)
export const apiPut = <T = unknown>(path: string, body?: unknown) => apiSend<T>(path, 'PUT', body)
export const apiPatch = <T = unknown>(path: string, body?: unknown) => apiSend<T>(path, 'PATCH', body)
export const apiDelete = <T = unknown>(path: string) => apiSend<T>(path, 'DELETE')
