"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSingleGallery, updateGallery } from "@/app/data/apidata";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Loader2,
  AlertCircle,
  Camera,
  Film,
} from "lucide-react";
import Image from "next/image";

const AdminEditGalleryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [currentType, setCurrentType] = useState("");
  const [error, setError] = useState("");

  // Fetch existing item
  const { data: itemData, isLoading } = useQuery({
    queryKey: ["gallery", id],
    queryFn: () => getSingleGallery(id),
    enabled: !!id,
  });

  const item = itemData?.data;

  // Populate form
  useEffect(() => {
    const tryFetch = async () => {
      if (item) {
        setFormData({ title: item.title || "" });
        setCurrentType(item.type || "");
        if (item.file?.url) {
          setMediaPreview(item.file.url);
        }
      }
    };
    tryFetch();
  }, [item]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateGallery(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      router.push("/admin/gallery");
    },
    onError: (error) => {
      setError(error.message || "Failed to update gallery item");
    },
  });

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate based on type
    if (currentType === "photo" && !file.type.startsWith("image/")) {
      setError("Please upload an image file for photo");
      return;
    }

    if (currentType === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return;
    }

    const maxSize =
      currentType === "photo" ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `File size must be less than ${currentType === "photo" ? "5MB" : "100MB"}`,
      );
      return;
    }

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeMedia = () => {
    setMediaFile(null);
    if (mediaPreview && mediaFile) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    if (mediaFile) {
      data.append("file", mediaFile);
    }

    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white/60" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="text-center">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">Item not found</p>
          <button
            onClick={() => router.push("/admin/gallery")}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-5 md:p-10">
      <div className="md:max-w-9/12 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                Edit Gallery Item
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {currentType === "photo" ? "Photo" : "Video"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-6 md:p-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Type Badge (Read-only) */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Media Type
              </label>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
                  currentType === "photo"
                    ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                    : "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                }`}
              >
                {currentType === "photo" ? (
                  <Camera size={16} />
                ) : (
                  <Film size={16} />
                )}
                <span className="font-medium text-sm capitalize">
                  {currentType}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter title..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30
                  focus:outline-none focus:border-white/30 focus:bg-white/10 transition text-sm"
                maxLength={200}
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                {currentType === "photo" ? "Photo" : "Video"} (Leave empty to
                keep current)
              </label>

              {mediaPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  {currentType === "photo" ? (
                    <Image
                      src={mediaPreview}
                      alt="Preview"
                      width={600}
                      height={400}
                      className="w-full max-h-80 object-cover"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      className="w-full max-h-80"
                    />
                  )}
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all">
                  <Upload size={24} className="text-white/40" />
                  <div className="text-center">
                    <p className="text-white/60 text-sm font-medium">
                      Click to upload new {currentType}
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      {currentType === "photo"
                        ? "JPG, PNG or WebP (max 5MB)"
                        : "MP4, WebM (max 100MB)"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept={currentType === "photo" ? "image/*" : "video/*"}
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditGalleryPage;
