"use client";
import Link from "next/link";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-5">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-150 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="relative inline-block mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-none select-none">
            404
          </h1>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <FileQuestion size={48} className="text-white/40" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200 text-sm"
          >
            <Home size={16} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 text-sm"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link
            href="/notices"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 text-sm"
          >
            <Search size={16} />
            Browse Notices
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-white/30 text-xs mb-4">Quick Links</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { href: "/", label: "Home" },
              { href: "/notices", label: "Notices" },
              { href: "/courses", label: "Courses" },
              { href: "/gallery", label: "Gallery" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 text-xs transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
