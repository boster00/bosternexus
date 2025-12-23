/**
 * Element Taxonomy Utilities
 * Functions to build element hierarchy for display in Edit Element Modal
 */

/**
 * Find parent section of an element
 */
export function findParentSection(element) {
  if (!element) return null;
  
  let current = element;
  while (current && current !== current.ownerDocument?.body) {
    if (current.tagName && current.tagName.toLowerCase() === 'section') {
      return current;
    }
    current = current.parentElement;
    if (!current) break;
  }
  
  return null;
}

/**
 * Get all parents from element up to section (including the section)
 */
export function getElementParents(element) {
  const parents = [];
  if (!element) return parents;

  const section = findParentSection(element);
  if (!section) return parents;

  // Start from element's parent and go up to section
  let current = element.parentElement;

  while (current && current !== current.ownerDocument?.body) {
    parents.unshift(current); // Add to beginning to maintain order (section first, then parents)
    if (current === section) break;
    current = current.parentElement;
  }

  return parents;
}

/**
 * Get immediate children (2 layers deep)
 */
export function getElementChildren(element, maxDepth = 2, currentDepth = 0) {
  if (!element || currentDepth >= maxDepth) return [];

  const children = Array.from(element.children);
  return children.map(child => ({
    element: child,
    children: getElementChildren(child, maxDepth, currentDepth + 1),
  }));
}

/**
 * Build taxonomy object for an element
 */
export function buildElementTaxonomy(element) {
  if (!element) return null;

  const section = findParentSection(element);
  const parents = getElementParents(element);
  const children = getElementChildren(element, 2);

  return {
    section,
    parents,
    element,
    children,
  };
}

/**
 * Get element display name
 */
export function getElementDisplayName(element) {
  if (!element) return 'none';
  
  const tagName = element.tagName ? element.tagName.toLowerCase() : 'unknown';
  const id = element.id ? `#${element.id}` : '';
  const classes = element.className && typeof element.className === 'string' 
    ? `.${element.className.split(' ').join('.')}` 
    : '';
  
  return `${tagName}${id}${classes}`;
}
