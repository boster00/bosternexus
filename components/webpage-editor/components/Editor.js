'use client';

import { useEffect, useRef } from 'react';

/**
 * Helper function to find parent section element
 */
const findParentSection = (element) => {
  if (!element) return null;
  
  let current = element;
  
  // Traverse up the DOM tree to find a <section> element
  while (current && current !== current.ownerDocument?.body) {
    if (current.tagName && current.tagName.toLowerCase() === 'section') {
      return current;
    }
    current = current.parentElement;
    if (!current) break;
  }
  
  return null;
};

/**
 * Editor component that handles interactive editing functionality
 * Sets up mouseover listeners on the iframe body to detect section focus
 * Also tracks the last clicked in-section element for element editing
 */
export default function Editor({ iframeRef, onSectionFocus, onElementFocus }) {
  const previousSectionRef = useRef(null);
  const cleanupRef = useRef(null);
  const listenerSetupRef = useRef(false);

  useEffect(() => {
    if (!iframeRef?.current) return;

    const iframe = iframeRef.current;
    
    const handleMouseOver = (event) => {
      try {
        const target = event.target;
        if (!target) return;

        // Ignore the control panel and its children, and do-not-include wrapper
        const controlPanel = target.closest('#section-control-panel');
        const doNotInclude = target.closest('#do-not-include');
        if (controlPanel || doNotInclude) {
          // Don't change focus when hovering over the control panel or modals
          return;
        }

        // Find the parent section element
        const sectionElement = findParentSection(target);
        
        // Only change focus if we found a parent section
        if (sectionElement && sectionElement !== previousSectionRef.current) {
          previousSectionRef.current = sectionElement;
          console.log('Editor: Section focused', sectionElement);
          // Call the callback to update focus section in parent
          if (onSectionFocus && typeof onSectionFocus === 'function') {
            onSectionFocus(sectionElement);
          } else {
            console.warn('Editor: onSectionFocus is not a function', typeof onSectionFocus, onSectionFocus);
          }
        }
        // If no parent section found, do nothing (don't clear focus)
      } catch (error) {
        console.error('Error in mouseover handler:', error);
      }
    };

    // Track last clicked in-section element
    const handleClick = (event) => {
      try {
        const target = event.target;
        if (!target) return;

        // Ignore clicks on control panel, modals, and do-not-include wrapper
        const controlPanel = target.closest('#section-control-panel');
        const doNotInclude = target.closest('#do-not-include');
        if (controlPanel || doNotInclude) {
          return;
        }

        // Find the parent section element
        const sectionElement = findParentSection(target);
        
        // Only track if the element is within a section
        if (sectionElement) {
          console.log('Editor: Element clicked in section', target);
          // Call the callback to update focused element in parent
          if (onElementFocus && typeof onElementFocus === 'function') {
            onElementFocus(target);
          }
        }
      } catch (error) {
        console.error('Error in click handler:', error);
      }
    };

    // Wait for iframe to be ready and HTML content to be loaded
    const setupListener = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc || !iframeDoc.body) {
          // Retry after a short delay
          setTimeout(setupListener, 100);
          return null;
        }

        // Check if HTML content has been loaded (body should have content)
        const hasContent = iframeDoc.body.children.length > 0 || iframeDoc.body.innerHTML.trim().length > 0;
        
        if (!hasContent) {
          // Wait for content to be loaded
          setTimeout(setupListener, 100);
          return null;
        }

        // Remove existing listener if it was set up before
        if (listenerSetupRef.current) {
          try {
            iframeDoc.body.removeEventListener('mouseover', handleMouseOver, true);
          } catch (e) {
            // Ignore if listener wasn't attached
          }
        }

        // Add mouseover and click listeners to iframe body
        iframeDoc.body.addEventListener('mouseover', handleMouseOver, true);
        iframeDoc.body.addEventListener('click', handleClick, true);
        listenerSetupRef.current = true;
        
        console.log('Editor: Mouseover and click listeners attached to iframe body');
        
        // Return cleanup function
        return () => {
          try {
            console.log('Editor: Removing mouseover and click listeners from iframe body');
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc && iframeDoc.body) {
              iframeDoc.body.removeEventListener('mouseover', handleMouseOver, true);
              iframeDoc.body.removeEventListener('click', handleClick, true);
              listenerSetupRef.current = false;
            }
          } catch (error) {
            console.error('Error removing listeners:', error);
          }
        };
      } catch (error) {
        console.error('Error setting up mouseover listener:', error);
        // Retry after a delay
        setTimeout(setupListener, 200);
        return null;
      }
    };

    // Start setup
    cleanupRef.current = setupListener();

    // Also set up a periodic check to re-initialize if needed
    const checkInterval = setInterval(() => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc && iframeDoc.body) {
          const hasContent = iframeDoc.body.children.length > 0 || iframeDoc.body.innerHTML.trim().length > 0;
          if (hasContent && !listenerSetupRef.current) {
            // Re-setup listener if content exists but listener isn't set up
            cleanupRef.current = setupListener();
          }
        }
      } catch (error) {
        // Ignore errors in periodic check
      }
    }, 500);

    // Cleanup on unmount
    return () => {
      clearInterval(checkInterval);
      if (cleanupRef.current && typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
      previousSectionRef.current = null;
      listenerSetupRef.current = false;
    };
  }, [iframeRef, onSectionFocus, onElementFocus]);

  // This component doesn't render anything visible
  return null;
}
