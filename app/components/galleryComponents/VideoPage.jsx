"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSingleGallery } from "@/app/data/apidata";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Film,
  Loader2,
  AlertCircle,
} from "lucide-react";

function getFileSize(sizeInBytes) {
  if (!sizeInBytes) return "Unknown";
  const mb = sizeInBytes / (1024 * 1024);
  if (mb < 1) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${mb.toFixed(1)} MB`;
}

const VideoPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gallery", id],
    queryFn: () => getSingleGallery(id),
    enabled: !!id,
  });

  const video = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white/60" />
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="text-center">
          <Film size={32} className="text-white/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white/60 mb-4">
            {error?.message || "Video not found"}
          </h2>
          <Link
            href="/gallery/video"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            Back to Videos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-5 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/gallery/video"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
          </div>
        </div>

        {/* Video Player */}
        <div className="rounded-2xl border border-white/10 bg-black overflow-hidden mb-6">
          <video
            src={video.file.url}
            controls
            className="w-full max-h-[70vh]"
            poster={video.thumbnail || undefined}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Info & Actions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-3">Video Details</h2>

          <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-4">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {video.file?.size && (
              <span className="flex items-center gap-2">
                <Clock size={14} />
                {getFileSize(video.file.size)}
              </span>
            )}
          </div>

          <a
            href={video.file.url}
            download={video.file.originalName || video.title}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white/80 text-sm transition"
          >
            <Download size={14} />
            Download Video
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;