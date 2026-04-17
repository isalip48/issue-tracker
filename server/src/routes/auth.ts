// server/src/routes/auth.ts
import { Router } from "express";
import { register, login, refresh, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import {
  validate,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
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

router.post("/refresh", validate(refreshTokenSchema), refresh);

router.get("/me", protect, getMe);

export default router;
