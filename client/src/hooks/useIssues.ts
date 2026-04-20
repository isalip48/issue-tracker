import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  issuesApi,
  type CreateIssueData,
  type UpdateIssueData,
} from "@/api/issues";
import type { IssueFilters } from "@/types";

export const issueKeys = {
  all: () => ["issues"] as const,
  lists: () => ["issues", "list"] as const,
  list: (f: IssueFilters) => ["issues", "list", f] as const,
  details: () => ["issues", "detail"] as const,
  detail: (id: string) => ["issues", "detail", id] as const,
  stats: () => ["issues", "stats"] as const,
  activity: (id: string) => ["issues", "activity", id] as const,
};

export const useIssueStats = () =>
  useQuery({
    queryKey: issueKeys.stats(),
    queryFn: () => issuesApi.getStats(),
    staleTime: 1000 * 60 * 2,
  });

export const useIssues = (filters: IssueFilters = {}) =>
  useQuery({
    queryKey: issueKeys.list(filters),
    queryFn: () => issuesApi.getAll(filters),
    placeholderData: (prev) => prev,
  });

export const useIssue = (id: string) =>
  useQuery({
    queryKey: issueKeys.detail(id),
    queryFn: () => issuesApi.getById(id),
    enabled: !!id,
  });

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIssueData) => issuesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: issueKeys.stats() });
      toast.success("Issue created successfully!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create issue";
      toast.error(message);
    },
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIssueData }) =>
      issuesApi.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: issueKeys.detail(id) });
      const previousIssue = queryClient.getQueryData(issueKeys.detail(id));

      queryClient.setQueryData(issueKeys.detail(id), (old: unknown) => ({
        ...(old as object),
        data: {
          // @ts-expect-error - old is unknown
          ...old?.data,
          issue: {
            // @ts-expect-error - old is unknown
            ...old?.data?.issue,
            ...data,
          },
        },
      }));

      return { previousIssue, id };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousIssue) {
        queryClient.setQueryData(issueKeys.detail(id), context.previousIssue);
      }
      toast.error("Failed to update issue");
    },

    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: issueKeys.stats() });
    },
  });
};

export const useUpdateIssueStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      issuesApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: issueKeys.stats() });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });
};

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => issuesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: issueKeys.stats() });
      toast.success("Issue deleted successfully");
    },
    onError: () => toast.error("Failed to delete issue"),
  });
};

export const useIssueActivity = (id: string) =>
  useQuery({
    queryKey: issueKeys.activity(id),
    queryFn: () => issuesApi.getActivity(id),
    enabled: !!id,
  });
