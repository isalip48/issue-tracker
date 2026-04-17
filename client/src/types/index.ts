export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export type IssuePriority = "Low" | "Medium" | "High" | "Critical";

export type IssueSeverity = "Minor" | "Major" | "Critical" | "Blocker";

export type UserRole = "Admin" | "Developer" | "Viewer";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  tags: string[];
  assignee?: User | null;
  reporter: User;
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityLog {
  _id: string;
  issueId: string;
  user: User;
  action: string;
  changes?: Record<
    string,
    {
      from: unknown;
      to: unknown;
    }
  >;
  createdAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IssueFilters {
  search?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  severity?: IssueSeverity;
  page?: number;
  limit?: number;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}
