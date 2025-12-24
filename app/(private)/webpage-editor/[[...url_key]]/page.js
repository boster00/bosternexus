import { createClient } from '@/libs/supabase/server';
import { getWebpageByUrlKey } from '@/libs/db/webpages';
import WebpageEditorShell from '@/components/webpage-editor/WebpageEditorShell';
import { sections } from '@/components/webpage-editor/components/sections';
import { Logger } from '@/libs/utils/logger';

// Server component - handles both /webpage-editor (no url_key) and /webpage-editor/:url_key
// Loads webpage content at page level before rendering
// Uses optional catch-all route [[...url_key]] so url_key is an array
export default async function WebpageEditorPage({ params }) {
  // In Next.js 15, params is a Promise and must be awaited
  const resolvedParams = await params;
  
  // Extract url_key from params
  // For /webpage-editor route, params.url_key will be undefined or empty array
  // For /webpage-editor/:url_key route, params.url_key will be an array with one element
  const urlKeyArray = resolvedParams?.url_key || [];
  const urlKey = Array.isArray(urlKeyArray) && urlKeyArray.length > 0 ? urlKeyArray[0] : null;
  
  Logger.info('[webpage-editor/page] Page component called', {
    urlKey,
    hasUrlKey: !!urlKey,
    urlKeyArray,
    resolvedParamsFull: resolvedParams,
    timestamp: new Date().toISOString(),
  });

  // Get authenticated user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to use the webpage editor.</p>
        </div>
      </div>
    );
  }

  let initialWebpage = null;
  let initialContent = sections.hero.html;

  // If url_key exists, load the webpage content at page level
  if (urlKey) {
    Logger.info('[webpage-editor/page] Loading webpage by url_key', {
      urlKey,
      userId: user.id,
    });

    try {
      const { data, error } = await getWebpageByUrlKey(user.id, urlKey);

      Logger.info('[webpage-editor/page] getWebpageByUrlKey result', {
        hasData: !!data,
        hasError: !!error,
        webpageId: data?.id || null,
        hasHtmlContent: !!data?.html_content,
      });

      if (error) {
        Logger.error('[webpage-editor/page] Error loading webpage', error, {
          urlKey,
          userId: user.id,
        });
        // Continue with default content if error
      } else if (data) {
        initialWebpage = data;
        if (data.html_content) {
          initialContent = data.html_content;
          Logger.info('[webpage-editor/page] Webpage loaded, using html_content', {
            webpageId: data.id,
            htmlContentLength: data.html_content.length,
          });
        }
      } else {
        Logger.info('[webpage-editor/page] Webpage not found, using default content', {
          urlKey,
          note: 'This is expected for new pages',
        });
        // Webpage not found - use default content (new page)
      }
    } catch (error) {
      Logger.error('[webpage-editor/page] Exception loading webpage', error, {
        urlKey,
        userId: user.id,
      });
      // Continue with default content if exception
    }
  } else {
    // No url_key - new page, use default content
    // sessionStorage check for HTML content from NewPageModal will be handled in client component
    Logger.info('[webpage-editor/page] No url_key, new page', {
      note: 'Will check sessionStorage in client component',
    });
  }

  return (
    <WebpageEditorShell
      userId={user.id}
      initialContent={initialContent}
      initialWebpage={initialWebpage}
      urlKey={urlKey}
    />
  );
}

