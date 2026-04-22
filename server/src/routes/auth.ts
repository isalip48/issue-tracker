// server/src/routes/auth.ts
import { Router } from "express";
import {
  register,
  login,
  refresh,
  getMe,
  forgotPassword,
  resetPassword,
  resetPasswordDirect,
} from "../controllers/authController";
import { protect } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import {
  validate,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetPasswordDirectSchema,
} from "../utils/validators";

const router = Router();

router.post(
  "/register",
  (req, res, next) => authLimiter(req, res, next),
  validate(registerSchema),
  register,
);

router.post(
  "/login",
  (req, res, next) => authLimiter(req, res, next),
  validate(loginSchema),
  login,
);

router.post(
  "/forgot-password",
  (req, res, next) => authLimiter(req, res, next),
  validate(forgotPasswordSchema),
  forgotPassword,
);

router.post(
  "/reset-password/:token",
  (req, res, next) => authLimiter(req, res, next),
  validate(resetPasswordSchema),
  resetPassword,
);

router.post(
  "/reset-password-direct",
  (req, res, next) => authLimiter(req, res, next),
  validate(resetPasswordDirectSchema),
  resetPasswordDirect,
);

router.post("/refresh", validate(refreshTokenSchema), refresh);

router.get("/me", protect, getMe);

export default router;
