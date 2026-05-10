"use client";

import { useState } from "react";
import { Share2, Link, Facebook, MessageCircle, Check } from "lucide-react";
import { FaFacebook } from "react-icons/fa";

const ShareButton = ({ title, url, description = "" }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "Check this out";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowOptions(false), 1500);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareTitle}\n${description ? description + "\n" : ""}${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShowOptions(false);
  };

  const handleMessengerShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_APP_ID&redirect_uri=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
    setShowOptions(false);
  };

  const handleFacebookShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(shareTitle)}`,
      "_blank",
      "width=600,height=400"
    );
    setShowOptions(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
          bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
      >
        <Share2 size={14} />
        <span>Share</span>
      </button>

      {showOptions && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowOptions(false)}
          />

          <div className="absolute bottom-full right-0 mb-2 z-20 p-2 rounded-2xl bg-zinc-800/95 border border-white/20 shadow-2xl backdrop-blur-xl min-w-42.5 animate-in slide-in-from-bottom-3 fade-in duration-200">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 transition text-xs"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Link size={14} />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <div className="h-px bg-white/10 my-1" />

            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 transition text-xs"
            >
              <span className="text-base">💬</span>
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleMessengerShare}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 transition text-xs"
            >
              <MessageCircle size={14} className="text-blue-400" />
              <span>Messenger</span>
            </button>

            <button
              onClick={handleFacebookShare}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 transition text-xs"
            >
              <FaFacebook size={14} className="text-blue-500" />
              <span>Facebook</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;