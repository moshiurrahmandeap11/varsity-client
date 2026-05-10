"use client";

import { useQuery } from "@tanstack/react-query";
import { getAbout } from "@/app/data/apidata";
import { useRouter } from "next/navigation";
import {
  Edit,
  Plus,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Image from "next/image";

const AdminAboutPage = () => {
  const router = useRouter();

  const {
    data: aboutData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
  });

  const about = aboutData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-white/60" />
          <span className="text-white/40 text-sm">Loading about...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg mb-4">{error.message}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-5 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                About Section
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Manage your about page content
              </p>
            </div>
          </div>

          {!about && (
            <button
              onClick={() => router.push("/admin/about/add")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all duration-200"
            >
              <Plus size={16} />
              Create About
            </button>
          )}
        </div>

        {about ? (
          <div className="space-y-6">
            {/* About Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-6 md:p-10">
              {/* Title */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <BookOpen size={20} className="text-blue-400" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {about.title}
                  </h2>
                </div>

                <button
                  onClick={() => router.push("/admin/about/edit")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white/80 text-sm transition-all duration-200"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>

              {/* Image */}
              {about.image && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                    <ImageIcon size={16} />
                    <span>About Image</span>
                  </div>
                  <Image
                    src={about.image.url}
                    alt={about.title}
                    width={400}
                    height={300}
                    className="w-full max-h-96 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Description */}
              {about.description && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-white/60 text-sm mb-3">Description</h3>
                  <div
                    className="prose prose-invert max-w-none text-white/80 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: about.description }}
                  />
                </div>
              )}

              {/* Meta Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs text-white/40 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Calendar size={14} />
                  <span>
                    Created:{" "}
                    {new Date(about.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Clock size={14} />
                  <span>
                    Updated:{" "}
                    {new Date(about.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-10 md:p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white/60 mb-2">
              No About Section Yet
            </h2>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              Create an about section to introduce your department to visitors.
            </p>
            <button
              onClick={() => router.push("/admin/about/add")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200"
            >
              <Plus size={18} />
              Create About
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAboutPage;
