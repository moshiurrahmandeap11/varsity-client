"use client";

import { useEffect } from "react";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = ({ error, reset }) => {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-5">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-150 bg-linear-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex p-5 rounded-3xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={48} className="text-red-400" />
          </div>
        </div>

        <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
          Something Went Wrong
        </h2>

        <p className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
          We encountered an unexpected error. Please try again or go back to the
          homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200 text-sm"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 text-sm"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
