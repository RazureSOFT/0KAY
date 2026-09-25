/** Shared HTTP helpers. Every Core API call goes through here so response
 *  handling (errors, non-JSON bodies) stays consistent. */

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Parse a JSON response, turning non-JSON bodies (404/HTML) into readable errors. */
export async function readApiResponse(res: Response): Promise<any> {
  const text = await res.text()
  let data: any = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new ApiError(text.trim().slice(0, 200) || `HTTP ${res.status}`, res.status)
    }
  }
  if (!res.ok) throw new ApiError(data?.error || `HTTP ${res.status}`, res.status)
  return data
}

export async function apiGet<T = any>(path: string): Promise<T> {
  return readApiResponse(await fetch(path))
}

export async function apiSend<T = any>(path: string, method: string, body?: unknown): Promise<T> {
  return readApiResponse(await fetch(path, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }))
}

export const apiPost = <T = any>(path: string, body?: unknown) => apiSend<T>(path, 'POST', body)
export const apiPut = <T = any>(path: string, body?: unknown) => apiSend<T>(path, 'PUT', body)
export const apiPatch = <T = any>(path: string, body?: unknown) => apiSend<T>(path, 'PATCH', body)
export const apiDelete = <T = any>(path: string) => apiSend<T>(path, 'DELETE')
