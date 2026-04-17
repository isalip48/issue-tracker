import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .trim(),

    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email")
      .toLowerCase(),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email")
      .toLowerCase(),

    password: z.string({ required_error: "Password is required" }),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }),
  }),
});



import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({ body: req.body });
      next(); // ✅ Validation passed
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."), 
          message: e.message,     
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
        return;
      }
      next(error); 
    }
  };