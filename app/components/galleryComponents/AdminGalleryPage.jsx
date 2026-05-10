"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGallery, deleteGallery } from "@/app/data/apidata";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Camera,
  Video,
  Loader2,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Film,
  Eye,
} from "lucide-react";

const AdminGalleryPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all"); // all, photo, video
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch gallery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gallery", filter, page],
    queryFn: () =>
      getGallery(filter === "all" ? "" : filter, {
        page,
        limit,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteGallery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  const handleDelete = async (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const galleryItems = data?.data || [];
  const pagination = data?.pagination || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-white/60" />
          <span className="text-white/40 text-sm">Loading gallery...</span>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                Gallery Management
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {pagination.total || 0} items total
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/admin/gallery/add")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { value: "all", label: "All", icon: null },
            { value: "photo", label: "Photos", icon: Camera },
            { value: "video", label: "Videos", icon: Film },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setFilter(tab.value);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                  filter === tab.value
                    ? "bg-white/10 border border-white/20 text-white"
                    : "bg-white/5 border border-white/10 text-white/50 hover:text-white/70"
                }`}
              >
                {Icon && <Icon size={14} />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {galleryItems.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Camera size={32} className="text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white/60 mb-2">
              No items found
            </h2>
            <p className="text-white/40 text-sm mb-6">
              Start by adding your first gallery item
            </p>
            <button
              onClick={() => router.push("/admin/gallery/add")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all"
            >
              <Plus size={18} />
              Add New Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item._id}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {/* Media Preview */}
                <div className="relative aspect-video bg-white/5">
                  {item.type === "photo" ? (
                    <Image
                      src={item.file.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <video
                        src={item.file.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-3 rounded-full bg-black/50">
                          <Video size={24} className="text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <span
                    className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full ${
                      item.type === "photo"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {item.type === "photo" ? "Photo" : "Video"}
                  </span>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/gallery/edit/${item._id}`)
                      }
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition"
                    >
                      <Edit size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      disabled={deleteMutation.isPending}
                      className="p-2 rounded-xl bg-red-500/50 hover:bg-red-500/70 transition"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white/80 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === pagination.pages || Math.abs(p - page) <= 1,
              )
              .map((p, index, arr) => (
                <span key={p} className="flex items-center gap-2">
                  {index > 0 && arr[index - 1] !== p - 1 && (
                    <span className="text-white/30">...</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm transition-all ${
                      page === p
                        ? "bg-white/10 border border-white/20 text-white"
                        : "bg-white/5 border border-white/10 text-white/50 hover:text-white/70"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryPage;
