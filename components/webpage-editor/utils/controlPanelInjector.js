/**
 * Control Panel Injector
 * Injects a full-featured control panel into the iframe as DOM elements
 * Uses postMessage to communicate with parent React components
 */

import { execCommand, queryCommandState } from './editorCommands';
import { sections, getSectionsByCategory, getSectionCategories } from '../components/sections';
import { elements, getElementsByCategory, getElementCategories } from '../components/elements';

/**
 * Inject the control panel into the iframe
 */
export function injectControlPanel(iframeRef, focusSection, focusedElement = null, onAction, callbacks = {}) {
  if (!iframeRef?.current || !focusSection) return null;

  try {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return null;

    // Remove existing control panel
    const existingPanel = iframeDoc.getElementById('section-control-panel');
    if (existingPanel) {
      existingPanel.remove();
    }

    // Get section position
    const rect = focusSection.getBoundingClientRect();
    const scrollX = iframe.contentWindow?.scrollX || 0;
    const scrollY = iframe.contentWindow?.scrollY || 0;

    // Create main container
    const panel = iframeDoc.createElement('div');
    panel.id = 'section-control-panel';
    panel.style.cssText = `
      position: absolute;
      top: ${rect.top + scrollY}px;
      right: ${iframeDoc.documentElement.scrollWidth - rect.right - scrollX}px;
      z-index: 10000;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    // Create formatting buttons
    const createButton = (label, command, icon, title) => {
      const btn = iframeDoc.createElement('button');
      btn.innerHTML = icon || label;
      btn.title = title || label;
      btn.style.cssText = `
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        background: white;
        cursor: pointer;
        min-width: 2rem;
        height: 2rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      `;
      
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#f3f4f6';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'white';
      });

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (command) {
          execCommand(iframeRef, command);
          // Update button state
          setTimeout(() => {
            const isActive = queryCommandState(iframeRef, command);
            btn.style.backgroundColor = isActive ? '#dbeafe' : 'white';
            btn.style.borderColor = isActive ? '#3b82f6' : '#d1d5db';
          }, 50);
        }
        if (onAction) {
          onAction({ type: 'format', command });
        }
      });

      // Check initial state
      if (command) {
        setTimeout(() => {
          const isActive = queryCommandState(iframeRef, command);
          btn.style.backgroundColor = isActive ? '#dbeafe' : 'white';
          btn.style.borderColor = isActive ? '#3b82f6' : '#d1d5db';
        }, 50);
      }

      return btn;
    };

    // Add formatting buttons
    panel.appendChild(createButton('Bold', 'bold', '<strong>B</strong>', 'Bold'));
    panel.appendChild(createButton('Italic', 'italic', '<em>I</em>', 'Italic'));
    panel.appendChild(createButton('Underline', 'underline', '<u>U</u>', 'Underline'));
    panel.appendChild(createButton('Strikethrough', 'strikeThrough', '<s>S</s>', 'Strikethrough'));

    // Divider
    const divider = iframeDoc.createElement('div');
    divider.style.cssText = 'width: 1px; height: 1.5rem; background: #d1d5db; margin: 0 0.25rem;';
    panel.appendChild(divider);

    // List buttons
    panel.appendChild(createButton('Unordered List', 'insertUnorderedList', '•', 'Unordered List'));
    panel.appendChild(createButton('Ordered List', 'insertOrderedList', '1.', 'Ordered List'));

    // Link button
    const linkBtn = createButton('Link', null, '🔗', 'Insert Link');
    linkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const url = prompt('Enter URL:');
      if (url) {
        execCommand(iframeRef, 'createLink', url);
        if (onAction) {
          onAction({ type: 'link', url });
        }
      }
    });
    panel.appendChild(linkBtn);

    // Divider
    const divider2 = iframeDoc.createElement('div');
    divider2.style.cssText = 'width: 1px; height: 1.5rem; background: #d1d5db; margin: 0 0.25rem;';
    panel.appendChild(divider2);

    // Edit Element button (left of Actions)
    const editElementBtn = iframeDoc.createElement('button');
    const updateEditButtonText = () => {
      // Use the focusedElement passed to this function (closure will capture current value when panel is re-injected)
      const elementNodeName = focusedElement ? focusedElement.tagName.toLowerCase() : 'none';
      editElementBtn.textContent = `Edit Element: ${elementNodeName}`;
    };
    updateEditButtonText();
    editElementBtn.style.cssText = `
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      background: white;
      cursor: pointer;
    `;
    editElementBtn.addEventListener('mouseenter', () => {
      editElementBtn.style.backgroundColor = '#f3f4f6';
    });
    editElementBtn.addEventListener('mouseleave', () => {
      editElementBtn.style.backgroundColor = 'white';
    });
    editElementBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (callbacks.onEditElement) {
        callbacks.onEditElement();
      } else if (window.parent) {
        window.parent.postMessage({
          type: 'SECTION_CONTROL_ACTION',
          action: 'edit-element',
        }, '*');
      }
    });
    panel.appendChild(editElementBtn);
    
    // Store update function and focusedElement reference for later use
    panel._updateEditButton = updateEditButtonText;
    panel._focusedElement = focusedElement; // Store reference for updates

    // Actions dropdown button
    const actionsBtn = iframeDoc.createElement('button');
    actionsBtn.textContent = 'Actions';
    actionsBtn.style.cssText = `
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      background: white;
      cursor: pointer;
      position: relative;
    `;
    
    // Create a container for the button and dropdown
    const actionsContainer = iframeDoc.createElement('div');
    actionsContainer.style.cssText = 'position: relative;';
    
    actionsBtn.addEventListener('mouseenter', () => {
      actionsBtn.style.backgroundColor = '#f3f4f6';
    });
    actionsBtn.addEventListener('mouseleave', () => {
      actionsBtn.style.backgroundColor = 'white';
    });

    // Actions dropdown menu
    let dropdown = null;
    actionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      // Remove existing dropdown
      if (dropdown) {
        dropdown.remove();
        dropdown = null;
        return;
      }

      // Create dropdown
      dropdown = iframeDoc.createElement('div');
      dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.25rem;
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        min-width: 200px;
        z-index: 10001;
        padding: 0.5rem;
      `;

      const menuItems = [
        { label: 'Add New Section', action: 'add-section' },
        { label: 'Add New Element', action: 'add-element' },
        { label: 'Duplicate Section', action: 'duplicate-section' },
        { label: 'Move Section Up', action: 'move-up' },
        { label: 'Move Section Down', action: 'move-down' },
        { label: 'Remove Section', action: 'remove-section' },
      ];

      menuItems.forEach((item) => {
        const menuItem = iframeDoc.createElement('div');
        menuItem.textContent = item.label;
        menuItem.style.cssText = `
          padding: 0.5rem;
          cursor: pointer;
          border-radius: 0.25rem;
        `;
        menuItem.addEventListener('mouseenter', () => {
          menuItem.style.backgroundColor = '#f3f4f6';
        });
        menuItem.addEventListener('mouseleave', () => {
          menuItem.style.backgroundColor = 'transparent';
        });
        menuItem.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          dropdown.remove();
          dropdown = null;
          
          // Call the specific callback if it exists
          if (item.action === 'add-section' && callbacks.onAddSection) {
            console.log('Calling onAddSection callback');
            callbacks.onAddSection();
          } else if (item.action === 'add-element' && callbacks.onAddElement) {
            console.log('Calling onAddElement callback');
            callbacks.onAddElement();
          } else if (item.action === 'edit-element' && callbacks.onEditElement) {
            console.log('Calling onEditElement callback');
            callbacks.onEditElement();
          } else {
            // For other actions, send postMessage to parent
            if (onAction) {
              onAction({ type: 'menu-action', action: item.action });
            }
            // Send message to parent (don't include section - it's already tracked in parent state)
            if (window.parent) {
              window.parent.postMessage({
                type: 'SECTION_CONTROL_ACTION',
                action: item.action,
              }, '*');
            }
          }
        });
        dropdown.appendChild(menuItem);
      });

      // Append dropdown to actionsContainer so it's positioned relative to the button
      actionsContainer.appendChild(dropdown);

      // Close dropdown when clicking outside
      const closeDropdown = (e) => {
        if (dropdown && !dropdown.contains(e.target) && !actionsContainer.contains(e.target)) {
          dropdown.remove();
          dropdown = null;
          iframeDoc.removeEventListener('click', closeDropdown);
        }
      };
      setTimeout(() => {
        iframeDoc.addEventListener('click', closeDropdown);
      }, 0);
    });

    actionsContainer.appendChild(actionsBtn);
    panel.appendChild(actionsContainer);
    iframeDoc.body.appendChild(panel);

    // Update position on scroll and resize
    const updatePosition = () => {
      if (!panel || !focusSection) return;
      try {
        const rect = focusSection.getBoundingClientRect();
        const scrollX = iframe.contentWindow?.scrollX || 0;
        const scrollY = iframe.contentWindow?.scrollY || 0;
        panel.style.top = `${rect.top + scrollY}px`;
        panel.style.right = `${iframeDoc.documentElement.scrollWidth - rect.right - scrollX}px`;
      } catch (error) {
        console.error('Error updating control panel position:', error);
      }
    };

    const iframeWindow = iframe.contentWindow;
    if (iframeWindow) {
      iframeWindow.addEventListener('scroll', updatePosition, true);
      iframeWindow.addEventListener('resize', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    // Update edit button text when focusedElement changes
    const updateEditButton = () => {
      if (panel && panel._updateEditButton) {
        panel._updateEditButton();
      }
    };

    return {
      element: panel,
      updatePosition,
      updateEditButton: () => {
        // Update the stored focusedElement reference and refresh button text
        if (panel && panel._updateEditButton) {
          panel._updateEditButton();
        }
      },
      cleanup: () => {
        if (panel) panel.remove();
        if (iframeWindow) {
          iframeWindow.removeEventListener('scroll', updatePosition, true);
          iframeWindow.removeEventListener('resize', updatePosition);
          window.removeEventListener('resize', updatePosition);
        }
      },
    };
  } catch (error) {
    console.error('Error injecting control panel:', error);
    return null;
  }
}
