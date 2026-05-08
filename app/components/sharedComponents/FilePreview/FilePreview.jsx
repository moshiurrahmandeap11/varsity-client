"use client";

import Image from "next/image";
import { useState } from "react";
import {
    FiDownload,
    FiFile,
    FiFileText,
    FiMaximize2,
    FiMinimize2,
    FiMusic
} from "react-icons/fi";

const FilePreview = ({ fileUrl, title, className = "" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!fileUrl) return null;

  const extension = fileUrl.split(".").pop()?.toLowerCase();

  // IMAGE Preview
  if (["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(extension)) {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-gray-100 ${className}`}>
        <Image
          src={fileUrl}
          width={500}
          height={300}
          alt={title}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <FiMaximize2 className="w-3.5 h-3.5" />
        </button>
        
        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setIsFullscreen(false)}>
            <div className="relative max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={fileUrl}
                alt={title}
                width={1200}
                height={800}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
              >
                <FiMinimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PDF Preview
  if (extension === "pdf") {
    return (
      <div className={`w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 ${className}`}>
        <embed
          src={fileUrl}
          type="application/pdf"
          className="w-full h-full"
        />
      </div>
    );
  }

  // VIDEO Preview
  if (["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(extension)) {
    return (
      <div className={`rounded-2xl overflow-hidden ${className}`}>
        <video
          controls
          className="w-full rounded-2xl"
          poster="/video-poster.jpg"
        >
          <source src={fileUrl} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // AUDIO Preview
  if (["mp3", "wav", "ogg", "m4a", "flac"].includes(extension)) {
    return (
      <div className={`p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
            <FiMusic className="text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{title || "Audio File"}</h3>
            <p className="text-xs text-gray-500">{extension.toUpperCase()} Audio</p>
          </div>
          <a
            href={fileUrl}
            download
            className="p-2 bg-white/80 rounded-lg text-gray-600 hover:bg-white transition-all"
          >
            <FiDownload className="w-4 h-4" />
          </a>
        </div>
        <audio controls className="w-full">
          <source src={fileUrl} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  // Excel / Word / PowerPoint / Text Files
  if (["xlsx", "xls", "doc", "docx", "ppt", "pptx", "csv", "txt", "md"].includes(extension)) {
    let fileIcon = FiFileText;
    let fileType = "Document";
    
    if (["xlsx", "xls", "csv"].includes(extension)) {
      fileType = "Excel Spreadsheet";
    } else if (["doc", "docx"].includes(extension)) {
      fileType = "Word Document";
    } else if (["ppt", "pptx"].includes(extension)) {
      fileType = "PowerPoint Presentation";
    } else if (["txt", "md"].includes(extension)) {
      fileType = "Text File";
    }

    return (
      <div className={`p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 ${className}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
              <FiFileText className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 line-clamp-1">{title || "Document"}</h3>
              <p className="text-xs text-gray-500">{fileType} • {extension.toUpperCase()}</p>
            </div>
          </div>
          <a
            href={fileUrl}
            download
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <FiDownload className="w-4 h-4" />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
      </div>
    );
  }

  // ZIP / RAR Archives
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return (
      <div className={`p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 ${className}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
              <FiFile className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 line-clamp-1">{title || "Archive File"}</h3>
              <p className="text-xs text-gray-500">Compressed Archive • {extension.toUpperCase()}</p>
            </div>
          </div>
          <a
            href={fileUrl}
            download
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <FiDownload className="w-4 h-4" />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
      </div>
    );
  }

  // FALLBACK for any other file type
  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl text-white">
            <FiFile className="text-2xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 line-clamp-1">{title || "File"}</h3>
            <p className="text-xs text-gray-500">File • {extension?.toUpperCase() || "Unknown"}</p>
          </div>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-all shadow-sm"
        >
          <FiDownload className="w-4 h-4" />
          <span className="text-sm font-medium">Open File</span>
        </a>
      </div>
    </div>
  );
};

export default FilePreview;