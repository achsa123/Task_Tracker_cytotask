'use client';

import Link from 'next/link';
import { useAuthUser, useLogout, useProfile } from '@/hooks';

export function Navbar() {
  const { data: user } = useAuthUser();
  const { data: profile } = useProfile(user?.id);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-100">
                CytoTask
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {profile?.is_admin && (
              <Link
                href="/dashboard/admin"
                className="hidden rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-500/20 hover:text-brand-300 sm:block"
              >
                Admin View
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden flex-col items-end sm:flex">
                  <span className="text-sm font-medium text-gray-200">
                    {profile?.full_name || user.email}
                  </span>
                  {profile?.is_admin && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                      System Admin
                    </span>
                  )}
                </div>
                
                {/* Avatar / Dropdown */}
                <div className="group relative">
                  <button className="flex h-9 w-9 overflow-hidden items-center justify-center rounded-full border border-gray-700 bg-surface-raised text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-950">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      (profile?.full_name?.charAt(0) || user.email?.charAt(0) || '?').toUpperCase()
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-800 bg-surface-raised py-1 shadow-lg shadow-black/50 opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
                    <Link
                      href="/dashboard/profile"
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    >
                      Profile Settings
                    </Link>
                    <div className="my-1 border-t border-gray-800"></div>
                    <button
                      onClick={() => logout()}
                      disabled={isLoggingOut}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
                    >
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-800" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
