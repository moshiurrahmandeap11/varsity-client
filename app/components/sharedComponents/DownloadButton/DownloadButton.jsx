"use client";

import { useState } from "react";
import { Download, FileText, Image, File, Check, Loader2 } from "lucide-react";

const DownloadButton = ({ file }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!file) return null;

  const getFileInfo = () => {
    const type = file.fileType || "other";

    switch (type) {
      case "pdf":
        return {
          label: "Download PDF",
          icon: <FileText size={16} />,
          color:
            "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20",
        };
      case "image":
        return {
          label: "Download Image",
          icon: <Image size={16} alt={"download image"} />,
          color:
            "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20",
        };
      case "document":
        return {
          label: "Download Document",
          icon: <FileText size={16} />,
          color:
            "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20",
        };
      case "spreadsheet":
        return {
          label: "Download Spreadsheet",
          icon: <FileText size={16} />,
          color:
            "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20",
        };
      default:
        return {
          label: "Download File",
          icon: <File size={16} />,
          color:
            "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20",
        };
    }
  };

  const { label, icon, color } = getFileInfo();

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      // Method 1: Direct download using fetch (best for cross-origin)
      const response = await fetch(file.url);
      const blob = await response.blob();

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download =
        file.originalName || `notice-${Date.now()}.${file.format || "file"}`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Show success state
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    } catch (error) {
      console.error("Download failed:", error);

      // Method 2: Fallback - Open in new tab
      window.open(file.url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${color} ${
        isDownloading ? "opacity-70 cursor-wait" : ""
      }`}
      title={label}
    >
      {isDownloading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isDownloaded ? (
        <Check size={16} />
      ) : (
        icon
      )}

      <span>
        {isDownloading
          ? "Downloading..."
          : isDownloaded
            ? "Downloaded!"
            : label}
      </span>

      {!isDownloading && !isDownloaded && (
        <Download size={14} className="opacity-70" />
      )}
    </button>
  );
};

export default DownloadButton;
