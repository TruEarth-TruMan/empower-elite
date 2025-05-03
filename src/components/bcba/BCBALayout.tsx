import React from 'react';

export const BCBALayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-green-50 text-gray-900 p-6">
      <header className="mb-4 text-xl font-bold">BCBA Dashboard</header>
      <main>{children}</main>
    </div>
  );
};
