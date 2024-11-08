
import { jwtDecode } from 'jwt-decode';

//console.log("original jwt loaded env2=",process.env.NEXT_PUBLIC_ENV );
// const isDemo = process.env.NEXT_PUBLIC_ENV === 'demo';

/**
 * Interface for JWT Payload
 */
interface JwtPayload {
  exp: number; // Expiration time
  iat?: number; // Issued at time (optional)
  [key: string]: unknown; // Additional properties allowed
}

/**
 * Checks if the JWT token is expired.
 * 
 * @param {string} token - The JWT token string.
 * @returns {boolean} - True if the token is expired or invalid, false otherwise.
 */
export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    // Decode the JWT with the JwtPayload type to prevent 'any' issues
    const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // JWT exp is in seconds
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Treat token as expired if decoding fails
  }
}

/**
 * Extracts the 'authToken' from the cookies string.
 * 
 * @param {string | undefined} cookieString - The cookie string (optional).
 * @returns {string | null} - The 'authToken' if found and valid, or null if not present or expired.
 */
export function getTokenFromCookies(cookieString: string = document.cookie): string | null {
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'authToken' && !isTokenExpired(value)) { // Added validity check
      return value; // Return the valid token
    }
  }
  return null; // Return null if not found or invalid
}