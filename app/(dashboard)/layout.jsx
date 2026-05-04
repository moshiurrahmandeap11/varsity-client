// app/admin/layout.jsx
"use client";
import { useCallback, useState } from "react";
import AdminHeader from "../components/adminDashboardComponents/AdminHeader/AdminHeader";
import Sidebar from "../components/adminDashboardComponents/Sidebar/Sidebar";


export default function DashboardLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Mock user data (replace with your auth context)
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    photoURL: null,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={closeMobileSidebar}
        >
          <div 
            className="absolute left-0 top-0 h-full w-64 bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isMobile onClose={closeMobileSidebar} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <AdminHeader onMenuToggle={toggleMobileSidebar} user={user} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2026 Admin Panel. All rights reserved.
        </footer>
      </div>

      {/* Global Styles for Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}