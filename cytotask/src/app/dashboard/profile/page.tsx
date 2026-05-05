'use client';

import { useState, useEffect } from 'react';
import { useAuthUser, useProfile, useUpdateProfile, useUploadAvatar, useDeleteAvatar } from '@/hooks';

export default function ProfilePage() {
  const { data: user } = useAuthUser();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  const [fullName, setFullName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setMessage({ text: '', type: '' });
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        email: user.email!,
        updates: { full_name: fullName },
      });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to update profile.', type: 'error' });
    }
  };

  const getPathFromUrl = (url: string) => {
    const parts = url.split('/avatars/');
    return parts.length > 1 ? decodeURIComponent(parts[1]) : null;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user?.id) return;

    const file = e.target.files[0];
    setIsUploading(true);
    setMessage({ text: '', type: '' });

    try {
      // 1. Delete old avatar if it exists
      if (profile?.avatar_url) {
        const oldPath = getPathFromUrl(profile.avatar_url);
        if (oldPath) {
          try {
            await deleteAvatar.mutateAsync(oldPath);
          } catch (err) {
            console.error('Failed to delete old avatar:', err);
          }
        }
      }

      // 2. Upload new one
      const publicUrl = await uploadAvatar.mutateAsync({ userId: user.id, file });
      await updateProfile.mutateAsync({
        userId: user.id,
        email: user.email!,
        updates: { avatar_url: publicUrl },
      });
      setMessage({ text: 'Avatar updated successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to upload avatar.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id || !profile?.avatar_url) return;
    
    setIsDeleting(true);
    setMessage({ text: '', type: '' });
    
    try {
      const path = getPathFromUrl(profile.avatar_url);
      if (path) {
        await deleteAvatar.mutateAsync(path);
      }
      
      await updateProfile.mutateAsync({
        userId: user.id,
        email: user.email!,
        updates: { avatar_url: null },
      });
      setMessage({ text: 'Avatar removed successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to remove avatar.', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage your account details and personalization.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-surface-raised shadow-xl shadow-black/20">
        <div className="p-8">
          
          {/* Avatar Section */}
          <div className="mb-8 flex items-center gap-6 border-b border-gray-800 pb-8">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-700 bg-gray-900 group">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover transition-opacity group-hover:opacity-50" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-gray-500 transition-opacity group-hover:opacity-50">
                  {(profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()}
                </div>
              )}
              
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-semibold text-white">
                  {isUploading ? 'Uploading...' : 'Change'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white">Profile Picture</h3>
              <p className="text-sm text-gray-400">JPG, GIF or PNG. Max size of 2MB.</p>
              {profile?.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isDeleting}
                  className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Removing...' : 'Remove Photo'}
                </button>
              )}
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleUpdateName} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="mt-2 block w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Your email address cannot be changed.</p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                Display Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-2 block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {message.text && (
              <div className={`rounded-xl p-4 text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                {message.text}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:hover:bg-brand-500 hover:scale-105 active:scale-95"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
