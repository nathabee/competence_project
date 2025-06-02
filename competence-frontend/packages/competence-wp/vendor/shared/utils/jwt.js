import { jwtDecode } from 'jwt-decode';
/**
 * Checks if the JWT token is expired.
 *
 * @param {string} token - The JWT token string.
 * @returns {boolean} - True if the token is expired or invalid, false otherwise.
 */
export function isTokenExpired(token) {
    if (!token)
        return true;
    try {
        // Decode the JWT with the JwtPayload type to prevent 'any' issues
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // JWT exp is in seconds
        return decodedToken.exp < currentTime;
    }
    catch (error) {
        console.error('Error decoding token:', error);
        return true; // Treat token as expired if decoding fails
    }
}
/**
 * Extracts the 'authToken' from the cookies string.
 *
 * @returns {string | null} - The 'authToken' if found and valid, or null if not present or expired.
 */
export function getToken() {
    const token = localStorage.getItem('authToken');
    if (token && !isTokenExpired(token)) {
        return token;
    }
    return null;
}
