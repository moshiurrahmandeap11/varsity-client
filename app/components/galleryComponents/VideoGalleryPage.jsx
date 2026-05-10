"use client";

import { useQuery } from "@tanstack/react-query";
import { getGallery } from "@/app/data/apidata";
import Link from "next/link";
import {
  ArrowLeft,
  Film,
  Play,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Helper function
function getFileSize(sizeInBytes) {
  if (!sizeInBytes) return "Unknown";
  const mb = sizeInBytes / (1024 * 1024);
  if (mb < 1) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${mb.toFixed(1)} MB`;
}

const VideoGalleryPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gallery", "video"],
    queryFn: () =>
      getGallery("video").then((res) => ({
        ...res,
        data: res.data || [],
      })),
  });

  const videos = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-white/60" />
          <span className="text-white/40 text-sm">Loading videos...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="text-center max-w-md">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error.message}</p>
          <Link
            href="/gallery"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition inline-block"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative md:max-w-9/12 mx-auto px-5 py-10 md:py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/gallery"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              Video Gallery
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {videos.length} videos in our collection
            </p>
          </div>
        </div>

        {/* Videos Grid */}
        {videos.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Film size={32} className="text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white/60 mb-2">
              No Videos Yet
            </h2>
            <p className="text-white/40 text-sm">
              Videos will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-linear-to-br from-purple-500/20 to-pink-500/20">
                  <video
                    src={video.file.url}
                    className="w-full h-full object-cover opacity-50"
                    muted
                    preload="metadata"
                  />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link
                      href={`/gallery/video/${video._id}`}
                      className="p-4 rounded-2xl bg-purple-500/80 hover:bg-purple-600 backdrop-blur-sm transition-all group-hover:scale-110"
                    >
                      <Play size={24} className="text-white fill-white" />
                    </Link>
                  </div>

                  {/* Type Badge */}
                  <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Video
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white/80 line-clamp-2 group-hover:text-white transition-colors">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(video.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {video.file?.size && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {getFileSize(video.file.size)}
                      </span>
                    )}
                  </div>

                  {/* Watch Button */}
                  <Link
                    href={`/gallery/video/${video._id}`}
                    className="flex items-center justify-center gap-2 mt-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 text-sm transition-all"
                  >
                    <Play size={14} className="fill-current" />
                    <span>Watch Video</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <Link
            href="/gallery/photo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <span>View Photo Gallery</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoGalleryPage;
