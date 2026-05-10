import {
  GalleryThumbnails,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { FcAbout } from "react-icons/fc";
import { GrAnnounce } from "react-icons/gr";
import { PiFlagBanner } from "react-icons/pi";

export const sidebarItems = [
  { id: 1, name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    id: 2,
    name: "Banners",
    icon: PiFlagBanner,
    children: [
      { id: 21, name: "All Banners", href: "/admin/banners" },
      { id: 22, name: "Add Banner", href: "/admin/banners/add" },
    ],
  },
  {
    id: 3,
    name: "Notices",
    icon: GrAnnounce,
    children: [
      { id: 31, name: "All Notices", href: "/admin/notices" },
      { id: 32, name: "Add Notice", href: "/admin/notices/add" },
    ],
  },
  {
    id: 4,
    name: "About",
    icon: FcAbout,
    children: [
      { id: 41, name: "See About", href: "/admin/about" },
      { id: 42, name: "Add About", href: "/admin/about/add" },
    ],
  },
  {
    id: 5,
    name: "Gallery",
    icon: GalleryThumbnails,
    children: [
      { id: 51, name: "Gallery", href: "/admin/gallery" },
      { id: 52, name: "Add Gallery", href: "/admin/gallery/add" },
    ],
  },
  {
    id: 6,
    name: "User Management",
    icon: Users,
    children: [
      { id: 61, name: "All Users", href: "/admin/users" },
      { id: 62, name: "Add User", href: "/admin/users/add" },
      { id: 63, name: "Roles & Permissions", href: "/admin/users/roles" },
    ],
  },
  { id: 7, name: "Settings", href: "/admin/settings", icon: Settings },
];

// helper: faltten items for easier path matching
export const getAllPaths = (items) => {
  const paths = [];
  const traverse = (list) => {
    list.forEach((item) => {
      if (item.href) paths.push(item.href);
      if (item.children) traverse(item.children);
    });
  };
  traverse(items);
  return paths;
};
