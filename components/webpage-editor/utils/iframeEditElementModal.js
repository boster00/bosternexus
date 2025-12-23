/**
 * Iframe Edit Element Modal Injector
 * Injects edit element modal directly into the iframe
 */

import { getElementAttributes, setElementAttributes } from './editorCommands';
import { buildElementTaxonomy, getElementDisplayName } from './elementTaxonomy';

/**
 * Inject Edit Element Modal into iframe
 * @param {Object} iframeRef - Reference to the iframe
 * @param {HTMLElement} element - The element to edit (will be replaced if outerHTML changes)
 * @param {Function} onUpdate - Callback when element is updated (receives newElement, attributes)
 * @param {Function} onElementSelect - Callback when user clicks on taxonomy element
 * @param {Function} onClose - Callback when modal is closed
 * @param {string} userId - User ID for AI requests
 */
export function injectEditElementModal(iframeRef, element, onUpdate, onElementSelect, onClose, userId = null) {
  if (!iframeRef?.current || !element) return null;
  
  // Store reference to original element for replacement
  const originalElement = element;
  // Store current element reference (may change if replaced)
  let currentElement = element;

  try {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return null;

    // Remove existing modal
    const existingModal = iframeDoc.getElementById('do-not-include');
    if (existingModal) {
      existingModal.remove();
    }

    // Build taxonomy (use original element for taxonomy)
    const taxonomy = buildElementTaxonomy(originalElement);
    if (!taxonomy) return null;

    // Create wrapper div
    const wrapper = iframeDoc.createElement('div');
    wrapper.id = 'do-not-include';
    wrapper.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 20000;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create modal container
    const modal = iframeDoc.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      width: 90%;
      max-width: 1536px;
      height: 80vh;
      display: flex;
      flex-direction: column;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    // Header
    const header = iframeDoc.createElement('div');
    header.style.cssText = `
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    const headerLeft = iframeDoc.createElement('div');
    const title = iframeDoc.createElement('h2');
    title.textContent = 'Edit Element';
    title.style.cssText = 'font-size: 1.5rem; font-weight: bold; margin: 0 0 0.25rem 0;';
    headerLeft.appendChild(title);
    const elementInfo = iframeDoc.createElement('p');
    elementInfo.textContent = `Node: ${originalElement.tagName.toLowerCase()} | ID: ${originalElement.id || '(no id)'} | Class: ${originalElement.className || '(no class)'}`;
    elementInfo.style.cssText = 'font-size: 0.875rem; color: #6b7280; margin: 0;';
    headerLeft.appendChild(elementInfo);
    header.appendChild(headerLeft);

    const closeBtn = iframeDoc.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      padding: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1.25rem;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
    `;
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.backgroundColor = '#f3f4f6';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.backgroundColor = 'transparent';
    });
    closeBtn.addEventListener('click', () => {
      wrapper.remove();
      if (onClose) onClose();
    });
    header.appendChild(closeBtn);
    modal.appendChild(header);

    // Content area - 3 columns
    const content = iframeDoc.createElement('div');
    content.style.cssText = `
      flex: 1;
      display: flex;
      overflow: hidden;
    `;

    // Left Panel - Taxonomy
    const taxonomyPanel = iframeDoc.createElement('div');
    taxonomyPanel.style.cssText = `
      width: 300px;
      border-right: 1px solid #e5e7eb;
      padding: 1.5rem;
      overflow-y: auto;
      background: #f9fafb;
    `;
    const taxonomyTitle = iframeDoc.createElement('h3');
    taxonomyTitle.textContent = 'Element Taxonomy';
    taxonomyTitle.style.cssText = 'font-weight: 600; margin-bottom: 1rem;';
    taxonomyPanel.appendChild(taxonomyTitle);

    const taxonomyTree = iframeDoc.createElement('div');
    taxonomyTree.style.cssText = 'font-family: monospace; font-size: 0.875rem;';

    // Render taxonomy tree
    const renderTaxonomy = (taxonomy, depth = 0) => {
      // Render parents (from section down to element's parent)
      taxonomy.parents.forEach((parent, index) => {
        const indent = '  '.repeat(index);
        const parentDiv = iframeDoc.createElement('div');
        parentDiv.style.cssText = `
          padding: 0.25rem 0;
          color: #6b7280;
          cursor: pointer;
        `;
        parentDiv.textContent = `${indent}${getElementDisplayName(parent)}`;
        parentDiv.addEventListener('click', () => {
          if (onElementSelect) {
            onElementSelect(parent);
            // Re-render modal with new element
            wrapper.remove();
            setTimeout(() => {
              injectEditElementModal(iframeRef, parent, onUpdate, onElementSelect, onClose, userId);
            }, 50);
          }
        });
        parentDiv.addEventListener('mouseenter', () => {
          parentDiv.style.backgroundColor = '#e5e7eb';
        });
        parentDiv.addEventListener('mouseleave', () => {
          parentDiv.style.backgroundColor = 'transparent';
        });
        taxonomyTree.appendChild(parentDiv);
      });

      // Render current element (highlighted)
      const currentIndent = '  '.repeat(taxonomy.parents.length);
      const currentDiv = iframeDoc.createElement('div');
      currentDiv.style.cssText = `
        padding: 0.5rem;
        margin: 0.25rem 0;
        background: #dbeafe;
        border: 2px solid #3b82f6;
        border-radius: 0.25rem;
        font-weight: 600;
        cursor: pointer;
      `;
      currentDiv.textContent = `${currentIndent}${getElementDisplayName(taxonomy.element)} (current)`;
      currentDiv.addEventListener('click', () => {
        if (onElementSelect) {
          onElementSelect(taxonomy.element);
          // Re-render modal with current element (refresh view)
          wrapper.remove();
          setTimeout(() => {
            injectEditElementModal(iframeRef, taxonomy.element, onUpdate, onElementSelect, onClose, userId);
          }, 50);
        }
      });
      taxonomyTree.appendChild(currentDiv);

      // Render children (2 layers)
      const renderChildren = (children, childDepth = 0) => {
        children.forEach((child) => {
          const childIndent = '  '.repeat(taxonomy.parents.length + 1 + childDepth);
          const childDiv = iframeDoc.createElement('div');
          childDiv.style.cssText = `
            padding: 0.25rem 0;
            color: #6b7280;
            cursor: pointer;
          `;
          childDiv.textContent = `${childIndent}${getElementDisplayName(child.element)}`;
          childDiv.addEventListener('click', () => {
            if (onElementSelect) {
              onElementSelect(child.element);
              // Re-render modal with new element
              wrapper.remove();
              setTimeout(() => {
                injectEditElementModal(iframeRef, child.element, onUpdate, onElementSelect, onClose, userId);
              }, 50);
            }
          });
          childDiv.addEventListener('mouseenter', () => {
            childDiv.style.backgroundColor = '#e5e7eb';
          });
          childDiv.addEventListener('mouseleave', () => {
            childDiv.style.backgroundColor = 'transparent';
          });
          taxonomyTree.appendChild(childDiv);

          // Render grandchildren (second layer)
          if (child.children && child.children.length > 0 && childDepth === 0) {
            renderChildren(child.children, childDepth + 1);
          }
        });
      };

      renderChildren(taxonomy.children);
    };

    renderTaxonomy(taxonomy);
    taxonomyPanel.appendChild(taxonomyTree);
    content.appendChild(taxonomyPanel);

    // Middle Panel - HTML Textarea
    const htmlPanel = iframeDoc.createElement('div');
    htmlPanel.style.cssText = `
      width: 50%;
      border-right: 1px solid #e5e7eb;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    `;
    const htmlTitle = iframeDoc.createElement('h3');
    htmlTitle.textContent = 'HTML';
    htmlTitle.style.cssText = 'font-weight: 600; margin-bottom: 0.5rem;';
    htmlPanel.appendChild(htmlTitle);

    const textarea = iframeDoc.createElement('textarea');
    textarea.value = currentElement.outerHTML || '';
    textarea.style.cssText = `
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.875rem;
      resize: none;
    `;
    textarea.addEventListener('input', (e) => {
      const newHTML = e.target.value.trim();
      if (newHTML) {
        try {
          // Create a temporary container to parse the new HTML
          const tempDiv = iframeDoc.createElement('div');
          tempDiv.innerHTML = newHTML;
          const newElement = tempDiv.firstElementChild;
          
          if (newElement && currentElement && currentElement.parentNode) {
            // Replace the element with the new one
            currentElement.parentNode.replaceChild(newElement, currentElement);
            currentElement = newElement; // Update reference
            
            // Update attributes from the new element
            const newAttributes = getElementAttributes(newElement);
            if (onUpdate) {
              onUpdate(newElement.outerHTML, newAttributes);
            }
            
            // Update the textarea value to reflect any normalization
            textarea.value = newElement.outerHTML;
          }
        } catch (error) {
          console.error('Error updating element from outerHTML:', error);
        }
      }
    });
    htmlPanel.appendChild(textarea);
    content.appendChild(htmlPanel);

    // Right Panel - Split into Attributes and AI Edit
    const rightPanelContainer = iframeDoc.createElement('div');
    rightPanelContainer.style.cssText = `
      width: 50%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    // Attributes Section
    const attrsPanel = iframeDoc.createElement('div');
    attrsPanel.style.cssText = `
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      border-bottom: 1px solid #e5e7eb;
    `;
    const attrsHeader = iframeDoc.createElement('div');
    attrsHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;';
    const attrsTitle = iframeDoc.createElement('h3');
    attrsTitle.textContent = 'Attributes';
    attrsTitle.style.cssText = 'font-weight: 600; margin: 0;';
    attrsHeader.appendChild(attrsTitle);

    const addAttrBtn = iframeDoc.createElement('button');
    addAttrBtn.textContent = '+ Add Attribute';
    addAttrBtn.style.cssText = `
      padding: 0.5rem 1rem;
      background: #ea8d28;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
    `;
    addAttrBtn.addEventListener('click', () => {
      if (!currentElement) return;
      const name = prompt('Attribute name:');
      if (name) {
        const value = prompt('Attribute value:') || '';
        setElementAttributes(currentElement, { [name]: value });
        // Update textarea to reflect new attribute
        textarea.value = currentElement.outerHTML;
        if (onUpdate) {
          onUpdate(currentElement.outerHTML, getElementAttributes(currentElement));
        }
        // Re-render modal to show new attribute
        wrapper.remove();
        setTimeout(() => {
          injectEditElementModal(iframeRef, currentElement, onUpdate, onElementSelect, onClose, userId);
        }, 50);
      }
    });
    attrsHeader.appendChild(addAttrBtn);
    attrsPanel.appendChild(attrsHeader);

    const attrsTable = iframeDoc.createElement('table');
    attrsTable.style.cssText = 'width: 100%; border-collapse: collapse;';
    const thead = iframeDoc.createElement('thead');
    const headerRow = iframeDoc.createElement('tr');
    ['Attribute', 'Value', 'Action'].forEach((text) => {
      const th = iframeDoc.createElement('th');
      th.textContent = text;
      th.style.cssText = 'text-align: left; padding: 0.5rem; border-bottom: 1px solid #e5e7eb; font-weight: 600;';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    attrsTable.appendChild(thead);

    const tbody = iframeDoc.createElement('tbody');
    const attributes = getElementAttributes(currentElement);
    Object.keys(attributes).forEach((name) => {
      const row = iframeDoc.createElement('tr');
      row.style.cssText = 'border-bottom: 1px solid #f3f4f6;';

      const nameCell = iframeDoc.createElement('td');
      nameCell.textContent = name;
      nameCell.style.cssText = 'padding: 0.5rem; font-family: monospace; font-size: 0.875rem;';
      row.appendChild(nameCell);

      const valueCell = iframeDoc.createElement('td');
      const valueInput = iframeDoc.createElement('input');
      valueInput.type = 'text';
      valueInput.value = attributes[name];
      valueInput.style.cssText = `
        width: 100%;
        padding: 0.25rem 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      `;
      valueInput.addEventListener('input', (e) => {
        if (!currentElement) return;
        setElementAttributes(currentElement, { [name]: e.target.value });
        if (onUpdate) {
          onUpdate(currentElement.outerHTML, getElementAttributes(currentElement));
        }
        // Update textarea to reflect attribute changes
        textarea.value = currentElement.outerHTML;
      });
      valueCell.appendChild(valueInput);
      row.appendChild(valueCell);

      const actionCell = iframeDoc.createElement('td');
      const removeBtn = iframeDoc.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.style.cssText = `
        padding: 0.25rem 0.75rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 0.875rem;
      `;
      removeBtn.addEventListener('click', () => {
        if (!currentElement) return;
        currentElement.removeAttribute(name);
        // Update textarea to reflect attribute removal
        textarea.value = currentElement.outerHTML;
        if (onUpdate) {
          onUpdate(currentElement.outerHTML, getElementAttributes(currentElement));
        }
        // Re-render modal to remove attribute from table
        wrapper.remove();
        setTimeout(() => {
          injectEditElementModal(iframeRef, currentElement, onUpdate, onElementSelect, onClose, userId);
        }, 50);
      });
      actionCell.appendChild(removeBtn);
      row.appendChild(actionCell);

      tbody.appendChild(row);
    });

    if (Object.keys(attributes).length === 0) {
      const emptyRow = iframeDoc.createElement('tr');
      const emptyCell = iframeDoc.createElement('td');
      emptyCell.colSpan = 3;
      emptyCell.textContent = 'No attributes. Click "Add Attribute" to add one.';
      emptyCell.style.cssText = 'text-align: center; padding: 1rem; color: #6b7280;';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    }

    attrsTable.appendChild(tbody);
    attrsPanel.appendChild(attrsTable);
    rightPanelContainer.appendChild(attrsPanel);

    // AI Edit Section
    const aiPanel = iframeDoc.createElement('div');
    aiPanel.style.cssText = `
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      border-top: 2px solid #e5e7eb;
    `;
    
    const aiTitle = iframeDoc.createElement('h3');
    aiTitle.textContent = 'Edit by AI';
    aiTitle.style.cssText = 'font-weight: 600; margin-bottom: 1rem;';
    aiPanel.appendChild(aiTitle);

    // Prompt type selector
    const promptTypeLabel = iframeDoc.createElement('label');
    promptTypeLabel.textContent = 'Prompt Type:';
    promptTypeLabel.style.cssText = 'font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; display: block;';
    aiPanel.appendChild(promptTypeLabel);

    const promptTypeSelect = iframeDoc.createElement('select');
    promptTypeSelect.style.cssText = `
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    `;
    const promptTypes = [
      { value: 'none', label: 'None (General Instructions)' },
      { value: 'replace-all', label: 'Replace ALL Contents' },
      { value: 'replace-selective', label: 'Replace Contents (Keep Unchanged)' },
      { value: 'make-adjustments', label: 'Make Adjustments' },
    ];
    promptTypes.forEach(({ value, label }) => {
      const option = iframeDoc.createElement('option');
      option.value = value;
      option.textContent = label;
      promptTypeSelect.appendChild(option);
    });
    aiPanel.appendChild(promptTypeSelect);

    // Model Type selector
    const modelTypeLabel = iframeDoc.createElement('label');
    modelTypeLabel.textContent = 'Model:';
    modelTypeLabel.style.cssText = 'font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; display: block;';
    aiPanel.appendChild(modelTypeLabel);

    const modelTypeSelect = iframeDoc.createElement('select');
    modelTypeSelect.style.cssText = `
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    `;
    const modelTypes = [
      { value: 'normal', label: 'Normal (GPT-4o)' },
      { value: 'advanced', label: 'Advanced (GPT-5.1)' },
    ];
    modelTypes.forEach(({ value, label }) => {
      const option = iframeDoc.createElement('option');
      option.value = value;
      option.textContent = label;
      modelTypeSelect.appendChild(option);
    });
    aiPanel.appendChild(modelTypeSelect);

    // AI Prompt textarea
    const aiPromptLabel = iframeDoc.createElement('label');
    aiPromptLabel.textContent = 'AI Prompt:';
    aiPromptLabel.style.cssText = 'font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; display: block;';
    aiPanel.appendChild(aiPromptLabel);

    const aiPromptTextarea = iframeDoc.createElement('textarea');
    aiPromptTextarea.placeholder = 'Enter your instructions for the AI...';
    aiPromptTextarea.style.cssText = `
      width: 100%;
      min-height: 4rem;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-family: inherit;
      resize: vertical;
      margin-bottom: 0.75rem;
    `;
    aiPanel.appendChild(aiPromptTextarea);

    // Generate button
    const generateBtn = iframeDoc.createElement('button');
    generateBtn.textContent = 'Generate with AI';
    generateBtn.style.cssText = `
      padding: 0.5rem 1rem;
      background: #ea8d28;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    `;
    let isGenerating = false;
    generateBtn.addEventListener('click', async () => {
      if (isGenerating) return;
      
      const prompt = aiPromptTextarea.value.trim();
      if (!prompt) {
        alert('Please enter a prompt');
        return;
      }

      isGenerating = true;
      generateBtn.textContent = 'Generating...';
      generateBtn.disabled = true;
      generateBtn.style.opacity = '0.6';
      generateBtn.style.cursor = 'not-allowed';

      try {
        // Use provided userId or request from parent
        let currentUserId = userId;
        if (!currentUserId && window.parent) {
          // Request userId from parent via postMessage
          const userIdPromise = new Promise((resolve) => {
            const handler = (event) => {
              if (event.data && event.data.type === 'USER_ID_RESPONSE') {
                window.removeEventListener('message', handler);
                resolve(event.data.userId);
              }
            };
            window.addEventListener('message', handler);
            window.parent.postMessage({ type: 'REQUEST_USER_ID' }, '*');
            // Timeout after 1 second
            setTimeout(() => {
              window.removeEventListener('message', handler);
              resolve(null);
            }, 1000);
          });
          currentUserId = await userIdPromise;
        }

        const response = await fetch('/api/webpage-editor/ai-edit-element', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            originalHTML: currentElement.outerHTML,
            userPrompt: prompt,
            promptType: promptTypeSelect.value,
            modelType: modelTypeSelect.value,
            userId: currentUserId,
          }),
        });

        const result = await response.json();

        if (result.success && result.html) {
          // Store the generated HTML
          previewDiv._generatedHTML = result.html;
          
          // Load HTML into preview iframe with CSS
          const previewIframe = previewDiv._previewIframe;
          if (previewIframe) {
            const previewDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
            
            // Get CSS links from main iframe
            const mainIframeDoc = iframeDoc;
            const cssLinks = Array.from(mainIframeDoc.querySelectorAll('link[rel="stylesheet"]'));
            
            // Write HTML structure to preview iframe
            previewDoc.open();
            previewDoc.write('<!DOCTYPE html><html><head></head><body></body></html>');
            previewDoc.close();
            
            // Load CSS into preview iframe
            let cssLoadCount = 0;
            const totalCssLinks = cssLinks.length;
            
            cssLinks.forEach(link => {
              const newLink = previewDoc.createElement('link');
              newLink.rel = 'stylesheet';
              newLink.href = link.href;
              
              // Track when CSS loads
              newLink.onload = () => {
                cssLoadCount++;
                if (cssLoadCount === totalCssLinks) {
                  // All CSS loaded, now inject HTML
                  previewDoc.body.innerHTML = result.html;
                  // Set iframe height based on content after a short delay
                  setTimeout(() => {
                    const contentHeight = Math.max(200, previewDoc.body.scrollHeight + 40);
                    previewIframe.style.height = contentHeight + 'px';
                  }, 50);
                }
              };
              
              newLink.onerror = () => {
                cssLoadCount++;
                // Continue even if some CSS fails to load
                if (cssLoadCount === totalCssLinks) {
                  previewDoc.body.innerHTML = result.html;
                  setTimeout(() => {
                    const contentHeight = Math.max(200, previewDoc.body.scrollHeight + 40);
                    previewIframe.style.height = contentHeight + 'px';
                  }, 50);
                }
              };
              
              previewDoc.head.appendChild(newLink);
            });
            
            // If no CSS links, inject HTML immediately
            if (totalCssLinks === 0) {
              previewDoc.body.innerHTML = result.html;
              setTimeout(() => {
                const contentHeight = Math.max(200, previewDoc.body.scrollHeight + 40);
                previewIframe.style.height = contentHeight + 'px';
              }, 50);
            }
          }
          
          // Show preview
          previewDiv.style.display = 'block';
          adoptBtn.style.display = 'block';
        } else {
          alert(result.error || 'Failed to generate HTML');
        }
      } catch (error) {
        console.error('AI generation error:', error);
        alert('Error generating HTML: ' + error.message);
      } finally {
        isGenerating = false;
        generateBtn.textContent = 'Generate with AI';
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
        generateBtn.style.cursor = 'pointer';
      }
    });
    aiPanel.appendChild(generateBtn);

    // Preview section
    const previewLabel = iframeDoc.createElement('label');
    previewLabel.textContent = 'Preview:';
    previewLabel.style.cssText = 'font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; display: block;';
    aiPanel.appendChild(previewLabel);

    // Create iframe for preview to properly render HTML with CSS
    const previewContainer = iframeDoc.createElement('div');
    previewContainer.style.cssText = `
      flex: 1;
      min-height: 6rem;
      max-height: 20rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      background: #f9fafb;
      overflow: hidden;
      margin-bottom: 0.75rem;
      display: none;
      position: relative;
    `;
    
    const previewIframe = iframeDoc.createElement('iframe');
    previewIframe.style.cssText = `
      width: 100%;
      height: 100%;
      min-height: 200px;
      border: none;
      background: white;
    `;
    // No sandbox restrictions - this is a preview only, already isolated within the main iframe
    previewContainer.appendChild(previewIframe);
    aiPanel.appendChild(previewContainer);
    
    // Store reference to preview iframe for later use
    const previewDiv = previewContainer; // Keep variable name for compatibility
    previewDiv._previewIframe = previewIframe;

    // Adopt changes button
    const adoptBtn = iframeDoc.createElement('button');
    adoptBtn.textContent = 'Adopt Changes';
    adoptBtn.style.cssText = `
      padding: 0.5rem 1rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      display: none;
    `;
    adoptBtn.addEventListener('click', () => {
      const generatedHTML = previewDiv._generatedHTML;
      if (generatedHTML) {
        // Update the textarea with the generated HTML
        textarea.value = generatedHTML;
        // Trigger input event to update the element
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        // Hide preview and button
        previewDiv.style.display = 'none';
        adoptBtn.style.display = 'none';
      }
    });
    aiPanel.appendChild(adoptBtn);

    rightPanelContainer.appendChild(aiPanel);
    content.appendChild(rightPanelContainer);

    modal.appendChild(content);
    wrapper.appendChild(modal);
    iframeDoc.body.appendChild(wrapper);

    return {
      element: wrapper,
      cleanup: () => {
        if (wrapper && wrapper.parentNode) {
          wrapper.remove();
        }
      },
    };
  } catch (error) {
    console.error('Error injecting Edit Element Modal:', error);
    return null;
  }
}
