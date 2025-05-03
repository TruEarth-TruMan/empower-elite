import React from 'react';

export const RbtLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-blue-50 text-gray-900 p-6">
      <header className="mb-4 text-xl font-bold">RBT Dashboard</header>
      <main>{children}</main>
    </div>
  );
};
