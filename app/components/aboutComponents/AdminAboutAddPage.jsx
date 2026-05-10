"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAbout } from "@/app/data/apidata";
import { ArrowLeft, Save, Upload, X, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "../sharedComponents/RichTextEditor/RichTextEditor";

const AdminAboutAddPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: (formDataToSend) => createAbout(formDataToSend), // ✅ Fix: parameter pass
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      router.push("/admin/about");
    },
    onError: (error) => {
      setError(error.message || "Failed to create about section");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    // ✅ Fix: Create FormData correctly
    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("description", formData.description);
    if (imageFile) {
      data.append("image", imageFile);
    }

    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-5 md:p-10">
      <div className="max-w-4xl mx-auto">
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
                Create About Section
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Add information about your department
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-6 md:p-10 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

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
                placeholder="Enter about title..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30
                  focus:outline-none focus:border-white/30 focus:bg-white/10 transition text-sm"
                maxLength={200}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                About Image
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={300}
                    className="w-full max-h-80 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                  <div className="p-3 rounded-xl bg-white/5">
                    <Upload size={24} className="text-white/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm font-medium">
                      Click to upload image
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      JPG, PNG or WebP (max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Description - Rich Text Editor */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Description
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(html) =>
                  setFormData({ ...formData, description: html })
                }
                placeholder="Write about your department..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {createMutation.isPending ? "Creating..." : "Create About"}
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

export default AdminAboutAddPage;
