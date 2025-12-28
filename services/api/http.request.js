// utils/httpRequest.js

export const httpRequest = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
  patch: request("PATCH"),
};

function request(method) {
  return (url, body, multipart = false) => {
    const requestOptions = {
      method,
      headers: authHeader(url),
    };

    const config = useRuntimeConfig();
    const baseUrl = config.public.baseUrl;

    if (body && !multipart) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }

    if (body && multipart) {
      // Don't set Content-Type for multipart, browser will set it with boundary
      requestOptions.body = body;
    }

    return fetch(baseUrl + url, requestOptions).then(
      (response) => handleResponse(response, url),
      (error) => handleNetworkError(error, url)
    );
  };
}

// Helper functions

/**
 * Generate auth header with JWT token
 */
function authHeader(url) {
  const authStore = useAuthStore();
  const tokenCookie = useCookie("token");

  // Get token from store or cookie
  const token = authStore.token || tokenCookie.value;
  const isLoggedIn = token !== "" && token !== undefined && token !== null;

  if (isLoggedIn) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

/**
 * Handle fetch response
 */
async function handleResponse(response, url) {
  const alertStore = useAlertStore();
  const authStore = useAuthStore();

  // Check content type
  const contentType = response.headers?.get("content-type");
  const isJson = contentType?.includes("application/json");
  const isSpreadsheet = contentType?.includes("spreadsheetml");
  const isBlob = contentType?.includes("application/octet-stream") ||
    contentType?.includes("application/pdf");

  // Handle spreadsheet downloads
  if (isSpreadsheet || isBlob) {
    return Promise.resolve(response.blob());
  }

  // Parse JSON response
  const data = isJson && response.status !== 204
    ? await response.json()
    : null;

  // Check for error response
  if (!response.ok) {
    return handleErrorResponse(response, data, url, authStore, alertStore);
  }

  return data;
}

/**
 * Handle error responses
 */
function handleErrorResponse(response, data, url, authStore, alertStore) {
  const status = response.status;
  const message = data?.message || data?.error || 'An error occurred';

  // Handle 401 Unauthorized - Auto logout
  if (status === 401) {
    console.error('Unauthorized - Token invalid or expired');

    if (authStore.user) {
      alertStore?.error('Session expired. Please login again.');
      authStore.logout();
    } else {
      alertStore?.error('Authentication required');
    }

    return Promise.reject({
      status: 401,
      message: 'Unauthorized',
      data
    });
  }

  // Handle 403 Forbidden
  if (status === 403) {
    console.error('Forbidden - Access denied');
    alertStore?.error('You do not have permission to perform this action');

    return Promise.reject({
      status: 403,
      message: 'Forbidden',
      data
    });
  }

  // Handle 404 Not Found
  if (status === 404) {
    console.error(`404 - Resource not found: ${url}`);

    // Trigger Nuxt error page for 404
    showError({
      statusCode: 404,
      message: message || 'Resource not found',
    });

    return Promise.reject({
      status: 404,
      message: message || 'Not found',
      data
    });
  }

  // Handle 405 Method Not Allowed
  if (status === 405) {
    console.warn(`${url} - This endpoint is not yet implemented`);
    alertStore?.warning('This feature is not yet available');

    return Promise.reject({
      status: 405,
      message: 'Method not allowed',
      data
    });
  }

  // Handle 422 Validation Error
  if (status === 422) {
    console.error('Validation error:', data);
    alertStore?.error(message || 'Validation failed');

    return Promise.reject({
      status: 422,
      message: message || 'Validation error',
      errors: data?.errors || [],
      data
    });
  }

  // Handle 429 Too Many Requests
  if (status === 429) {
    console.error('Rate limit exceeded');
    alertStore?.error('Too many requests. Please try again later.');

    return Promise.reject({
      status: 429,
      message: 'Rate limit exceeded',
      data
    });
  }

  // Handle 500 Internal Server Error
  if (status === 500) {
    console.error('Server error:', data);
    alertStore?.error('Server error. Please try again later.');

    return Promise.reject({
      status: 500,
      message: 'Internal server error',
      data
    });
  }

  // Handle 503 Service Unavailable
  if (status === 503) {
    console.error('Service unavailable');
    alertStore?.error('Service temporarily unavailable. Please try again later.');

    return Promise.reject({
      status: 503,
      message: 'Service unavailable',
      data
    });
  }

  // Generic error handling
  console.error(`HTTP ${status} error:`, data);
  alertStore?.error(message);

  return Promise.reject({
    status,
    message,
    data
  });
}

/**
 * Handle network errors (no response from server)
 */
function handleNetworkError(error, url) {
  const alertStore = useAlertStore();

  console.error('Network error:', error, url);

  alertStore?.error('Network error. Please check your internet connection.');

  return Promise.reject({
    status: 0,
    message: 'Network error',
    error
  });
}

/**
 * Download file helper
 */
export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Export for use in components
export default httpRequest;