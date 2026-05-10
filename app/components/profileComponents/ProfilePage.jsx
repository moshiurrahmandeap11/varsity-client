"use client";
import { getCurrentUser } from "@/app/data/apidata";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import React from "react";

const ProfilePage = () => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const user = userData?.data;
  console.log("user data from profile :", user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-white/60" />
            </div>
          </div>
          <span className="text-white/40 text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white/80 mb-2">
            Failed to load profile
          </h2>
          <p className="text-red-400 text-sm mb-6">
            {error?.message || "Please login to view your profile"}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm transition"
            >
              Go to Login
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 text-sm transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
};

export default ProfilePage;
