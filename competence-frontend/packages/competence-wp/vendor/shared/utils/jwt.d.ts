/**
 * Checks if the JWT token is expired.
 *
 * @param {string} token - The JWT token string.
 * @returns {boolean} - True if the token is expired or invalid, false otherwise.
 */
export declare function isTokenExpired(token: string): boolean;
/**
 * Extracts the 'authToken' from the cookies string.
 *
 * @returns {string | null} - The 'authToken' if found and valid, or null if not present or expired.
 */
export declare function getToken(): string | null;
