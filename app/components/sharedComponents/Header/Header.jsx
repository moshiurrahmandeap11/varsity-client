"use client";

import useAuth from "@/app/hooks/useAuth";
import {
  ChevronDown,
  Home,
  Info,
  BookOpen,
  GraduationCap,
  Phone,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // close dropdowns on route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // body scroll lock
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, [logOut, router]);

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "About",
      href: "/about",
      icon: Info,
    },
    {
      name: "Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      name: "Admission",
      href: "/admission",
      icon: GraduationCap,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: Phone,
    },
  ];

  const isActivePath = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  if (!mounted) return null;

  // loading state
  if (loading) {
    return (
      <header className="sticky top-0 z-999 border-b border-white/20 bg-white/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">ইসলামের ইতিহাস</h1>

          <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Desktop / Tablet Header */}
      <header className="sticky top-0 z-999 border-b border-white/10 bg-white/10 backdrop-blur-3xl shadow-[0_8px_32px_rgba(255,255,255,0.08)]">
        <div className="max-w-11/12 md:max-w-9/12 mx-auto  md:px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl group-hover:bg-white/30 transition-all duration-300" />

                <div className="relative w-11 h-11 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white font-bold text-lg">
                  IE
                </div>
              </div>

              <div>
                <h1 className="text-white font-bold text-lg md:text-xl leading-none">
                  ইসলামের ইতিহাস
                </h1>

                <p className="text-white/60 text-xs mt-1">Department Portal</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const active = isActivePath(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 overflow-hidden group ${
                      active
                        ? "text-white bg-white/20 border border-white/20 shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/5" />
                    )}

                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 px-2 py-1.5 backdrop-blur-xl transition-all duration-300"
                  >
                    {user?.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="profile"
                        width={36}
                        height={36}
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <span className="hidden md:block text-sm text-white font-medium max-w-24 truncate">
                      {user?.displayName?.split(" ")[0] ||
                        user?.email?.split("@")[0]}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 text-white/70 transition-transform duration-300 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <div
                    className={`absolute right-0 mt-3 w-64 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                      isProfileOpen
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-4 invisible"
                    }`}
                  >
                    <div className="p-5 border-b border-white/10">
                      <p className="text-white font-semibold">
                        {user?.displayName || "User"}
                      </p>

                      <p className="text-white/60 text-sm truncate mt-1">
                        {user?.email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-red-300 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center justify-center px-5 py-2.5 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-xl flex items-center justify-center transition-all duration-300"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-999 w-[95%] max-w-md">
        <div className="rounded-4xl border border-white/10 bg-white/10 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const active = isActivePath(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 rounded-2xl bg-white/15 border border-white/10" />
                  )}

                  <Icon className="relative z-10 w-5 h-5" />

                  <span className="relative z-10 text-[11px] font-medium">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed inset-0 z-1000 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-500 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer */}
        <div
          className={`absolute bottom-0 left-0 right-0 rounded-t-[2.5rem] border-t border-white/10 bg-black/40 backdrop-blur-3xl transition-all duration-500 ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3">
            <div className="w-14 h-1.5 rounded-full bg-white/30" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-white">Navigation</h2>

              <p className="text-white/50 text-sm mt-1">Quick access menu</p>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="px-4 pb-8 space-y-2">
            {navItems.map((item) => {
              const active = isActivePath(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 rounded-3xl px-5 py-4 transition-all duration-300 ${
                    active
                      ? "bg-white/15 border border-white/10 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />

                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* Mobile Auth */}
            {!user ? (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center mt-4 rounded-3xl bg-white text-black py-4 font-semibold"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 mt-4 rounded-3xl bg-red-500/15 border border-red-500/10 text-red-300 py-4 font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

Header.displayName = "Header";

export default Header;
