import api from "@/api/axios";
import type {
  Issue,
  IssueFilters,
  APIResponse,
  PaginatedResponse,
} from "@/types";

export interface IssueStats {
  total: number;
  byStatus: {
    Open: number;
    "In Progress": number;
    Resolved: number;
    Closed: number;
  };
  byPriority: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
  trend: Array<{
    _id: string;
    count: number;
  }>;
}

export interface CreateIssueData {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  severity?: string;
  tags?: string[];
  assignee?: string;
}

export type UpdateIssueData = Partial<CreateIssueData>;

export const issuesApi = {
  getAll: async (
    filters: IssueFilters = {},
  ): Promise<PaginatedResponse<Issue>> => {
    const { data } = await api.get("/issues", { params: filters });
    return data;
  },

  getById: async (id: string): Promise<APIResponse<{ issue: Issue }>> => {
    const { data } = await api.get<APIResponse<{ issue: Issue }>>(
      `/issues/${id}`,
    );
    return data;
  },

  getStats: async (): Promise<APIResponse<IssueStats>> => {
    const { data } = await api.get("/issues/stats");
    return data;
  },

  create: async (
    issueData: CreateIssueData,
  ): Promise<APIResponse<{ issue: Issue }>> => {
    const { data } = await api.post("/issues", issueData);
    return data;
  },

  update: async (
    id: string,
    issueData: UpdateIssueData,
  ): Promise<APIResponse<{ issue: Issue }>> => {
    const { data } = await api.patch(`/issues/${id}`, issueData);
    return data;
  },

  delete: async (id: string): Promise<APIResponse<void>> => {
    const { data } = await api.delete(`/issues/${id}`);
    return data;
  },

  getActivity: async (id: string) => {
    const { data } = await api.get(`/issues/${id}/activity`);
    return data;
  },
};
