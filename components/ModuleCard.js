'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/libs/api';
import { toast } from 'react-hot-toast';

/**
 * Module Card Component
 * Displays a module card with bookmark toggle functionality
 */
export default function ModuleCard({ module, isBookmarked: initialBookmarked, onBookmarkChange }) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();

  const handleBookmarkToggle = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking bookmark button
    e.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);
    const newBookmarkedState = !isBookmarked;

    try {
      const response = await apiClient.post('/user/bookmark-module', {
        moduleId: module.id,
        bookmarked: newBookmarkedState,
      });

      if (response.success) {
        setIsBookmarked(newBookmarkedState);
        if (onBookmarkChange) {
          onBookmarkChange(module.id, newBookmarkedState);
        }
        toast.success(newBookmarkedState ? 'Bookmarked' : 'Removed from bookmarks');
        // Refresh the page to update the module sections
        router.refresh();
      } else {
        toast.error('Failed to update bookmark');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(error.message || 'Failed to update bookmark');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow relative">
      {/* Bookmark Button */}
      <button
        onClick={handleBookmarkToggle}
        disabled={isToggling}
        className="absolute top-4 right-4 btn btn-sm btn-ghost btn-circle"
        title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isToggling ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isBookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            className={`w-5 h-5 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            <path d="M5 3v18l7-5 7 5V3z" />
          </svg>
        )}
      </button>

      {/* Card Content */}
      <Link href={module.path} className="block">
        <div className="flex items-start gap-4 pr-8">
          {module.icon && (
            <div className="text-3xl">{module.icon}</div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{module.name}</h3>
            {module.description && (
              <p className="text-sm opacity-70">{module.description}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
