/**
 * Core Type Definitions and Error Codes
 * Shared across the entire application.
 */

export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    DUPLICATE_ERROR: 'DUPLICATE_ERROR',
};

/**
 * Result pattern for service responses
 * @template T
 * @param {T} data 
 * @returns {{success: true, data: T, error: null, code: null}}
 */
export const success = (data) => ({
    success: true,
    data,
    error: null,
    code: null,
});

/**
 * Failure result pattern
 * @param {string} message 
 * @param {string} code 
 * @returns {{success: false, data: null, error: string, code: string}}
 */
export const failure = (message, code = ErrorCodes.SERVER_ERROR) => ({
    success: false,
    data: null,
    error: message,
    code,
});
