import React from 'react';
import { useSidebar } from '../ui/sidebar/SidebarProvider';
import { Link } from 'react-router-dom';

export const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <button onClick={toggleSidebar} className="mb-4 text-sm text-gray-300 hover:text-white">
        Collapse Sidebar
      </button>
      <nav className="flex flex-col space-y-2">
        <Link to="/profile" className="hover:text-indigo-400">Profile</Link>
        <Link to="/goals" className="hover:text-indigo-400">Goals</Link>
        <Link to="/daily-flow" className="hover:text-indigo-400">Daily Flow</Link>
        <Link to="/messages" className="hover:text-indigo-400">Messages</Link>
        <Link to="/settings" className="hover:text-indigo-400">Settings</Link>
        <Link to="/trends" className="hover:text-indigo-400">Trends</Link>
        <Link to="/help" className="hover:text-indigo-400">Help</Link>
      </nav>
    </aside>
  );
};
