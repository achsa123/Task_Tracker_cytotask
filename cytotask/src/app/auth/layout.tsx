import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card space-y-6">{children}</div>
      </div>
    </div>
  );
}
