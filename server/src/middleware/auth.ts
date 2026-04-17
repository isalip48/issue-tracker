import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
      return;
    }
    next();
  };
};
