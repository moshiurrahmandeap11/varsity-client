"use client";
import useAuth from "@/app/hooks/useAuth";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";

const Header = memo(() => {
  const { user, logOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close dropdowns on route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, [logOut, router]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Admission", href: "/admission" },
    { name: "Contact", href: "/contact" },
  ];

  // Show minimal loading state only during auth initialization
  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-800">ইসলামের ইতিহাস (IE)</div>
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gray-100/80 rounded-xl flex items-center justify-center group-hover:bg-gray-200/80 transition-all duration-200 border border-gray-200/50">
                <span className="text-gray-700 text-lg font-semibold">IE</span>
              </div>
              <span className="text-lg md:text-xl font-semibold text-gray-800">
                ইসলামের ইতিহাস
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 relative ${
                      isActive
                        ? "text-gray-900 bg-gray-100/80"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gray-900 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {user ? (
                // Profile Dropdown
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-full pl-1.5 pr-2.5 py-1.5 transition-all duration-200 border border-gray-200/50"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                  >
                    {user?.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || user.email || "Profile"}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                    <span className="text-gray-700 text-sm font-medium hidden sm:inline-block max-w-24 truncate">
                      {user?.displayName?.split(" ")[0] || user?.email?.split("@")[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                        aria-hidden="true"
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl z-50 border border-gray-200/60 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                          <p className="font-medium text-gray-800 text-sm">
                            {user?.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>
                        <div className="p-1.5">
                          <Link
                            href="/profile"
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100/80 rounded-xl transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Sign In Button - only show when not loading and no user
                <Link
                  href="/login"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleOverlayClick}
        >
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-gray-200/50 max-h-[75vh] flex flex-col">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gray-100/80 rounded-xl flex items-center justify-center border border-gray-200/50">
                  <span className="text-gray-700 text-base font-semibold">IE</span>
                </div>
                <span className="text-base font-semibold text-gray-800">
                  ইসলামের ইতিহাস
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100/80 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Auth */}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-2 bg-gray-900 text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-200"
                >
                  Sign In
                </Link>
              )}
              
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 bg-red-50 text-red-600 text-center py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
});

Header.displayName = "Header";
export default Header;