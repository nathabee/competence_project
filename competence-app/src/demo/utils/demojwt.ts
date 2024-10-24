// src/utils/demoJwt.ts

// Specify the return type as string for the token function
export const getTokenFromCookies = (): string => {
  // For the demo, always return a valid token
  return "fake-demo-token";
};

// Specify the parameter type as string and return type as boolean
export const isTokenExpired = (token: string): boolean => {
  // In the demo, assume token is always valid
  return token !== token;  // This condition will always be false
};
