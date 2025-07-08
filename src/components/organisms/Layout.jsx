import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "@/components/organisms/Sidebar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
/>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.firstName || 'User'}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <main className="flex-1 overflow-y-auto">
            <Outlet context={{ setSidebarOpen }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;