import { clsx, type ClassValue } from "clsx";
import { twMerge }               from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const now      = new Date();
  const date     = new Date(dateString);
  const diffMs   = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs  = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1)  return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs  < 24) return `${diffHrs}h ago`;
  if (diffDays < 7)  return `${diffDays}d ago`;
  return formatDate(dateString);
};