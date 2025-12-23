'use client';

import { useState, useEffect, useRef } from 'react';
import { execCommand, queryCommandState, getFocusedElement, insertHTMLAfterElement, insertSectionAfter, duplicateSection, moveSectionUp, moveSectionDown, getElementAttributes, setElementAttributes } from '../utils/editorCommands';
import { sections, getSectionsByCategory, getSectionCategories } from './sections';
import { elements, getElementsByCategory, getElementCategories } from './elements';
import AddSectionModal from './modals/AddSectionModal';
import AddElementModal from './modals/AddElementModal';
import EditElementModal from './modals/EditElementModal';

/**
 * SectionControlPanel component
 * Displays controls for the currently focused section
 * Positioned in the top-right corner of the focused section
 */
export default function SectionControlPanel({ focusSection, iframeRef, onSectionFocus }) {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddElementModal, setShowAddElementModal] = useState(false);
  const [showEditElementModal, setShowEditElementModal] = useState(false);
  const [editElement, setEditElement] = useState(null);
  const [formattingState, setFormattingState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  const dropdownRef = useRef(null);

  // Update formatting state based on current selection
  useEffect(() => {
    if (!iframeRef?.current || !focusSection) return;

    const updateFormattingState = () => {
      try {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        setFormattingState({
          bold: queryCommandState(iframeRef, 'bold'),
          italic: queryCommandState(iframeRef, 'italic'),
          underline: queryCommandState(iframeRef, 'underline'),
          strikethrough: queryCommandState(iframeRef, 'strikeThrough'),
        });
      } catch (error) {
        console.error('Error updating formatting state:', error);
      }
    };

    // Update on selection change
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.addEventListener('selectionchange', updateFormattingState);
      iframeDoc.addEventListener('mouseup', updateFormattingState);
      iframeDoc.addEventListener('keyup', updateFormattingState);
    }

    updateFormattingState();

    return () => {
      if (iframeDoc) {
        iframeDoc.removeEventListener('selectionchange', updateFormattingState);
        iframeDoc.removeEventListener('mouseup', updateFormattingState);
        iframeDoc.removeEventListener('keyup', updateFormattingState);
      }
    };
  }, [iframeRef, focusSection]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActionsDropdown(false);
      }
    };

    if (showActionsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionsDropdown]);

  const handleFormat = (command) => {
    execCommand(iframeRef, command);
    // Update state after a short delay
    setTimeout(() => {
      setFormattingState({
        bold: queryCommandState(iframeRef, 'bold'),
        italic: queryCommandState(iframeRef, 'italic'),
        underline: queryCommandState(iframeRef, 'underline'),
        strikethrough: queryCommandState(iframeRef, 'strikeThrough'),
      });
    }, 50);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand(iframeRef, 'createLink', url);
    }
  };

  const handleAddSection = (sectionKey) => {
    const section = sections[sectionKey];
    if (section && focusSection) {
      insertSectionAfter(iframeRef, focusSection, section.html);
      setShowAddSectionModal(false);
    }
  };

  const handleAddElement = (elementKey) => {
    const element = elements[elementKey];
    if (element) {
      insertHTMLAfterElement(iframeRef, element.html);
      setShowAddElementModal(false);
    }
  };

  const handlePasteHTML = (html) => {
    insertHTMLAfterElement(iframeRef, html);
    setShowAddElementModal(false);
  };

  const handleDuplicateSection = () => {
    if (focusSection) {
      duplicateSection(iframeRef, focusSection);
      setShowActionsDropdown(false);
    }
  };

  const handleMoveSectionUp = () => {
    if (focusSection) {
      moveSectionUp(iframeRef, focusSection);
      setShowActionsDropdown(false);
    }
  };

  const handleMoveSectionDown = () => {
    if (focusSection) {
      moveSectionDown(iframeRef, focusSection);
      setShowActionsDropdown(false);
    }
  };

  const handleEditElement = () => {
    const focusedElement = getFocusedElement(iframeRef);
    if (focusedElement && focusedElement !== iframeRef.current?.contentDocument?.body) {
      setEditElement(focusedElement);
      setShowEditElementModal(true);
      setShowActionsDropdown(false);
    } else {
      alert('Please click on an element to edit it');
    }
  };

  const handleElementUpdate = (html, attributes) => {
    if (!editElement) return;

    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // Update attributes
      setElementAttributes(editElement, attributes);

      // Update innerHTML if provided
      if (html !== undefined) {
        editElement.innerHTML = html;
      }
    } catch (error) {
      console.error('Error updating element:', error);
    }
  };

  if (!focusSection) {
    return null;
  }

  return (
    <>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center gap-1" ref={dropdownRef}>
        {/* Text Formatting Buttons */}
        <button
          onClick={() => handleFormat('bold')}
          className={`btn btn-sm ${formattingState.bold ? 'btn-active' : 'btn-ghost'}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => handleFormat('italic')}
          className={`btn btn-sm ${formattingState.italic ? 'btn-active' : 'btn-ghost'}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => handleFormat('underline')}
          className={`btn btn-sm ${formattingState.underline ? 'btn-active' : 'btn-ghost'}`}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => handleFormat('strikeThrough')}
          className={`btn btn-sm ${formattingState.strikethrough ? 'btn-active' : 'btn-ghost'}`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <div className="divider divider-horizontal"></div>
        <button
          onClick={() => handleFormat('insertUnorderedList')}
          className="btn btn-sm btn-ghost"
          title="Unordered List"
        >
          <span className="text-lg">•</span>
        </button>
        <button
          onClick={() => handleFormat('insertOrderedList')}
          className="btn btn-sm btn-ghost"
          title="Ordered List"
        >
          <span className="text-sm">1.</span>
        </button>
        <button
          onClick={handleInsertLink}
          className="btn btn-sm btn-ghost"
          title="Insert Link"
        >
          <span className="text-sm">🔗</span>
        </button>
        <div className="divider divider-horizontal"></div>
        
        {/* Actions Dropdown */}
        <div className="dropdown dropdown-end">
          <button
            onClick={() => setShowActionsDropdown(!showActionsDropdown)}
            className="btn btn-sm btn-outline"
          >
            Actions
          </button>
          {showActionsDropdown && (
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-gray-200">
              <li>
                <a onClick={() => { setShowAddSectionModal(true); setShowActionsDropdown(false); }}>
                  Add New Section
                </a>
              </li>
              <li>
                <a onClick={() => { setShowAddElementModal(true); setShowActionsDropdown(false); }}>
                  Add New Element
                </a>
              </li>
              <li>
                <a onClick={handleDuplicateSection}>Duplicate Section</a>
              </li>
              <li>
                <a onClick={handleMoveSectionUp}>Move Section Up</a>
              </li>
              <li>
                <a onClick={handleMoveSectionDown}>Move Section Down</a>
              </li>
              <li>
                <a onClick={handleEditElement}>Edit Element</a>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onSelect={handleAddSection}
        sections={sections}
        categories={getSectionCategories()}
        sectionsByCategory={getSectionsByCategory()}
      />

      <AddElementModal
        isOpen={showAddElementModal}
        onClose={() => setShowAddElementModal(false)}
        onSelect={handleAddElement}
        onPasteHTML={handlePasteHTML}
        elements={elements}
        categories={getElementCategories()}
        elementsByCategory={getElementsByCategory()}
      />

      <EditElementModal
        isOpen={showEditElementModal}
        onClose={() => { setShowEditElementModal(false); setEditElement(null); }}
        element={editElement}
        onUpdate={handleElementUpdate}
      />
    </>
  );
}
