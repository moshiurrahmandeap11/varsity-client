"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiClock,
  FiFile,
  FiFileText,
  FiImage,
  FiInfo,
  FiSave,
  FiUpload,
  FiUser,
  FiVideo,
  FiX,
} from "react-icons/fi";

import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";
import FilePreview from "../../sharedComponents/FilePreview/FilePreview";

const categories = [
  { value: "general", label: "📢 General" },
  { value: "academic", label: "📚 Academic" },
  { value: "exam", label: "✍️ Exam" },
  { value: "event", label: "🎉 Event" },
  { value: "holiday", label: "🎊 Holiday" },
  { value: "result", label: "📊 Result" },
  { value: "workshop", label: "💻 Workshop" },
];

const priorities = [
  {
    value: "normal",
    label: "🟢 Normal",
    color: "from-emerald-500 to-teal-500",
  },
  {
    value: "high",
    label: "🟠 High",
    color: "from-orange-500 to-amber-500",
  },
  {
    value: "urgent",
    label: "🔴 Urgent",
    color: "from-red-500 to-rose-500",
  },
];

const AddNoticePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "normal",
    isActive: true,
    publishDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    author: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("File size must be below 10MB");
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (!file) return;

    const isValid = validateFile(file);

    if (!isValid) return;

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];

    handleFile(file);
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Notice title is required");
      return;
    }

    if (
      formData.expiryDate &&
      formData.publishDate &&
      new Date(formData.expiryDate) < new Date(formData.publishDate)
    ) {
      toast.error("Expiry date cannot be before publish date");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      if (selectedFile) {
        submitData.append("file", selectedFile);
      }

      const res = await axiosInstance.post("/notices/single", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.success) {
        toast.success("Notice created successfully ✨");
        router.push("/admin/notices");
      } else {
        toast.error(res?.data?.message || "Failed to create notice");
      }
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // PRIORITY UI
  // ---------------------------
  const activePriority = useMemo(() => {
    return priorities.find((item) => item.value === formData.priority);
  }, [formData.priority]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b14] text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-30 -top-30 h-80 w-[320px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-35 -right-25 h-85 w-85 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-60 w-60 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl p-4 md:p-8">
        {/* HEADER */}
        <div className="mb-8 rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link
                href="/admin/notices"
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <FiArrowLeft />
                Back to Notices
              </Link>

              <h1 className="bg-linear-to-r from-white to-white/60 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                Create New Notice
              </h1>

              <p className="mt-2 text-sm text-white/50">
                Liquid glass admin experience for managing department
                announcements.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${activePriority?.color}`}
              >
                <FiAlertCircle className="text-lg" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Priority
                </p>

                <p className="font-semibold">{activePriority?.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* LEFT */}
            <div className="space-y-6 xl:col-span-2">
              {/* BASIC */}
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                    <FiFileText className="text-xl" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">Notice Details</h2>

                    <p className="text-sm text-white/50">
                      Main information about your notice
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* TITLE */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Notice Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter notice title..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/50 focus:bg-white/10"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={7}
                      placeholder="Write notice description..."
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/50 focus:bg-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* FILE */}
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
                    <FiUpload className="text-xl" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">Attachment</h2>

                    <p className="text-sm text-white/50">
                      Upload image, PDF, document, video, or archive
                    </p>
                  </div>
                </div>

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative overflow-hidden rounded-[28px] border border-dashed p-10 text-center transition-all duration-300 ${
                      dragOver
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-white/3"
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileSelect}
                    />

                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                      <FiUpload className="text-3xl text-white/70" />
                    </div>

                    <h3 className="mb-2 text-xl font-bold">Drop files here</h3>

                    <p className="mb-5 text-sm text-white/50">
                      Or click below to upload
                    </p>

                    <label
                      htmlFor="file-upload"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-3 font-medium text-white transition hover:scale-[1.03]"
                    >
                      <FiUpload />
                      Browse File
                    </label>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/40">
                      <div className="flex items-center gap-1">
                        <FiImage />
                        Images
                      </div>

                      <div className="flex items-center gap-1">
                        <FiFileText />
                        PDF / Docs
                      </div>

                      <div className="flex items-center gap-1">
                        <FiVideo />
                        Videos
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                          <FiFile className="text-2xl" />
                        </div>

                        <div>
                          <p className="max-w-55 truncate font-semibold">
                            {selectedFile.name}
                          </p>

                          <p className="text-sm text-white/40">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeFile}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-300 transition hover:bg-red-500/20"
                      >
                        <FiX />
                      </button>
                    </div>

                    <FilePreview
                      fileUrl={previewUrl}
                      title={selectedFile.name}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* SETTINGS */}
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
                <h2 className="mb-5 text-xl font-bold">Settings</h2>

                <div className="space-y-5">
                  {/* CATEGORY */}
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-[#101826] px-4 py-4 text-white outline-none focus:border-cyan-400/50"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PRIORITY */}
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-[#101826] px-4 py-4 text-white outline-none focus:border-cyan-400/50"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AUTHOR */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-white/70">
                      <FiUser />
                      Author
                    </label>

                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Author name..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/50 focus:bg-white/10"
                    />
                  </div>

                  {/* DATES */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-white/70">
                      <FiCalendar />
                      Publish Date
                    </label>

                    <input
                      type="date"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-white/70">
                      <FiClock />
                      Expiry Date
                    </label>

                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-cyan-400/50"
                    />
                  </div>

                  {/* ACTIVE */}
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Active Notice</h3>

                        <p className="mt-1 text-xs text-white/40">
                          Visible on public website
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: !prev.isActive,
                          }))
                        }
                        className={`relative h-8 w-16 rounded-full transition ${
                          formData.isActive ? "bg-cyan-500" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                            formData.isActive ? "left-9" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIPS */}
              <div className="rounded-[30px] border border-cyan-400/10 bg-cyan-500/5 p-6 backdrop-blur-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                    <FiInfo className="text-xl" />
                  </div>

                  <div>
                    <h3 className="font-bold">Smart Tips</h3>

                    <p className="text-xs text-white/40">
                      Better notice management
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-white/70">
                  {[
                    "Use short but meaningful titles",
                    "Upload PDFs for official notices",
                    "Urgent notices appear first",
                    "Expiry dates auto-hide notices",
                  ].map((tip) => (
                    <div key={tip} className="flex items-start gap-3">
                      <div className="mt-1 text-cyan-300">
                        <FiCheck size={14} />
                      </div>

                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-3xl bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-5 text-lg font-bold text-white shadow-2xl shadow-cyan-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Notice...
                  </>
                ) : (
                  <>
                    <FiSave className="transition group-hover:rotate-12" />
                    Create Notice
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoticePage;
