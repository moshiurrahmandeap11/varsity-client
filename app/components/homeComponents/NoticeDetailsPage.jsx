"use client";

import { getNoticeById } from "@/app/data/apidata";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, FileText } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  useReactionsSummary,
  useUserReaction,
  useToggleReaction,
} from "@/app/hooks/useSocial";
import CommentSection from "../sharedComponents/CommentSection/CommentSection";
import ReactionButton from "../sharedComponents/ReactionButton/ReactionButton";
import ShareButton from "../sharedComponents/ShareButton/ShareButton";
import DownloadButton from "../sharedComponents/DownloadButton/DownloadButton";

const NoticeDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  // Current user (আপনার auth system অনুযায়ী পরিবর্তন করুন)
  const currentUser = {
    id: "user123",
    name: "Moshiur",
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notice", id],
    queryFn: () => getNoticeById(id),
    enabled: !!id,
  });

  // Reactions
  const { data: reactionsSummary } = useReactionsSummary(id);
  const { data: userReactionData } = useUserReaction(id, currentUser.id);
  const toggleReactionMutation = useToggleReaction();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <span className="text-white/60 text-sm">Loading notice...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error.message}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const notice = data?.data;
  const file = notice?.file;
  const reactions = reactionsSummary?.data?.reactions || {};
  const totalReactions = reactionsSummary?.data?.total || 0;

  const handleReaction = async (type) => {
    try {
      await toggleReactionMutation.mutateAsync({
        contentId: id,
        contentType: "notice",
        userId: currentUser.id,
        type,
      });
    } catch (error) {
      console.error("Reaction failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white p-5 md:p-10">
      {/* top bar */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl">
          {notice?.category}
        </span>
      </div>

      {/* glass card */}
      <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl p-6 md:p-10">
        {/* title */}
        <h1 className="text-2xl md:text-4xl font-bold">{notice?.title}</h1>

        {/* meta */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">
            Priority: {notice?.priority}
          </span>

          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">
            Author: {notice?.author}
          </span>

          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">
            Views: {notice?.views}
          </span>
        </div>

        {/* description */}
        {notice?.description && (
          <div className="mt-6 text-white/80 leading-relaxed">
            {notice.description}
          </div>
        )}

        {/* SOCIAL ACTIONS BAR */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
          {/* Reactions */}
          <ReactionButton
            contentId={id}
            contentType="notice"
            currentUserId={currentUser.id}
            onReactionChange={handleReaction}
          />

          {/* Reaction counts */}
          {totalReactions > 0 && (
            <div className="flex items-center gap-1 text-xs text-white/50">
              {Object.entries(reactions)
                .filter(([, count]) => count > 0)
                .slice(0, 3)
                .map(([type, count]) => (
                  <span
                    key={type}
                    className="px-1.5 py-0.5 rounded-full bg-white/5"
                  >
                    {count}
                  </span>
                ))}
            </div>
          )}

          {/* Share Button */}
          <ShareButton
            title={notice?.title}
            url={typeof window !== "undefined" ? window.location.href : ""}
            description={notice?.description}
          />
        </div>

        {/* FILE PREVIEW SECTION */}
        {file && (
          <div className="mt-8">
            {/* Header with Download Button */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm text-white/60 flex items-center gap-2">
                <Eye size={16} />
                Attachment
              </h2>

              {/* ✅ Download Button এখানে */}
              <DownloadButton file={file} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              {/* IMAGE */}
              {file.fileType === "image" && (
                <div className="flex flex-col gap-3">
                  <Image
                    width={100}
                    height={100}
                    src={file.url}
                    alt={file.originalName}
                    className="w-full max-h-125 object-contain rounded-xl"
                  />
                  <p className="text-white/50 text-xs text-center">
                    {file.originalName}
                  </p>
                </div>
              )}

              {/* PDF */}
              {file.fileType === "pdf" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white/70 text-sm">{file.originalName}</p>
                  </div>

                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 w-fit text-sm transition"
                  >
                    Open PDF
                  </a>

                  <iframe
                    src={file.url}
                    className="w-full h-125 rounded-xl border border-white/10"
                    title={file.originalName}
                  />
                </div>
              )}

              {/* Other file types */}
              {!["image", "pdf"].includes(file.fileType) && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <FileText size={48} className="text-white/30" />
                  <p className="text-white/70 text-sm">{file.originalName}</p>
                  <p className="text-white/40 text-xs">
                    {file.fileType?.toUpperCase()} File
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMENT SECTION */}
        <CommentSection
          contentId={id}
          contentType="notice"
          currentUser={currentUser}
        />

        {/* dates */}
        <div className="mt-8 grid md:grid-cols-2 gap-4 text-xs text-white/60">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            Publish:{" "}
            {notice?.publishDate
              ? new Date(notice.publishDate).toDateString()
              : "N/A"}
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            Created: {new Date(notice?.createdAt).toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailsPage;