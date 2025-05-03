import React from 'react';

export function PublicNavbar() {
  return (
    <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800">
        Empower<span className="text-indigo-600">+</span>Elite
      </div>
      <nav className="space-x-4">
        <a href="/empower" className="text-gray-600 hover:text-indigo-600">Empower</a>
        <a href="/elite" className="text-gray-600 hover:text-indigo-600">Elite</a>
        <a href="/login" className="text-indigo-600 font-semibold">Login</a>
      </nav>
    </header>
  );
}
