'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import apiClient from '@/libs/api';
import LoadPageModal from './modals/LoadPageModal';
import SavePageModal from './modals/SavePageModal';
import NewPageModal from './modals/NewPageModal';
import ReferencesModal from './components/modals/ReferencesModal';
import Editor from './components/Editor';
import { getCleanHTMLFromIframe } from './utils/htmlStripper';

// Default CSS links from new.html
const DEFAULT_CSS_LINKS = [
  'https://fonts.googleapis.com/css?family=Josefin+Sans:400,700|Muli:400,700&display=swap',
  'https://use.fontawesome.com/releases/v6.1.1/css/all.css',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
  'https://www.bosterbio.com/css/styles-m.css',
  'https://www.bosterbio.com/css/styles-l.css',
  'https://www.bosterbio.com/css/custom.css?v=12',
  'https://www.bosterbio.com/design-guide/css/design-guide.css',
];

// Default HTML content - Hero section from new.html (click-copy-outer removed)
const DEFAULT_HTML = `<section class="mb-6 mouse-over-highlight text-center hero-section" style="background-image: url(https://www.bosterbio.com/media/images/design-guide/assay-elisa-kit-reader.jpg)">
  <div class="dark-overlap">
    <h2 class="font-large font-weight-bold mb-4">To be used if this page is part of a series</h2>
    <h1 class="mb-2">Hero Section</h1>
    <p class="font-large mb-4">To be used as the first section for a page. There should be no more than 1 hero section per page. Elements in this section: Header, Paragraph, Lists, Button</p>
    <h3 class="font-weight-bold font-large">Remove the list if not needed</h3>
    <div class="row list">
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Primary Antibodies</a></li>
        <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
        <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
      </ul>
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Primary Antibodies</a></li>
        <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
        <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
      </ul>
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Custom Antibodies</a></li>
        <li class="mb-2"><a href="#">Antibody Validation Service</a></li>
        <li class="mb-2"><a href="#">Multiplex ELISA Testing Service</a></li>
      </ul>
    </div>
    <a class="btn-outline-white" href="#">Remove the button if not needed</a>
  </div>
</section><section class="mb-6 mouse-over-highlight text-center hero-section" style="background-image: url(https://www.bosterbio.com/media/images/design-guide/assay-elisa-kit-reader.jpg)">
  <div class="dark-overlap">
    <h2 class="font-large font-weight-bold mb-4">To be used if this page is part of a series</h2>
    <h1 class="mb-2">Hero Section</h1>
    <p class="font-large mb-4">To be used as the first section for a page. There should be no more than 1 hero section per page. Elements in this section: Header, Paragraph, Lists, Button</p>
    <h3 class="font-weight-bold font-large">Remove the list if not needed</h3>
    <div class="row list">
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Primary Antibodies</a></li>
        <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
        <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
      </ul>
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Primary Antibodies</a></li>
        <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
        <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
      </ul>
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Custom Antibodies</a></li>
        <li class="mb-2"><a href="#">Antibody Validation Service</a></li>
        <li class="mb-2"><a href="#">Multiplex ELISA Testing Service</a></li>
      </ul>
    </div>
    <a class="btn-outline-white" href="#">Remove the button if not needed</a>
  </div>
</section>`;

export default function LeftPanel({
  userId,
  urlKey = null,
  currentWebpage,
  isDirty,
  pageContent,
  onNewPage,
  onSave,
  onLoad,
  onWebpageChange,
  iframeRef,
  focusSection,
  onSectionFocus,
  focusedElement,
  onElementFocus,
}) {
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveModalError, setSaveModalError] = useState(null);
  const [cssLinks, setCssLinks] = useState(DEFAULT_CSS_LINKS.join('\n'));
  // Use pageContent prop if available, otherwise use DEFAULT_HTML
  const [htmlContent, setHtmlContent] = useState(pageContent || DEFAULT_HTML);
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [htmlLoaded, setHtmlLoaded] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const router = useRouter();

  // Sync htmlContent with pageContent prop when it changes
  useEffect(() => {
    if (pageContent && pageContent !== htmlContent) {
      setHtmlContent(pageContent);
    }
  }, [pageContent]);


  // Define load functions first so they can be called from useEffect
  const handleLoadStyles = () => {
    if (!iframeRef.current) {
      toast.error('Iframe not ready');
      return;
    }

    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Ensure iframe document is initialized
      if (!iframeDoc.head || !iframeDoc.body) {
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html><head></head><body></body></html>');
        iframeDoc.close();
        // Wait a moment for document to be ready
        setTimeout(() => {
          loadStylesIntoIframe();
        }, 50);
        return;
      }
      
      loadStylesIntoIframe();
    } catch (error) {
      console.error('Error loading styles:', error);
      toast.error(`Error: ${error.message}`);
    }

    function loadStylesIntoIframe() {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Parse CSS links from textarea (one per line)
      const links = cssLinks.split('\n').filter(link => link.trim());
      
      links.forEach((href) => {
        const trimmedHref = href.trim();
        if (!trimmedHref) return;
        
        // Check if link already exists
        const existingLink = iframeDoc.querySelector(`link[href="${trimmedHref}"]`);
        if (!existingLink) {
          const link = iframeDoc.createElement('link');
          link.rel = 'stylesheet';
          link.href = trimmedHref;
          iframeDoc.head.appendChild(link);
        }
      });

      setStylesLoaded(true);
      toast.success(`Loaded ${links.length} stylesheet(s)`);
    }
  };

  const handleLoadHTML = () => {
    if (!iframeRef.current) {
      toast.error('Iframe not ready');
      return;
    }

    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Set base HTML structure if not exists
      if (!iframeDoc.head || !iframeDoc.body) {
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html><head></head><body></body></html>');
        iframeDoc.close();
      }

      // Set HTML content to body (replace existing content)
      iframeDoc.body.innerHTML = htmlContent.trim();
      
      // Make body contenteditable for WYSIWYG editing
      iframeDoc.body.contentEditable = 'true';
      iframeDoc.body.style.outline = 'none';

      setHtmlLoaded(true);
      // HTML loaded silently (no toast)
    } catch (error) {
      console.error('Error loading HTML:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // Load webpage by urlKey if provided (similar to handleLoadSelect but without navigation)
  useEffect(() => {
    if (!urlKey || !userId || currentWebpage) {
      // Don't load if no urlKey, no userId, or already loaded
      return;
    }

    let mounted = true;

    async function loadWebpageByUrlKey() {
      try {
        const response = await apiClient.get(`/webpages/get-by-url-key?url_key=${urlKey}`);
        
        if (!mounted) return;
        
        if (response.success && response.webpage) {
          // Load the webpage - this is the same action as clicking a page in LoadPageModal
          onWebpageChange(response.webpage);
          // Update the HTML content in iframe
          if (response.webpage.html_content) {
            setHtmlContent(response.webpage.html_content);
            // Trigger HTML load after a short delay to ensure iframe is ready
            setTimeout(() => {
              if (mounted && iframeReady) {
                handleLoadHTML();
              }
            }, 300);
          }
        } else {
          // Page not found - this is expected for new pages
          // Don't show error, just allow editing as a new page
          console.log('Page not found, creating new page with URL key:', urlKey);
        }
      } catch (err) {
        // Handle 404 gracefully - page doesn't exist yet, which is fine
        if (err.response?.status === 404) {
          console.log('Page not found (404), creating new page with URL key:', urlKey);
          // Don't show error, allow it to proceed as a new page
        } else {
          console.error('Error loading webpage by urlKey:', err);
          // Only show error for non-404 errors
          toast.error(err.message || 'Failed to load page');
        }
      }
    }

    // Only load when iframe is ready
    if (iframeReady) {
      loadWebpageByUrlKey();
    }

    return () => {
      mounted = false;
    };
  }, [urlKey, userId, currentWebpage, iframeReady, onWebpageChange]);

  // Initialize iframe document structure on mount and auto-load styles/HTML
  useEffect(() => {
    if (!iframeRef?.current) return;

    let notified = false;
    let initialized = false;
    const timeouts = [];

    const markAsReady = () => {
      if (notified) return; // Prevent duplicate notification
      notified = true;
      initialized = true;
      setIframeReady(true);
      // Iframe ready silently (no toast)
      
      // Auto-trigger load styles and HTML after a short delay
      setTimeout(() => {
        handleLoadStyles();
        setTimeout(() => {
          handleLoadHTML();
        }, 200);
      }, 300);
    };

    const initializeIframe = () => {
      if (initialized) return; // Prevent duplicate initialization
      
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Check if already initialized
        if (iframeDoc.head && iframeDoc.body && iframeDoc.documentElement) {
          markAsReady();
          return;
        }

        // Initialize empty HTML structure
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html><head></head><body></body></html>');
        iframeDoc.close();
        
        // Wait a moment for document to be ready, then notify and auto-load
        const timeout = setTimeout(() => {
          markAsReady();
        }, 100);
        timeouts.push(timeout);
      } catch (error) {
        console.error('Error initializing iframe:', error);
      }
    };

    // Wait for iframe to load
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const tryInitialize = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc && iframeDoc.readyState === 'complete') {
          initializeIframe();
        } else {
          // Try again after a delay
          const timeout = setTimeout(initializeIframe, 100);
          timeouts.push(timeout);
        }
      } catch (error) {
        // Cross-origin or not ready yet, try again
        const timeout = setTimeout(initializeIframe, 200);
        timeouts.push(timeout);
      }
    };

    // Set up load handler (only once)
    if (!iframe.onload) {
      iframe.onload = () => {
        const timeout = setTimeout(initializeIframe, 50);
        timeouts.push(timeout);
      };
    }

    // Also try immediately and after delays
    tryInitialize();
    const timeout1 = setTimeout(initializeIframe, 100);
    const timeout2 = setTimeout(initializeIframe, 500);
    timeouts.push(timeout1, timeout2);

    return () => {
      timeouts.forEach(clearTimeout);
      if (iframe.onload) {
        iframe.onload = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // iframeRef is stable, no need to include in deps

  const handleNewPageClick = () => {
    if (isDirty) {
      const confirmed = confirm('You have unsaved changes. All unsaved changes will be lost. Create a new page anyway?');
      if (!confirmed) {
        return;
      }
    }
    // Show modal to optionally paste HTML content
    setShowNewPageModal(true);
  };

  const handleNewPageCreate = (htmlContent) => {
    // If HTML content is provided, update the iframe content
    if (htmlContent) {
      setHtmlContent(htmlContent);
      // Load HTML into iframe after a short delay
      setTimeout(() => {
        if (iframeReady) {
          handleLoadHTML();
        }
      }, 300);
    }
    // Navigate to /webpage-editor (new page)
    router.push('/webpage-editor');
    // Reset current webpage state
    onWebpageChange(null);
  };

  const handleSaveClick = async () => {
    if (currentWebpage) {
      // Update existing webpage
      const cleanHTML = getCleanHTMLFromIframe(iframeRef);
      
      if (!cleanHTML) {
        toast.error('No content to save');
        return;
      }

      setSaving(true);
      try {
        const response = await apiClient.post('/webpages/update', {
          webpageId: currentWebpage.id,
          htmlContent: cleanHTML,
        });

        if (response.success) {
          toast.success('Page saved successfully');
          onWebpageChange(response.webpage);
          // Navigate to /webpage-editor/url_key if URL key exists and we're not already there
          if (response.webpage.url_key) {
            const currentPath = window.location.pathname;
            const expectedPath = `/webpage-editor/${response.webpage.url_key}`;
            if (currentPath !== expectedPath) {
              router.push(expectedPath);
            }
          }
        } else {
          const errorMessage = response.error || 'Failed to save page';
          toast.error(errorMessage);
          // If error is about URL key, show it in the modal if we have one
          if (errorMessage.includes('URL key') || errorMessage.includes('already taken')) {
            setSaveModalError(errorMessage);
          }
        }
      } catch (error) {
        const errorMessage = error.message || 'An error occurred while saving';
        toast.error(errorMessage);
        if (errorMessage.includes('URL key') || errorMessage.includes('already taken')) {
          setSaveModalError(errorMessage);
        }
      } finally {
        setSaving(false);
      }
    } else {
      // New webpage - open modal (clear any previous errors)
      setSaveModalError(null);
      setShowSaveModal(true);
    }
  };

  const handleSaveNewPage = async (name, urlKey) => {
    // Get clean HTML from iframe (stripped of editor controls)
    const cleanHTML = getCleanHTMLFromIframe(iframeRef);
    
    if (!cleanHTML) {
      toast.error('No content to save');
      setShowSaveModal(false);
      return;
    }

    setSaving(true);
    setSaveModalError(null); // Clear previous errors
    try {
      const response = await apiClient.post('/webpages/create', {
        name,
        urlKey,
        htmlContent: cleanHTML,
      });

      if (response.success) {
        toast.success('Page saved successfully');
        onWebpageChange(response.webpage);
        setShowSaveModal(false);
        setSaveModalError(null);
        // Navigate to /webpage-editor/url_key
        if (urlKey) {
          router.push(`/webpage-editor/${urlKey}`);
        }
      } else {
        const errorMessage = response.error || 'Failed to save page';
        toast.error(errorMessage);
        // Show error in modal if it's about URL key
        if (errorMessage.includes('URL key') || errorMessage.includes('already taken')) {
          setSaveModalError(errorMessage);
          // Don't close modal so user can fix the URL key
        } else {
          setShowSaveModal(false);
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred while saving';
      toast.error(errorMessage);
      // Show error in modal if it's about URL key
      if (errorMessage.includes('URL key') || errorMessage.includes('already taken')) {
        setSaveModalError(errorMessage);
        // Don't close modal so user can fix the URL key
      } else {
        setShowSaveModal(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCopyHTML = async () => {
    // Get clean HTML from iframe (stripped of editor controls)
    const cleanHTML = getCleanHTMLFromIframe(iframeRef);
    
    if (!cleanHTML) {
      toast.error('No content to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(cleanHTML);
      toast.success('HTML copied to clipboard');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = cleanHTML;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('HTML copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy HTML');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleLoadClick = () => {
    setShowLoadModal(true);
  };

  const handleLoadSelect = (webpage) => {
    // Navigate to /webpage-editor/url_key
    if (webpage.url_key) {
      router.push(`/webpage-editor/${webpage.url_key}`);
    } else {
      toast.error('Page has no URL key');
    }
  };

  return (
    <div className="p-4 space-y-4 h-full">
      <div>
        <h2 className="text-xl font-bold mb-4">Webpage Editor</h2>
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm font-semibold">
            {currentWebpage ? currentWebpage.name : 'New Page'}
          </p>
          <p className="text-xs text-gray-500">
            {currentWebpage ? `/${currentWebpage.url_key}` : '(no URL key)'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleNewPageClick}
          className="btn btn-primary w-full"
        >
          New Page
        </button>

        <button
          onClick={handleSaveClick}
          disabled={saving}
          className="btn btn-success w-full"
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            currentWebpage ? 'Save Changes' : 'Save Page'
          )}
        </button>

        <button
          onClick={handleCopyHTML}
          className="btn btn-outline w-full"
        >
          Copy HTML
        </button>

        <button
          onClick={handleLoadClick}
          className="btn btn-outline w-full"
        >
          Load Page
        </button>

        <button
          onClick={() => setShowReferencesModal(true)}
          className="btn btn-outline w-full"
        >
          See References
        </button>
      </div>

      {isDirty && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          ⚠️ You have unsaved changes
        </div>
      )}

      {/* Editor Component - handles mouseover detection */}
      <Editor
        iframeRef={iframeRef}
        onSectionFocus={onSectionFocus}
        onElementFocus={onElementFocus}
      />

      <LoadPageModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onSelect={handleLoadSelect}
        userId={userId}
      />

      <SavePageModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setSaveModalError(null);
        }}
        onSave={handleSaveNewPage}
        serverError={saveModalError}
      />

      <NewPageModal
        isOpen={showNewPageModal}
        onClose={() => setShowNewPageModal(false)}
        onCreate={handleNewPageCreate}
      />

      <ReferencesModal
        isOpen={showReferencesModal}
        onClose={() => setShowReferencesModal(false)}
      />
    </div>
  );
}
