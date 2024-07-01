// pages/admin/page.tsx

import React from "react";
// Assumindo que você tem componentes de shadcn para Sidebar

const AdminPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <span className="text-xl font-semibold">Admin</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {/* <SidebarItem
            href="/admin/dashboard"
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Dashboard
          </SidebarItem>
          <SidebarItem
            href="/admin/users"
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Users
          </SidebarItem>
          <SidebarItem
            href="/admin/settings"
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Settings
          </SidebarItem> */}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-gray-600">
          Welcome to the admin panel. Use the sidebar to navigate.
        </p>
      </main>
    </div>
  );
};

export default AdminPage;
