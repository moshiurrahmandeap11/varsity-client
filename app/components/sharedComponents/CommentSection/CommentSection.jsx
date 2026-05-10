"use client";

import { useState } from "react";
import {
  useComments,
  useCreateComment,
  useCommentCount,
} from "@/app/hooks/useSocial";
import { useQueryClient } from "@tanstack/react-query";
import {
  MessageCircle,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  CornerDownRight,
} from "lucide-react";

const CommentSection = ({ contentId, contentType = "notice", currentUser }) => {
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const queryClient = useQueryClient();

  const { data: commentsData, isLoading: commentsLoading } = useComments(
    contentId,
    contentType,
    { sort: sortBy },
  );

  const { data: countData } = useCommentCount(contentId, contentType);
  const createCommentMutation = useCreateComment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || createCommentMutation.isPending) return;

    try {
      await createCommentMutation.mutateAsync({
        contentId,
        contentType,
        userId: currentUser.id,
        userName: currentUser.name,
        text: newComment.trim(),
        parentId: null,
      });

      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const comments = commentsData?.data || [];
  const totalComments = countData?.data?.total || 0;

  return (
    <div className="mt-6">
      {/* Comment Toggle Header */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition mb-3"
      >
        <MessageCircle size={16} />
        <span>
          {totalComments === 0
            ? "No comments yet"
            : `${totalComments} ${totalComments === 1 ? "Comment" : "Comments"}`}
        </span>
        {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Comment Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm
                  placeholder:text-white/40 focus:outline-none focus:border-white/30 transition"
                maxLength={1000}
              />
              {newComment.trim() && (
                <button
                  type="submit"
                  disabled={createCommentMutation.isPending}
                  className="px-3 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400
                    hover:bg-blue-500/30 transition disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Sort Options */}
          {comments.length > 0 && (
            <div className="flex items-center gap-3 text-xs border-b border-white/10 pb-3">
              <span className="text-white/40">Sort by:</span>
              {[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "popular", label: "Popular" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`transition ${
                    sortBy === option.value
                      ? "text-blue-400 font-medium"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {commentsLoading ? (
              <div className="text-center py-4">
                <div className="inline-block w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-4">
                Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUser={currentUser}
                  contentType={contentType}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Comment Item with Reply Support
const CommentItem = ({ comment, currentUser, contentType, depth = 0 }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(false);
  const queryClient = useQueryClient();

  const createCommentMutation = useCreateComment();

  const handleReply = async () => {
    if (!replyText.trim() || createCommentMutation.isPending) return;

    try {
      await createCommentMutation.mutateAsync({
        contentId: comment.contentId,
        contentType: comment.contentType || contentType,
        userId: currentUser.id,
        userName: currentUser.name,
        text: replyText.trim(),
        parentId: comment._id,
      });

      setReplyText("");
      setShowReply(false);
      setShowReplies(true); // Show replies after adding
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  const handleToggleLike = () => {
    setLiked(!liked);
    // API call for like toggle
    queryClient.invalidateQueries({ queryKey: ["comments"] });
  };

  const timeAgo = (date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    return new Date(date).toLocaleDateString();
  };

  if (depth > 3) return null; // Max nesting depth

  return (
    <div
      className={`${depth > 0 ? "ml-8 border-l-2 border-white/10 pl-3" : ""}`}
    >
      <div className="group">
        <div className="flex items-start gap-2">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0">
            {comment.userName?.[0]?.toUpperCase() || "A"}
          </div>

          <div className="flex-1 min-w-0">
            {/* Comment Bubble */}
            <div className="bg-white/5 rounded-2xl px-3 py-2">
              {/* Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white/90">
                  {comment.userName}
                </span>
                {comment.isEdited && (
                  <span className="text-[10px] text-white/30">Edited</span>
                )}
              </div>

              {/* Text */}
              <p className="text-sm text-white/80 mt-0.5 wrap-break-word">
                {comment.text}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-1 px-1">
              <span className="text-[10px] text-white/40">
                {timeAgo(comment.createdAt)}
              </span>

              <button
                onClick={handleToggleLike}
                className={`text-[10px] transition ${
                  liked
                    ? "text-blue-400 font-medium"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                Like
              </button>

              {depth < 3 && (
                <button
                  onClick={() => setShowReply(!showReply)}
                  className="text-[10px] text-white/50 hover:text-white/70 transition"
                >
                  Reply
                </button>
              )}
            </div>

            {/* Reply Input */}
            {showReply && (
              <div className="flex items-center gap-2 mt-2 ml-1">
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[8px] font-bold shrink-0">
                  {currentUser.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs
                      placeholder:text-white/40 focus:outline-none focus:border-white/30 transition"
                    maxLength={500}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                      if (e.key === "Escape") {
                        setShowReply(false);
                        setReplyText("");
                      }
                    }}
                  />
                  <button
                    onClick={handleReply}
                    disabled={
                      !replyText.trim() || createCommentMutation.isPending
                    }
                    className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs
                      hover:bg-blue-500/30 transition disabled:opacity-50"
                  >
                    <Send size={10} />
                  </button>
                  <button
                    onClick={() => {
                      setShowReply(false);
                      setReplyText("");
                    }}
                    className="px-2 py-1 rounded-full text-white/40 hover:text-white/60 text-xs"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Replies Section */}
      {comment.replyCount > 0 && (
        <div className="ml-8 mt-1">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition"
          >
            <CornerDownRight size={10} />
            <span>
              {showReplies
                ? "Hide replies"
                : `View ${comment.replyCount} ${comment.replyCount === 1 ? "reply" : "replies"}`}
            </span>
          </button>

          {showReplies && (
            <div className="mt-2 space-y-2">
              <ReplyList
                commentId={comment._id}
                currentUser={currentUser}
                contentType={contentType}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Reply List Component
const ReplyList = ({ commentId, currentUser, contentType }) => {
  const { data: repliesData, isLoading } = useComments(commentId, "comment", {
    sort: "oldest",
  });

  const replies = repliesData?.data || [];

  if (isLoading) {
    return (
      <div className="text-center py-2">
        <div className="inline-block w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return replies.map((reply) => (
    <CommentItem
      key={reply._id}
      comment={{ ...reply, replyCount: 0 }}
      currentUser={currentUser}
      contentType={contentType}
      depth={reply.depth || 1}
    />
  ));
};

export default CommentSection;
