// API utility functions

export interface APIError {
  message: string
  status?: number
  code?: string
}

export class APIException extends Error {
  status: number
  code?: string

  constructor(message: string, status: number = 500, code?: string) {
    super(message)
    this.name = 'APIException'
    this.status = status
    this.code = code
  }
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new APIException(
        data.error || data.message || 'An error occurred',
        response.status,
        data.code
      )
    }

    return data
  } catch (error) {
    if (error instanceof APIException) {
      throw error
    }
    throw new APIException('Network error. Please try again.')
  }
}

export async function apiGet<T = any>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: 'GET' })
}

export async function apiPost<T = any>(url: string, body?: any): Promise<T> {
  return apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function apiPut<T = any>(url: string, body?: any): Promise<T> {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function apiDelete<T = any>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: 'DELETE' })
}

export async function uploadFile(url: string, file: File, additionalData?: Record<string, string>): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const formData = new FormData()
  formData.append('file', file)

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new APIException(
        data.error || data.message || 'Upload failed',
        response.status
      )
    }

    return data
  } catch (error) {
    if (error instanceof APIException) {
      throw error
    }
    throw new APIException('Upload failed. Please try again.')
  }
}

export function handleAPIError(error: unknown): string {
  if (error instanceof APIException) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
