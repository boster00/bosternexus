'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import LeftPanel from './LeftPanel';
import { injectControlPanel } from './utils/controlPanelInjector';
import { injectAddSectionModal } from './utils/iframeModals';
import { injectAddElementModal } from './utils/iframeModals';
import { injectEditElementModal } from './utils/iframeEditElementModal';
import { sections } from './components/sections';
import { elements } from './components/elements';
import { insertSectionAfter, insertHTMLAfterElement, duplicateSection, moveSectionUp, moveSectionDown, removeSection, setElementAttributes, getElementAttributes } from './utils/editorCommands';

export default function WebpageEditorShell({ userId, initialContent, initialWebpage = null, urlKey = null }) {
  const [currentWebpage, setCurrentWebpage] = useState(initialWebpage);
  const [isDirty, setIsDirty] = useState(false);
  
  // Determine initial page content
  // Priority: 1) initialWebpage.html_content, 2) sessionStorage (for new pages), 3) initialContent
  const [pageContent, setPageContent] = useState(() => {
    if (initialWebpage?.html_content) {
      return initialWebpage.html_content;
    }
    // Check sessionStorage for HTML content from NewPageModal (client-side only)
    if (typeof window !== 'undefined' && !urlKey) {
      const storedHtml = sessionStorage.getItem('newPageHtmlContent');
      if (storedHtml) {
        // Clear it from sessionStorage so it's only used once
        sessionStorage.removeItem('newPageHtmlContent');
        return storedHtml;
      }
    }
    return initialContent;
  });
  const [focusSection, setFocusSection] = useState(null);
  const [focusedElement, setFocusedElement] = useState(null); // Last clicked in-section element
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Visibility state (hidden by default)
  const iframeRef = useRef(null);
  const controlPanelRef = useRef(null);
  const addSectionModalRef = useRef(null);
  const addElementModalRef = useRef(null);
  const editElementModalRef = useRef(null);

  // Handle section selection
  const handleAddSection = useCallback((sectionKey) => {
    const section = sections[sectionKey];
    if (!section) return;
    
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc || !iframeDoc.body) return;
      
      if (focusSection) {
        // Insert after the focused section
        insertSectionAfter(iframeRef, focusSection, section.html);
      } else {
        // No focused section, append to body
        iframeDoc.body.insertAdjacentHTML('beforeend', section.html);
      }
    } catch (error) {
      console.error('Error adding section:', error);
    }
  }, [focusSection]);

  // Handle element selection
  const handleAddElement = useCallback((elementKey) => {
    const element = elements[elementKey];
    if (!element) return;
    
    try {
      insertHTMLAfterElement(iframeRef, element.html, focusedElement);
    } catch (error) {
      console.error('Error adding element:', error);
    }
  }, [focusedElement]);

  // Handle paste HTML
  const handlePasteHTML = useCallback((html) => {
    insertHTMLAfterElement(iframeRef, html, focusedElement);
  }, [focusedElement]);

  // Handle element update
  const handleElementUpdate = useCallback((html, attributes) => {
    if (!focusedElement) return;
    try {
      setElementAttributes(focusedElement, attributes);
      if (html !== undefined) {
        focusedElement.innerHTML = html;
      }
    } catch (error) {
      console.error('Error updating element:', error);
    }
  }, [focusedElement]);

  // Inject control panel into iframe when focusSection changes
  useEffect(() => {
    if (!iframeRef.current) return;

    // Cleanup previous panel
    if (controlPanelRef.current) {
      controlPanelRef.current.cleanup();
      controlPanelRef.current = null;
    }

    if (!focusSection) return;

    const timeoutId = setTimeout(() => {
      const panel = injectControlPanel(iframeRef, focusSection, focusedElement, (action) => {
        // Handle actions from control panel
        console.log('Control panel action:', action);
      }, {
        onAddSection: () => {
          console.log('onAddSection callback called');
          // Inject modal into iframe
          if (addSectionModalRef.current) {
            addSectionModalRef.current.cleanup();
          }
          const modal = injectAddSectionModal(
            iframeRef,
            handleAddSection,
            () => {
              addSectionModalRef.current = null;
            }
          );
          console.log('Add section modal injected:', modal);
          addSectionModalRef.current = modal;
        },
        onAddElement: () => {
          console.log('onAddElement callback called');
          // Inject modal into iframe
          if (addElementModalRef.current) {
            addElementModalRef.current.cleanup();
          }
          const modal = injectAddElementModal(
            iframeRef,
            handleAddElement,
            handlePasteHTML,
            () => {
              addElementModalRef.current = null;
            }
          );
          console.log('Add element modal injected:', modal);
          addElementModalRef.current = modal;
        },
        onEditElement: () => {
          if (focusedElement) {
            // Inject modal into iframe
            if (editElementModalRef.current) {
              editElementModalRef.current.cleanup();
            }
            editElementModalRef.current = injectEditElementModal(
              iframeRef,
              focusedElement,
              handleElementUpdate,
              (selectedElement) => {
                // Update focused element when user clicks on taxonomy
                setFocusedElement(selectedElement);
                // Re-inject modal with new element
                if (editElementModalRef.current) {
                  editElementModalRef.current.cleanup();
                }
                editElementModalRef.current = injectEditElementModal(
                  iframeRef,
                  selectedElement,
                  handleElementUpdate,
                  (newSelectedElement) => {
                    setFocusedElement(newSelectedElement);
                  },
                  () => {
                    editElementModalRef.current = null;
                  },
                  userId
                );
                // Update control panel edit button text
                if (controlPanelRef.current && controlPanelRef.current.element && controlPanelRef.current.element._updateEditButton) {
                  controlPanelRef.current.element._updateEditButton();
                }
              },
              () => {
                editElementModalRef.current = null;
              },
              userId
            );
          } else {
            alert('Please click on an element within a section to edit it');
          }
        },
      });
      controlPanelRef.current = panel;
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (controlPanelRef.current) {
        controlPanelRef.current.cleanup();
        controlPanelRef.current = null;
      }
    };
  }, [focusSection, focusedElement, iframeRef, handleAddSection, handleAddElement, handlePasteHTML, handleElementUpdate, setFocusedElement]);

  // Update edit button text when focusedElement changes
  useEffect(() => {
    if (controlPanelRef.current && controlPanelRef.current.updateEditButton) {
      controlPanelRef.current.updateEditButton();
    }
  }, [focusedElement]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data && event.data.type === 'SECTION_CONTROL_ACTION') {
        const { action } = event.data;
        
        switch (action) {
          case 'add-section':
          case 'add-element':
          case 'edit-element':
            // Handled by callbacks in control panel injection
            break;
          case 'duplicate-section':
            if (focusSection) {
              duplicateSection(iframeRef, focusSection);
            }
            break;
          case 'move-up':
            if (focusSection) {
              moveSectionUp(iframeRef, focusSection);
            }
            break;
          case 'move-down':
            if (focusSection) {
              moveSectionDown(iframeRef, focusSection);
            }
            break;
          case 'remove-section':
            if (focusSection) {
              if (confirm('Are you sure you want to remove this section?')) {
                removeSection(iframeRef, focusSection);
                setFocusSection(null); // Clear focus after removal
              }
            }
            break;
          default:
            console.log('Received action from iframe:', action);
        }
      } else if (event.data && event.data.type === 'REQUEST_USER_ID') {
        // Handle userId request from iframe
        if (event.source) {
          event.source.postMessage({
            type: 'USER_ID_RESPONSE',
            userId: userId,
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [focusSection, iframeRef, userId]);

  // Handle new page
  const handleNewPage = () => {
    if (isDirty) {
      const confirmed = confirm('You have unsaved changes. All unsaved changes will be lost. Create a new page anyway?');
      if (!confirmed) {
        return;
      }
    }
    
    // Clear iframe content and reload default HTML
    try {
      const iframe = iframeRef.current;
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc && iframeDoc.body) {
          // Clear body content
          iframeDoc.body.innerHTML = '';
          
          // Load default HTML content
          iframeDoc.body.innerHTML = initialContent;
          
          // Make body contenteditable
          iframeDoc.body.setAttribute('contenteditable', 'true');
        }
      }
    } catch (error) {
      console.error('Error resetting iframe content:', error);
    }
    
    // Reset state
    setPageContent(initialContent);
    setCurrentWebpage(null);
    setIsDirty(false);
    setFocusSection(null);
    setFocusedElement(null);
  };

  // Handle save
  const handleSave = async (name, urlKey) => {
    // This will be handled by LeftPanel
    return { name, urlKey };
  };

  // Handle load
  const handleLoad = (webpage) => {
    setCurrentWebpage(webpage);
    setPageContent(webpage.html_content);
    setIsDirty(false);
  };

  // Handle sidebar visibility toggle
  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 relative">
      {/* Sidebar Toggle Button (shown when sidebar is hidden) */}
      {!isSidebarVisible && (
        <button
          onClick={handleSidebarToggle}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 rounded-r-lg px-2 py-4 shadow-md hover:bg-gray-50 transition-colors"
          title="Show sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Left Panel */}
      <div
        className={`bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto transition-all duration-300 relative ${
          isSidebarVisible ? 'w-80' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Close Button (shown when sidebar is visible) */}
        {isSidebarVisible && (
          <button
            onClick={handleSidebarToggle}
            className="absolute top-4 right-4 z-10 p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {/* Keep LeftPanel mounted to preserve iframe state */}
        <div className={isSidebarVisible ? 'block' : 'hidden'}>
          <LeftPanel
            userId={userId}
            urlKey={urlKey}
            currentWebpage={currentWebpage}
            isDirty={isDirty}
            pageContent={pageContent}
            onNewPage={handleNewPage}
            onSave={handleSave}
            onLoad={handleLoad}
            onWebpageChange={(webpage) => {
              setCurrentWebpage(webpage);
              setIsDirty(false);
            }}
            iframeRef={iframeRef}
            focusSection={focusSection}
            onSectionFocus={setFocusSection}
            focusedElement={focusedElement}
            onElementFocus={setFocusedElement}
          />
        </div>
      </div>

      {/* Right Panel - Empty Iframe */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src="about:blank"
          className="w-full h-full border-0"
          title="Webpage Preview"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}
