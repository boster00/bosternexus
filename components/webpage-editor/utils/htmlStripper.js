/**
 * Strips editor control UI elements from HTML
 * Removes:
 * - Control panel elements (#section-control-panel)
 * - Editor-specific classes and attributes
 * - Any other editor markup
 */
export function stripEditorControls(htmlString) {
  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // Remove control panel element
  const controlPanel = tempDiv.querySelector('#section-control-panel');
  if (controlPanel) {
    controlPanel.remove();
  }

  // Remove editor-specific classes from all elements
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach((element) => {
    // Remove editor-specific classes
    if (element.classList) {
      // Remove classes that indicate editor state (keep design classes like mouse-over-highlight, click-copy-outer)
      // These might be intentional design classes, so we'll be conservative
      // Only remove if it's clearly an editor control class
      const classesToRemove = [];
      element.classList.forEach((cls) => {
        if (cls.includes('editor-') || cls.includes('control-')) {
          classesToRemove.push(cls);
        }
      });
      classesToRemove.forEach((cls) => element.classList.remove(cls));
    }

    // Remove editor-specific attributes
    const attrsToRemove = ['data-editor-id', 'data-section-id', 'data-focused'];
    attrsToRemove.forEach((attr) => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });
  });

  // Return the cleaned HTML
  return tempDiv.innerHTML;
}

/**
 * Gets clean HTML from iframe body, stripping all editor controls
 * Only returns body > section elements, nothing else
 */
export function getCleanHTMLFromIframe(iframeRef) {
  if (!iframeRef?.current) {
    return '';
  }

  try {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc || !iframeDoc.body) {
      return '';
    }

    // Get all direct section children of body
    const sections = Array.from(iframeDoc.body.children).filter(
      child => child.tagName && child.tagName.toLowerCase() === 'section'
    );

    // Clone each section and clean it
    const cleanedSections = sections.map(section => {
      const sectionClone = section.cloneNode(true);
      
      // Remove editor-specific inline styles that might have been added
      const allElements = sectionClone.querySelectorAll('*');
      allElements.forEach((element) => {
        // Remove editor-specific classes
        if (element.classList) {
          const classesToRemove = [];
          element.classList.forEach((cls) => {
            if (cls.includes('editor-') || cls.includes('control-')) {
              classesToRemove.push(cls);
            }
          });
          classesToRemove.forEach((cls) => element.classList.remove(cls));
        }

        // Remove editor-specific attributes
        const attrsToRemove = ['data-editor-id', 'data-section-id', 'data-focused'];
        attrsToRemove.forEach((attr) => {
          if (element.hasAttribute(attr)) {
            element.removeAttribute(attr);
          }
        });

        // Clean up inline styles that might be editor-related
        if (element.style && element.style.cssText) {
          // Remove z-index that might be from editor positioning
          if (element.style.zIndex && parseInt(element.style.zIndex) > 1000) {
            element.style.zIndex = '';
          }
        }
      });

      // Remove contenteditable attribute if present
      if (sectionClone.hasAttribute('contenteditable')) {
        sectionClone.removeAttribute('contenteditable');
      }

      return sectionClone.outerHTML;
    });

    return cleanedSections.join('\n');
  } catch (error) {
    console.error('Error getting clean HTML from iframe:', error);
    return '';
  }
}
