import {
    NextResponse,
    NextRequest
} from "next/server";


// NOTE - Custom Error Interface defination
export interface CustomError extends Error {
    status?: number;
    errors?: any[];
}

// NOTE - Interface defination for Async Handler
export interface AsyncHandler {
    (request: NextRequest): Promise<NextResponse> | NextResponse;
}


// NOTE - Interface defination for Wrapper Handler
export interface WrapperHandler {
    (request: NextRequest,): Promise<NextResponse> | NextResponse;
}


// [Utility] 

// NOTE - Error Logging
function logError(context: string, error: unknown): void {
    console.error(`${context};`, {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
    });
}

// NOTE - Error Response
function createErrorResponse(error: unknown): NextResponse {
    let status = 500;
    let message = "Internal Server Error";
    let metadata: any

    if (error instanceof Error) {
        message = error.message || "Internal Server Error";
        if (error.name === 'ClerkError') {
            status = (error as any).status || 401;
            message = error.message || "Unauthorized";
            metadata = (error as any).errors
        } else if (isCustomError(error)) {
            status = error.status || 500;
        }
    } else {
        message = 'Unknown error occurred';
    }

    // NOTE - Return error
    return NextResponse.json({
        success: false,
        message: message,
        ...(metadata && { metadata }),
    }, { status });
}

// NOTE - Type Guard for CustomError
function isCustomError(
    error: unknown
): error is CustomError {
    return error instanceof Error && "status" in error && typeof (error as any).status === "number";
}


// [Server Side]

// NOTE - Async Handler [High Order Function] 
export function catchAsync(
    fn: AsyncHandler
): WrapperHandler {
    return function (request: NextRequest): Promise<NextResponse> | NextResponse {
        try {
            const result = fn(request);

            // NOTE - Check for Promise [Handle async operations]
            if (result instanceof Promise) {
                return result.catch((error: unknown) => {
                    // NOTE - Log error
                    logError("Unhandled async error:", error);

                    // NOTE - Return error [async]
                    return createErrorResponse(error);
                });
            }

            // NOTE - Return result [Handle sync operations]
            return result;

        } catch (error: unknown) {
            // NOTE - Log error
            logError("Unhandled sync error:", error);

            // NOTE - Return error [sync]
            return createErrorResponse(error);
        }
    }
}