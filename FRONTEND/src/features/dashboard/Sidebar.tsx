"use client";

import { Users, Folder, Tag } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      <nav className="space-y-2">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-gray-900 font-medium">
          <Users className="w-4 h-4" /> Users
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <Folder className="w-4 h-4" /> Categories
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <Tag className="w-4 h-4" /> Tags
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
