"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGallery } from "@/app/data/apidata";
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

const AdminAddGalleryPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    type: "photo",
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: (data) => createGallery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      router.push("/admin/gallery");
    },
    onError: (error) => {
      setError(error.message || "Failed to create gallery item");
    },
  });

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate based on type
    if (formData.type === "photo" && !file.type.startsWith("image/")) {
      setError("Please upload an image file for photo");
      return;
    }

    if (formData.type === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return;
    }

    // Validate file size
    const maxSize =
      formData.type === "photo" ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `File size must be less than ${formData.type === "photo" ? "5MB" : "100MB"}`,
      );
      return;
    }

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeMedia = () => {
    setMediaFile(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!mediaFile) {
      setError(`Please upload a ${formData.type}`);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("type", formData.type);
    data.append("file", mediaFile);

    createMutation.mutate(data);
  };

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
                Add to Gallery
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Upload a photo or video
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

            {/* Type Selection */}
            <div>
              <label className="block text-sm text-white/60 mb-3">
                Media Type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: "photo" });
                    removeMedia();
                  }}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                    formData.type === "photo"
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  }`}
                >
                  <Camera size={20} />
                  <span className="font-medium">Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: "video" });
                    removeMedia();
                  }}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                    formData.type === "video"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  }`}
                >
                  <Film size={20} />
                  <span className="font-medium">Video</span>
                </button>
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
                {formData.type === "photo" ? "Photo" : "Video"}{" "}
                <span className="text-red-400">*</span>
              </label>

              {mediaPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  {formData.type === "photo" ? (
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
                  <div className="p-3 rounded-xl bg-white/5">
                    {formData.type === "photo" ? (
                      <Camera size={24} className="text-white/40" />
                    ) : (
                      <Film size={24} className="text-white/40" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm font-medium">
                      Click to upload {formData.type}
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      {formData.type === "photo"
                        ? "JPG, PNG or WebP (max 5MB)"
                        : "MP4, WebM (max 100MB)"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept={formData.type === "photo" ? "image/*" : "video/*"}
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
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {createMutation.isPending ? "Creating..." : "Add to Gallery"}
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

export default AdminAddGalleryPage;
