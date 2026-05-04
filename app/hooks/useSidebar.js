// app/admin/hooks/useSidebar.js
"use client";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getAllPaths } from "../data/sidebarItems";


export const useSidebar = (items) => {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Check if current path matches item
  const isActive = useCallback((item) => {
    if (item.href) return pathname === item.href;
    if (item.children) {
      const childPaths = item.children.map((c) => c.href);
      return childPaths.includes(pathname);
    }
    return false;
  }, [pathname]);

  // Check if any child path matches (for keeping parent open)
  const isChildActive = useCallback((children) => {
    return children?.some((child) => {
      if (child.href === pathname) return true;
      if (child.children) return isChildActive(child.children);
      return false;
    });
  }, [pathname]);

  // Toggle submenu with smooth handling
  const toggleSubmenu = useCallback((id) => {
    setOpenSubmenu((prev) => (prev === id ? null : id));
  }, []);

  // Auto-open submenu if child is active on page load/refresh
  useMemo(() => {
    items.forEach((item) => {
      if (item.children && isChildActive(item.children)) {
        setOpenSubmenu(item.id);
      }
    });
  }, [pathname, items, isChildActive]);

  // Get all valid paths for role-based filtering (optional)
  const validPaths = useMemo(() => getAllPaths(items), [items]);

  return {
    isActive,
    isChildActive,
    openSubmenu,
    toggleSubmenu,
    pathname,
    validPaths,
  };
};