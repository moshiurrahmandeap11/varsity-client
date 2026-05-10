"use client";

import { useState, useRef, useEffect } from "react";
import { useReactionsSummary, useUserReaction, useToggleReaction } from "@/app/hooks/useSocial";
import { useQueryClient } from "@tanstack/react-query";
import { ThumbsUp } from "lucide-react";

const REACTIONS = [
  { type: "like", emoji: "👍", label: "Like", color: "text-blue-400" },
  { type: "love", emoji: "❤️", label: "Love", color: "text-red-400" },
  { type: "haha", emoji: "😂", label: "Haha", color: "text-yellow-400" },
  { type: "wow", emoji: "😮", label: "Wow", color: "text-yellow-300" },
  { type: "sad", emoji: "😢", label: "Sad", color: "text-yellow-500" },
  { type: "angry", emoji: "😡", label: "Angry", color: "text-orange-400" },
];

const ReactionButton = ({
  contentId,
  contentType = "notice",
  currentUserId,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const pickerRef = useRef(null);
  const hoverTimeout = useRef(null);
  const queryClient = useQueryClient();

  // Fetch user's current reaction
  const { data: userReactionData, isLoading: userReactionLoading } = useUserReaction(
    contentId,
    currentUserId,
    contentType
  );

  // Fetch reactions summary
  const { data: reactionsSummary } = useReactionsSummary(contentId, contentType);

  // Toggle mutation
  const toggleReactionMutation = useToggleReaction();

  const currentReaction = userReactionData?.data || null;
  const reactions = reactionsSummary?.data?.reactions || {};
  const totalReactions = reactionsSummary?.data?.total || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReaction = async (type) => {
    try {
      // Optimistic update
      const previousData = queryClient.getQueryData([
        "userReaction",
        contentId,
        currentUserId,
        contentType,
      ]);

      // If clicking the same reaction, remove it
      const newReaction = currentReaction === type ? null : type;

      // Optimistically update user reaction
      queryClient.setQueryData(
        ["userReaction", contentId, currentUserId, contentType],
        { success: true, data: newReaction }
      );

      await toggleReactionMutation.mutateAsync({
        contentId,
        contentType,
        userId: currentUserId,
        type,
      });

      setShowPicker(false);
    } catch (error) {
      console.error("Reaction failed:", error);
      // Revert on error
      queryClient.invalidateQueries({
        queryKey: ["userReaction", contentId, currentUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactions", contentId],
      });
    }
  };

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowPicker(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
  };

  // Don't show until user reaction is loaded
  const isReady = !userReactionLoading;

  // Get top reactions for display
  const topReactions = Object.entries(reactions)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => REACTIONS.find((r) => r.type === type))
    .filter(Boolean);

  return (
    <div
      className="relative inline-flex items-center"
      ref={pickerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reaction Button */}
      <button
        onClick={() => {
          if (currentReaction) {
            handleReaction(currentReaction);
          } else {
            handleReaction("like");
          }
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
          ${
            currentReaction
              ? "bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
          }`}
        >
          {currentReaction ? (
            <span className="text-base">
              {REACTIONS.find((r) => r.type === currentReaction)?.emoji}
            </span>
          ) : (
            <ThumbsUp size={14} />
          )}
          <span>
            {currentReaction
              ? REACTIONS.find((r) => r.type === currentReaction)?.label
              : "Like"}
          </span>
        </button>

      {/* Reaction Count */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-0.5 ml-1 text-xs text-white/50">
          {topReactions.map((reaction, index) => (
            <span key={reaction.type} className="-mr-0.5">
              {reaction.emoji}
            </span>
          ))}
          <span className="ml-1">{totalReactions}</span>
        </div>
      )}

      {/* Reaction Picker (Facebook Style) */}
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 p-2 rounded-2xl bg-zinc-800/95 border border-white/20 shadow-2xl backdrop-blur-xl flex gap-1 animate-in slide-in-from-bottom-3 fade-in duration-200 z-50">
          {REACTIONS.map((reaction) => (
            <button
              key={reaction.type}
              onClick={() => handleReaction(reaction.type)}
              onMouseEnter={() => setHoveredReaction(reaction.type)}
              onMouseLeave={() => setHoveredReaction(null)}
              className={`relative p-2 rounded-xl transition-all duration-200 hover:scale-125 hover:-translate-y-2
                ${
                  hoveredReaction === reaction.type || currentReaction === reaction.type
                    ? "bg-white/10 scale-110 -translate-y-1"
                    : ""
                }`}
              title={reaction.label}
            >
              <span className="text-2xl">{reaction.emoji}</span>
              {/* Label on hover */}
              {hoveredReaction === reaction.type && (
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white bg-zinc-900 px-1.5 py-0.5 rounded whitespace-nowrap">
                  {reaction.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionButton;