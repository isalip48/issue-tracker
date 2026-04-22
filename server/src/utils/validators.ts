import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import {
  ISSUE_STATUSES,
  ISSUE_PRIORITIES,
  ISSUE_SEVERITIES,
} from "../models/Issue";

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
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
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

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email")
      .toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        ),
      confirmPassword: z.string({
        required_error: "Confirm password is required",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const resetPasswordDirectSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email")
        .toLowerCase(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        ),
      confirmPassword: z.string({
        required_error: "Confirm password is required",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
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

export const createIssueSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, "Title must be at least 3 characters")
      .max(150, "Title cannot exceed 150 characters")
      .trim(),

    description: z
      .string({ required_error: "Description is required" })
      .min(10, "Description must be at least 10 characters"),

    status: z
      .enum(ISSUE_STATUSES as unknown as [string, ...string[]])
      .optional()
      .default("Open"),

    priority: z
      .enum(ISSUE_PRIORITIES as unknown as [string, ...string[]])
      .optional()
      .default("Medium"),

    severity: z
      .enum(ISSUE_SEVERITIES as unknown as [string, ...string[]])
      .optional()
      .default("Minor"),

    tags: z.array(z.string().trim().toLowerCase()).optional(),
    project: z.string({ required_error: "Project is required" }).trim(),
    assignee: z.string().optional(),
  }),
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Project name is required" })
      .min(2, "Project name must be at least 2 characters")
      .max(50, "Project name cannot exceed 50 characters")
      .trim(),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: createProjectSchema.shape.body.partial(),
});

export const updateIssueSchema = z.object({
  body: createIssueSchema.shape.body.partial(),
});

export const issueQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    search: z.string().optional(),
    status: z
      .enum(ISSUE_STATUSES as unknown as [string, ...string[]])
      .optional(),
    priority: z
      .enum(ISSUE_PRIORITIES as unknown as [string, ...string[]])
      .optional(),
    severity: z
      .enum(ISSUE_SEVERITIES as unknown as [string, ...string[]])
      .optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "priority", "severity"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});
