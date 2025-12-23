/**
 * Editor command utilities for text formatting
 * Uses document.execCommand for contenteditable elements
 */

/**
 * Execute a formatting command on the iframe's contenteditable body
 */
export function execCommand(iframeRef, command, value = null) {
  try {
    const iframe = iframeRef.current;
    if (!iframe) return false;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return false;

    // Focus the iframe document
    iframeDoc.body.focus();

    // Execute the command
    const result = iframeDoc.execCommand(command, false, value);
    return result;
  } catch (error) {
    console.error('Error executing command:', error);
    return false;
  }
}

/**
 * Check if a command is currently active (e.g., bold is applied to selection)
 */
export function queryCommandState(iframeRef, command) {
  try {
    const iframe = iframeRef.current;
    if (!iframe) return false;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return false;

    return iframeDoc.queryCommandState(command);
  } catch (error) {
    console.error('Error querying command state:', error);
    return false;
  }
}

/**
 * Get the current selection in the iframe
 */
export function getSelection(iframeRef) {
  try {
    const iframe = iframeRef.current;
    if (!iframe) return null;

    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) return null;

    return iframeWindow.getSelection();
  } catch (error) {
    console.error('Error getting selection:', error);
    return null;
  }
}

/**
 * Get the focused element (where cursor is)
 */
export function getFocusedElement(iframeRef) {
  try {
    const iframe = iframeRef.current;
    if (!iframe) return null;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return null;

    return iframeDoc.activeElement;
  } catch (error) {
    console.error('Error getting focused element:', error);
    return null;
  }
}

/**
 * Insert HTML after the focused element (not inside it)
 * @param {Object} iframeRef - Reference to the iframe
 * @param {string} html - HTML to insert
 * @param {HTMLElement} targetElement - Optional target element (last clicked in-section element)
 */
export function insertHTMLAfterElement(iframeRef, html, targetElement = null) {
  try {
    const iframe = iframeRef.current;
    if (!iframe) return false;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return false;

    // Use provided target element, or try to get focused element
    let elementToUse = targetElement;
    
    if (!elementToUse) {
      elementToUse = getFocusedElement(iframeRef);
    }

    // If no valid element or element is body, append to the last section or body
    if (!elementToUse || elementToUse === iframeDoc.body) {
      // Try to find the last section
      const sections = Array.from(iframeDoc.body.children).filter(
        child => child.tagName && child.tagName.toLowerCase() === 'section'
      );
      if (sections.length > 0) {
        // Append to last section
        sections[sections.length - 1].insertAdjacentHTML('beforeend', html);
      } else {
        // No sections, append to body
        iframeDoc.body.insertAdjacentHTML('beforeend', html);
      }
      return true;
    }

    // Insert after the target element (not inside it)
    elementToUse.insertAdjacentHTML('afterend', html);
    return true;
  } catch (error) {
    console.error('Error inserting HTML:', error);
    return false;
  }
}

/**
 * Insert section after the focused section
 */
export function insertSectionAfter(iframeRef, focusSection, sectionHTML) {
  try {
    const iframe = iframeRef.current;
    if (!iframe || !focusSection) return false;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return false;

    // Insert the section HTML after the focusSection
    focusSection.insertAdjacentHTML('afterend', sectionHTML);
    return true;
  } catch (error) {
    console.error('Error inserting section:', error);
    return false;
  }
}

/**
 * Duplicate a section
 */
export function duplicateSection(iframeRef, section) {
  try {
    if (!section) return false;

    const clonedSection = section.cloneNode(true);
    section.insertAdjacentElement('afterend', clonedSection);
    return true;
  } catch (error) {
    console.error('Error duplicating section:', error);
    return false;
  }
}

/**
 * Move section up (swap with previous sibling)
 */
export function moveSectionUp(iframeRef, section) {
  try {
    if (!section || !section.previousElementSibling) return false;

    const previousSibling = section.previousElementSibling;
    section.parentNode.insertBefore(section, previousSibling);
    return true;
  } catch (error) {
    console.error('Error moving section up:', error);
    return false;
  }
}

/**
 * Move section down (swap with next sibling)
 */
export function moveSectionDown(iframeRef, section) {
  try {
    if (!section || !section.nextElementSibling) return false;

    const nextSibling = section.nextElementSibling;
    section.parentNode.insertBefore(nextSibling, section);
    return true;
  } catch (error) {
    console.error('Error moving section down:', error);
    return false;
  }
}

/**
 * Remove a section
 */
export function removeSection(iframeRef, section) {
  try {
    if (!section) return false;

    section.remove();
    return true;
  } catch (error) {
    console.error('Error removing section:', error);
    return false;
  }
}

/**
 * Get element attributes as an object
 */
export function getElementAttributes(element) {
  if (!element) return {};

  const attrs = {};
  if (element.attributes) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attrs[attr.name] = attr.value;
    }
  }
  return attrs;
}

/**
 * Set element attributes from an object
 */
export function setElementAttributes(element, attrs) {
  if (!element) return;

  Object.keys(attrs).forEach(name => {
    if (attrs[name] === null || attrs[name] === '') {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, attrs[name]);
    }
  });
}
