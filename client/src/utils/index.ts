import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import type { Issue } from "@/types";

export const PRIORITY_COLORS = {
  Low: "#334155",
  Medium: "#0ea5e9",
  High: "#6366f1",
  Critical: "#f43f5e",
};

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must include uppercase, lowercase, and a number",
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    role: z.enum(["Admin", "QA", "Developer", "Other"], {
      required_error: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const exportToCSV = (issues: Issue[], filename = "issues"): void => {
  const headers = [
    "ID",
    "Title",
    "Status",
    "Priority",
    "Severity",
    "Reporter",
    "Tags",
    "Created At",
  ];

  const rows = issues.map((issue) => [
    issue._id.slice(-6),
    `"${issue.title.replace(/"/g, '""')}"`,
    issue.status,
    issue.priority,
    issue.severity,
    issue.reporter?.name || "Unknown",
    `"${issue.tags?.join(", ") || ""}"`,
    new Date(issue.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (issues: Issue[], filename = "issues"): void => {
  const jsonContent = JSON.stringify(issues, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const issueFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  status: z.enum(["Open", "In Progress", "Resolved", "Closed"]).default("Open"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).default("Medium"),
  severity: z.enum(["Minor", "Major", "Critical", "Blocker"]).default("Minor"),
  tags: z.array(z.string()).default([]),
  assignee: z.string().nullable().optional(),
});

export type IssueFormData = z.output<typeof issueFormSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
