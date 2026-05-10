import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReactionsSummary,
  getUserReaction,
  toggleReaction,
  getComments,
  getReplies,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getCommentCount,
} from "@/app/data/apidata";

// ==================== REACTIONS HOOKS ====================
export const useReactionsSummary = (contentId, contentType = "notice") => {
  return useQuery({
    queryKey: ["reactions", contentId, contentType],
    queryFn: () => getReactionsSummary(contentId, contentType),
    enabled: !!contentId,
    staleTime: 30 * 1000, // 30 seconds cache
  });
};

export const useUserReaction = (contentId, userId, contentType = "notice") => {
  return useQuery({
    queryKey: ["userReaction", contentId, userId, contentType],
    queryFn: () => getUserReaction(contentId, userId, contentType),
    enabled: !!contentId && !!userId,
    staleTime: 30 * 1000,
  });
};

export const useToggleReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleReaction,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["reactions", variables.contentId],
      });
      await queryClient.cancelQueries({
        queryKey: ["userReaction", variables.contentId, variables.userId],
      });

      // Snapshot previous values
      const previousReactions = queryClient.getQueryData([
        "reactions",
        variables.contentId,
      ]);
      const previousUserReaction = queryClient.getQueryData([
        "userReaction",
        variables.contentId,
        variables.userId,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["userReaction", variables.contentId, variables.userId, variables.contentType],
        (old) => {
          const currentType = old?.data;
          return {
            ...old,
            data: currentType === variables.type ? null : variables.type,
          };
        }
      );

      return { previousReactions, previousUserReaction };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["reactions", variables.contentId],
        context.previousReactions
      );
      queryClient.setQueryData(
        ["userReaction", variables.contentId, variables.userId],
        context.previousUserReaction
      );
    },
    onSettled: (data, error, variables) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({
        queryKey: ["reactions", variables.contentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userReaction", variables.contentId, variables.userId],
      });
    },
  });
};

// ==================== COMMENTS HOOKS ====================
export const useComments = (contentId, contentType = "notice", params = {}) => {
  return useQuery({
    queryKey: ["comments", contentId, contentType, params],
    queryFn: () => getComments(contentId, contentType, params),
    enabled: !!contentId,
    staleTime: 10 * 1000,
  });
};

export const useReplies = (commentId, params = {}) => {
  return useQuery({
    queryKey: ["replies", commentId, params],
    queryFn: () => getReplies(commentId, params),
    enabled: !!commentId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.contentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentCount", variables.contentId],
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", variables.parentId],
        });
      }
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }) => updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }) => deleteComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });
};

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }) => toggleCommentLike(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });
};

export const useCommentCount = (contentId, contentType = "notice") => {
  return useQuery({
    queryKey: ["commentCount", contentId, contentType],
    queryFn: () => getCommentCount(contentId, contentType),
    enabled: !!contentId,
    staleTime: 20 * 1000,
  });
};