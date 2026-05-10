"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSingleGallery } from "@/app/data/apidata";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Download,
  Camera,
  Loader2,
  AlertCircle,
} from "lucide-react";

const PhotoPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gallery", id],
    queryFn: () => getSingleGallery(id),
    enabled: !!id,
  });

  const photo = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white/60" />
      </div>
    );
  }

  if (isError || !photo) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="text-center">
          <Camera size={32} className="text-white/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white/60 mb-4">
            {error?.message || "Photo not found"}
          </h2>
          <Link
            href="/gallery/photo"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            Back to Photos
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
            href="/gallery/photo"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{photo.title}</h1>
          </div>
        </div>

        {/* Photo Display */}
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden mb-6">
          <div className="relative aspect-16/10 md:aspect-video">
            <Image
              src={photo.file.url}
              alt={photo.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Info & Actions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-3">Photo Details</h2>

          <div className="text-sm text-white/50 mb-4 flex flex-wrap gap-4">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(photo.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <a
            href={photo.file.url}
            download={photo.file.originalName || photo.title}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white/80 text-sm transition"
          >
            <Download size={14} />
            Download Photo
          </a>
        </div>
      </div>
    </div>
  );
};

export default PhotoPage;
