// NOTE - Custom error type for fetch errors
interface FetchError extends Error {
    status: number;
    response: ErrorResponse;
}

// NOTE - Interface for error response structure
interface ErrorResponse {
    message?: string;
    [key: string]: any; // Allow additional properties
}

// NOTE - Interface for fetch options extending RequestInit
interface FetchOptions extends Omit<
    RequestInit,
    'headers'
> {
    headers?: Record<string, string>;
}



// NOTE - Create a fetch instance with a base URL and a custom headers object
export async function fetchInstance(
    endpoint: string = '',
    options: FetchOptions = {},
): Promise<Response> {

    const apiEndpoints = `/api/${endpoint}`;

    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options
    }

    const response = await fetch(apiEndpoints, defaultOptions);

    // NOTE - Check for invalid fetch response [response interceptor]
    if (!response.ok) {
        let errorMessage = 'Something went wrong. Please try again.'
        let errorResponse: ErrorResponse = {}

        try {
            errorResponse = await response.json();

        } catch {
            // NOTE - Set error message if response is not JSON
            errorResponse = {
                message: response.statusText || 'Something went wrong. Please try again.'
            }
        }

        // NOTE - Set error message [status code based]
        switch (response.status) {
            case 400:
                errorMessage = errorResponse?.message || "Bad request";
                break;
            case 401:
                errorMessage = errorResponse?.message || "Unauthorized";
                break;
            case 403:
                errorMessage = errorResponse?.message || "Forbidden";
                break;
            case 404:
                errorMessage = errorResponse?.message || "Resource not found";
                break;
            case 409:
                errorMessage = errorResponse?.message || "Resource already exists";
                break;
            case 500:
                errorMessage = errorResponse?.message || "Internal Server Error";
                break;
            default:
                errorMessage = errorResponse?.message || "Something went wrong. Please try again.";
        }
        // NOTE - Throw error
        const error = new Error(errorMessage) as FetchError;
        error.status = response.status;
        error.response = errorResponse;
        throw error;
    }

    return response;
}