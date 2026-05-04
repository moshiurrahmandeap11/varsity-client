// app/admin/components/Sidebar.jsx
"use client";
import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import { sidebarItems } from "@/app/data/sidebarItems";
import { useSidebar } from "@/app/hooks/useSidebar";


const Sidebar = memo(({ isMobile = false, onClose }) => {
  const { isActive, openSubmenu, toggleSubmenu, pathname } =
    useSidebar(sidebarItems);

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children?.length > 0;
    const active = isActive(item);
    const paddingLeft = level * 16 + 16;

    return (
      <div key={item.id}>
        {item.href ? (
          <Link
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
              ${
                active
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            style={{ paddingLeft }}
          >
            {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
            <span className="flex-1 truncate">{item.name}</span>
            {hasChildren && (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openSubmenu === item.id ? "rotate-180" : ""
                }`}
              />
            )}
          </Link>
        ) : (
          <button
            onClick={() => toggleSubmenu(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left
              ${
                active
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            style={{ paddingLeft }}
          >
            {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
            <span className="flex-1 truncate">{item.name}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openSubmenu === item.id ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        {/* Submenu Items */}
        {hasChildren && openSubmenu === item.id && (
          <div className="overflow-hidden transition-all duration-300 ease-in-out">
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`${isMobile ? "w-64" : "w-64"} h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 flex flex-col`}
    >
      {/* Logo Area */}
      <div className="p-5 border-b border-gray-800">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">Admin Panel</h1>
            <p className="text-gray-500 text-xs">Dashboard v2.0</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {sidebarItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
