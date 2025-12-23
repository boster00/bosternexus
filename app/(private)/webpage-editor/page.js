'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/libs/supabase/client';
import WebpageEditorShell from '@/components/webpage-editor/WebpageEditorShell';
import { sections } from '@/components/webpage-editor/components/sections';

// Client component - user is already authenticated by (private) layout
// Handles both new pages and pages with URL key (urlKey will be null for new pages)
export default function WebpageEditorPage() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initial page content with proper hero section from sections
  // urlKey is null for new pages - LeftPanel will handle loading if urlKey exists
  // Check sessionStorage for HTML content from NewPageModal
  // Must be called before any conditional returns to follow Rules of Hooks
  const [initialContent] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedHtml = sessionStorage.getItem('newPageHtmlContent');
      if (storedHtml) {
        // Clear it from sessionStorage so it's only used once
        sessionStorage.removeItem('newPageHtmlContent');
        return storedHtml;
      }
    }
    return sections.hero.html;
  });

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        if (mounted) {
          if (user) {
            setUserId(user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to use the webpage editor.</p>
        </div>
      </div>
    );
  }

  return (
    <WebpageEditorShell
      userId={userId}
      initialContent={initialContent}
      urlKey={null}
    />
  );
}
