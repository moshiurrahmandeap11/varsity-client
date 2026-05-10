"use client";

import { useQuery } from "@tanstack/react-query";
import { getGallery } from "@/app/data/apidata";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  Eye,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";

const PhotoGalleryPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gallery", "photo"],
    queryFn: () =>
      getGallery("photo").then((res) => ({
        ...res,
        data: res.data || [],
      })),
  });

  const photos = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-white/60" />
          <span className="text-white/40 text-sm">Loading photos...</span>
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
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
              Photo Gallery
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {photos.length} photos in our collection
            </p>
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Camera size={32} className="text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white/60 mb-2">
              No Photos Yet
            </h2>
            <p className="text-white/40 text-sm">
              Photos will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Link
                href={`/gallery/photo/${photo._id}`}
                key={photo._id}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={photo.file.url}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-sm font-medium line-clamp-2">
                        {photo.title}
                      </h3>
                      <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(photo.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* View Button */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 rounded-xl bg-black/50 backdrop-blur-sm">
                      <Eye size={16} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Info (visible on mobile) */}
                <div className="p-3 lg:hidden">
                  <h3 className="text-sm text-white/80 truncate">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(photo.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <Link
            href="/gallery/video"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <span>View Video Gallery</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PhotoGalleryPage;