// Thin fetch wrapper around the back-end REST API.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Registered by AuthContext: called when a protected request answers 401.
let unauthorizedHandler = null
// Registered by App: a navigate() function used to redirect after 401.
let navigateHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function setNavigateHandler(navigateFn) {
  navigateHandler = navigateFn
}

/**
 * Send an HTTP request to the back-end.
 * @param {string} path - API path starting with "/" (e.g. "/projects").
 * @param {object} options
 * @param {string} [options.method='GET']
 * @param {object} [options.body] - JSON body, serialized automatically.
 * @param {string} [options.token] - JWT for protected requests.
 * @param {boolean} [options.requireAuth=false] - attach Bearer token and run 401 handling.
 * @returns {Promise<any>} parsed JSON response.
 */
export async function apiRequest(path, { method = 'GET', body, token, requireAuth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (requireAuth && token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  }

  if (!response.ok) {
    const error = new Error(
      (data && data.message) || `Request failed with status ${response.status}`
    )
    error.status = response.status
    error.data = data
    // Only protected requests trigger the global logout + redirect flow.
    if (response.status === 401 && requireAuth) {
      if (unauthorizedHandler) unauthorizedHandler()
      if (navigateHandler) navigateHandler('/login')
    }
    throw error
  }

  // Normalize the back-end envelope: list/single responses wrap the
  // payload in { success, count?, data }; return the payload itself.
  if (data && typeof data === 'object' && !Array.isArray(data) &&
      Object.prototype.hasOwnProperty.call(data, 'data')) {
    return data.data
  }
  return data
}

// Convenience wrappers.
export const get = (path, options = {}) => apiRequest(path, { ...options, method: 'GET' })
export const post = (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body })
export const put = (path, body, options = {}) => apiRequest(path, { ...options, method: 'PUT', body })
export const del = (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' })
