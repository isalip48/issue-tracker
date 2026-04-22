import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return secret;
};

/**
 * Generates both an Access Token (15m) and a Refresh Token (7d).
 * Access tokens are sent with every request, while refresh tokens are only
 * used when the access token expires.
 */
export const generateTokens = (payLoad: TokenPayload): TokenPair => {
  const accessToken = jwt.sign(payLoad, getJWTSecret(), { expiresIn: "15m" });

  const refreshToken = jwt.sign(payLoad, getRefreshSecret(), {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, getJWTSecret());
    return decoded as TokenPayload;
  } catch (err) {
    throw new Error("Invalid or Expired access token");
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, getRefreshSecret());
    return decoded as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
