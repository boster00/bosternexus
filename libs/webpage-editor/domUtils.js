/**
 * DOM Utilities for Webpage Editor
 * Helper functions for manipulating HTML sections
 */

/**
 * Find the nearest section element from a given element
 */
export function findNearestSection(element) {
  let current = element;
  while (current && current !== document.body) {
    if (current.tagName === 'SECTION' || current.classList.contains('section')) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

/**
 * Get all sections in the document
 */
export function getAllSections(container = document) {
  return Array.from(container.querySelectorAll('section, .section'));
}

/**
 * Replace a section's HTML content
 */
export function replaceSection(sectionElement, newHTML) {
  if (!sectionElement || !sectionElement.parentNode) {
    return false;
  }
  
  // Create a temporary container to parse the new HTML
  const temp = document.createElement('div');
  temp.innerHTML = newHTML.trim();
  
  // Get the first element (should be the section)
  const newSection = temp.firstElementChild;
  if (!newSection) {
    return false;
  }
  
  // Replace the old section with the new one
  sectionElement.parentNode.replaceChild(newSection, sectionElement);
  return newSection;
}

/**
 * Duplicate a section
 */
export function duplicateSection(sectionElement) {
  if (!sectionElement) {
    return null;
  }
  
  const clone = sectionElement.cloneNode(true);
  sectionElement.parentNode.insertBefore(clone, sectionElement.nextSibling);
  return clone;
}

/**
 * Remove a section
 */
export function removeSection(sectionElement) {
  if (!sectionElement || !sectionElement.parentNode) {
    return false;
  }
  
  sectionElement.parentNode.removeChild(sectionElement);
  return true;
}

/**
 * Insert a new section after a reference section
 */
export function insertSectionAfter(referenceSection, newHTML) {
  if (!referenceSection || !referenceSection.parentNode) {
    return null;
  }
  
  const temp = document.createElement('div');
  temp.innerHTML = newHTML.trim();
  const newSection = temp.firstElementChild;
  
  if (!newSection) {
    return null;
  }
  
  referenceSection.parentNode.insertBefore(newSection, referenceSection.nextSibling);
  return newSection;
}

/**
 * Insert a new section before a reference section
 */
export function insertSectionBefore(referenceSection, newHTML) {
  if (!referenceSection || !referenceSection.parentNode) {
    return null;
  }
  
  const temp = document.createElement('div');
  temp.innerHTML = newHTML.trim();
  const newSection = temp.firstElementChild;
  
  if (!newSection) {
    return null;
  }
  
  referenceSection.parentNode.insertBefore(newSection, referenceSection);
  return newSection;
}

/**
 * Insert a new section at the end of the body
 */
export function appendSection(container, newHTML) {
  const temp = document.createElement('div');
  temp.innerHTML = newHTML.trim();
  const newSection = temp.firstElementChild;
  
  if (!newSection) {
    return null;
  }
  
  container.appendChild(newSection);
  return newSection;
}

/**
 * Validate section HTML (basic safety check)
 */
export function validateSectionHTML(html) {
  // Must contain a section tag
  if (!html.includes('<section') && !html.match(/<div[^>]*class="[^"]*section[^"]*"/i)) {
    return { valid: false, error: 'HTML must contain a <section> element' };
  }
  
  // Block script tags for security (can be relaxed later if needed)
  if (html.includes('<script')) {
    return { valid: false, error: 'Script tags are not allowed for security reasons' };
  }
  
  return { valid: true };
}
