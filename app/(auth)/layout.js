"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowLeft, FiHome } from "react-icons/fi";

export default function AuthLayout({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-linear-to-br from-[#1C1712] via-[#2A2219] to-[#1C1712]">
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
        </div>

        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 bg-linear-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="text-white font-bold text-lg">📜</span>
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent hidden sm:inline-block">
                  ইসলামের ইতিহাস
                </span>
                <span className="text-xl font-bold bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent sm:hidden">
                  IE
                </span>
              </Link>

              <div className="flex items-center space-x-3">
                <Link
                  href="/"
                  className="flex items-center space-x-2 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border border-white/20 hover:scale-105"
                >
                  <FiHome size={16} />
                  <span className="hidden sm:inline">Home</span>
                </Link>

                {isLoginPage ? (
                  <Link
                    href="/signup"
                    className="bg-linear-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
                  >
                    Sign Up
                  </Link>
                ) : (
                  isSignupPage && (
                    <Link
                      href="/login"
                      className="bg-linear-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
                    >
                      Login
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex">
          <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 md:py-16">
            {/* Back Button (Mobile) */}
            <button
              onClick={() => window.history.back()}
              className="md:hidden flex items-center space-x-2 text-gray-400 hover:text-amber-400 transition-colors mb-6 group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            {/* Card Container */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8">
              {children}
            </div>

            {/* Footer Links */}
            <div className="text-center mt-8 space-y-2">
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-amber-400 transition-colors block"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-gray-500 border-t border-white/10">
          <div className="container mx-auto px-4">
            <p>© 2024 ইসলামের ইতিহাস. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
