import { LayoutDashboard, Settings, Users } from "lucide-react";
import { PiFlagBanner } from "react-icons/pi";

export const sidebarItems = [
  { id: 1, name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    id: 3,
    name: "Banners",
    icon: PiFlagBanner,
    children: [
      { id: 31, name: "All Banners", href: "/admin/banners" },
      { id: 32, name: "Add Banner", href: "/admin/banners/add" },
    ],
  },
  {
    id: 2,
    name: "User Management",
    icon: Users,
    children: [
      { id: 21, name: "All Users", href: "/admin/users" },
      { id: 22, name: "Add User", href: "/admin/users/add" },
      { id: 23, name: "Roles & Permissions", href: "/admin/users/roles" },
    ],
  },
  { id: 4, name: "Settings", href: "/admin/settings", icon: Settings },
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
