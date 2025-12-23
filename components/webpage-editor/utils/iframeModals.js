/**
 * Iframe Modal Injector
 * Injects modals directly into the iframe so they can use the iframe's CSS
 * All modals are wrapped in a div with id "do-not-include" which gets stripped on save/copy
 */

import { sections, getSectionsByCategory, getSectionCategories } from '../components/sections';
import { elements, getElementsByCategory, getElementCategories } from '../components/elements';

/**
 * Inject Add Section Modal into iframe
 */
export function injectAddSectionModal(iframeRef, onSelect, onClose) {
  if (!iframeRef?.current) return null;

  try {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return null;

    // Remove existing modal
    const existingModal = iframeDoc.getElementById('do-not-include');
    if (existingModal) {
      existingModal.remove();
    }

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
      max-width: 1280px;
      height: 90vh;
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
    const title = iframeDoc.createElement('h2');
    title.textContent = 'Add New Section';
    title.style.cssText = 'font-size: 1.5rem; font-weight: bold; margin: 0;';
    header.appendChild(title);

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

    // Content area
    const content = iframeDoc.createElement('div');
    content.style.cssText = `
      flex: 1;
      display: flex;
      overflow: hidden;
    `;

    // Left panel - category tabs
    const leftPanel = iframeDoc.createElement('div');
    leftPanel.style.cssText = `
      width: 256px;
      border-right: 1px solid #e5e7eb;
      overflow-y: auto;
      background: #f9fafb;
      padding: 1rem;
    `;
    const categoriesTitle = iframeDoc.createElement('h3');
    categoriesTitle.textContent = 'Sections';
    categoriesTitle.style.cssText = 'font-weight: 600; margin-bottom: 0.75rem;';
    leftPanel.appendChild(categoriesTitle);

    const categories = getSectionCategories();
    const sectionsByCategory = getSectionsByCategory();
    let selectedCategory = categories[0] || '';

    const categoryList = iframeDoc.createElement('ul');
    categoryList.style.cssText = 'list-style: none; padding: 0; margin: 0;';
    categories.forEach((category) => {
      const li = iframeDoc.createElement('li');
      const link = iframeDoc.createElement('a');
      link.textContent = category;
      link.href = '#';
      link.style.cssText = `
        display: block;
        padding: 0.5rem;
        border-radius: 0.25rem;
        text-decoration: none;
        color: #374151;
        cursor: pointer;
      `;
      if (category === selectedCategory) {
        link.style.backgroundColor = '#e5e7eb';
        link.style.fontWeight = '600';
      }
      link.addEventListener('mouseenter', () => {
        if (category !== selectedCategory) {
          link.style.backgroundColor = '#e5e7eb';
        }
      });
      link.addEventListener('mouseleave', () => {
        if (category !== selectedCategory) {
          link.style.backgroundColor = 'transparent';
        }
      });
      link.addEventListener('click', (e) => {
        e.preventDefault();
        selectedCategory = category;
        // Update active state
        categoryList.querySelectorAll('a').forEach(a => {
          a.style.backgroundColor = 'transparent';
          a.style.fontWeight = 'normal';
        });
        link.style.backgroundColor = '#e5e7eb';
        link.style.fontWeight = '600';
        // Scroll to category in right panel
        const categoryDiv = rightPanel.querySelector(`[data-category="${category}"]`);
        if (categoryDiv) {
          categoryDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      li.appendChild(link);
      categoryList.appendChild(li);
    });
    leftPanel.appendChild(categoryList);
    content.appendChild(leftPanel);

    // Right panel - section content
    const rightPanel = iframeDoc.createElement('div');
    rightPanel.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    `;

    categories.forEach((category) => {
      const categoryDiv = iframeDoc.createElement('div');
      categoryDiv.setAttribute('data-category', category);
      categoryDiv.style.cssText = 'margin-bottom: 2rem;';
      
      const categoryTitle = iframeDoc.createElement('h2');
      categoryTitle.textContent = category;
      categoryTitle.style.cssText = 'font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;';
      categoryDiv.appendChild(categoryTitle);

      const sectionsList = iframeDoc.createElement('div');
      sectionsList.style.cssText = 'display: flex; flex-direction: column; gap: 1.5rem;';
      
      sectionsByCategory[category]?.forEach((section, index) => {
        const sectionCard = iframeDoc.createElement('div');
        sectionCard.style.cssText = `
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          transition: border-color 0.2s;
        `;
        sectionCard.addEventListener('mouseenter', () => {
          sectionCard.style.borderColor = '#ea8d28';
        });
        sectionCard.addEventListener('mouseleave', () => {
          sectionCard.style.borderColor = '#e5e7eb';
        });

        const sectionHeader = iframeDoc.createElement('div');
        sectionHeader.style.cssText = 'margin-bottom: 0.75rem;';
        const sectionName = iframeDoc.createElement('h3');
        sectionName.textContent = section.name;
        sectionName.style.cssText = 'font-weight: 600; font-size: 1.125rem; margin-bottom: 0.5rem;';
        sectionHeader.appendChild(sectionName);

        const useBtn = iframeDoc.createElement('button');
        useBtn.textContent = 'Use This Section';
        useBtn.style.cssText = `
          padding: 0.5rem 1rem;
          background: #ea8d28;
          color: white;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.875rem;
        `;
        useBtn.addEventListener('mouseenter', () => {
          useBtn.style.opacity = '0.9';
        });
        useBtn.addEventListener('mouseleave', () => {
          useBtn.style.opacity = '1';
        });
        useBtn.addEventListener('click', () => {
          const sectionKey = Object.keys(sections).find(key => sections[key] === section);
          if (sectionKey && onSelect) {
            onSelect(sectionKey);
          }
          wrapper.remove();
        });
        sectionHeader.appendChild(useBtn);
        sectionCard.appendChild(sectionHeader);

        const preview = iframeDoc.createElement('div');
        preview.style.cssText = 'border-top: 1px solid #e5e7eb; padding-top: 0.75rem; margin-top: 0.75rem;';
        preview.innerHTML = section.html;
        sectionCard.appendChild(preview);

        sectionsList.appendChild(sectionCard);
      });

      categoryDiv.appendChild(sectionsList);
      rightPanel.appendChild(categoryDiv);
    });

    content.appendChild(rightPanel);
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
    console.error('Error injecting Add Section Modal:', error);
    return null;
  }
}

/**
 * Inject Add Element Modal into iframe
 */
export function injectAddElementModal(iframeRef, onSelect, onPasteHTML, onClose) {
  if (!iframeRef?.current) return null;

  try {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return null;

    // Remove existing modal
    const existingModal = iframeDoc.getElementById('do-not-include');
    if (existingModal) {
      existingModal.remove();
    }

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
      max-width: 1024px;
      max-height: 80vh;
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
    const title = iframeDoc.createElement('h2');
    title.textContent = 'Add New Element';
    title.style.cssText = 'font-size: 1.5rem; font-weight: bold; margin: 0;';
    header.appendChild(title);

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

    // Content area
    const content = iframeDoc.createElement('div');
    content.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    `;

    // Paste HTML option
    const pasteSection = iframeDoc.createElement('div');
    pasteSection.style.cssText = `
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    `;
    const pasteTitle = iframeDoc.createElement('h3');
    pasteTitle.textContent = 'Paste Custom HTML';
    pasteTitle.style.cssText = 'font-weight: 600; margin-bottom: 0.5rem;';
    pasteSection.appendChild(pasteTitle);

    const textarea = iframeDoc.createElement('textarea');
    textarea.style.cssText = `
      width: 100%;
      height: 6rem;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      resize: vertical;
    `;
    textarea.placeholder = 'Paste your HTML here...';
    pasteSection.appendChild(textarea);

    const insertBtn = iframeDoc.createElement('button');
    insertBtn.textContent = 'Insert HTML';
    insertBtn.style.cssText = `
      padding: 0.5rem 1rem;
      background: #ea8d28;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
    `;
    insertBtn.addEventListener('mouseenter', () => {
      insertBtn.style.opacity = '0.9';
    });
    insertBtn.addEventListener('mouseleave', () => {
      insertBtn.style.opacity = '1';
    });
    insertBtn.addEventListener('click', () => {
      const html = textarea.value.trim();
      if (html && onPasteHTML) {
        onPasteHTML(html);
        wrapper.remove();
      }
    });
    pasteSection.appendChild(insertBtn);
    content.appendChild(pasteSection);

    // Divider
    const divider = iframeDoc.createElement('div');
    divider.textContent = 'OR';
    divider.style.cssText = `
      text-align: center;
      margin: 1.5rem 0;
      color: #6b7280;
      font-weight: 600;
    `;
    content.appendChild(divider);

    // Elements by category
    const elementsByCategory = getElementsByCategory();
    const elementCategories = getElementCategories();

    elementCategories.forEach((category) => {
      const categoryDiv = iframeDoc.createElement('div');
      categoryDiv.style.cssText = 'margin-bottom: 1.5rem;';
      
      const categoryTitle = iframeDoc.createElement('h3');
      categoryTitle.textContent = category;
      categoryTitle.style.cssText = 'font-weight: 600; font-size: 1.125rem; margin-bottom: 0.75rem;';
      categoryDiv.appendChild(categoryTitle);

      const elementsGrid = iframeDoc.createElement('div');
      elementsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      `;

      elementsByCategory[category]?.forEach((element, index) => {
        const elementCard = iframeDoc.createElement('div');
        elementCard.style.cssText = `
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          transition: border-color 0.2s;
        `;
        elementCard.addEventListener('mouseenter', () => {
          elementCard.style.borderColor = '#ea8d28';
        });
        elementCard.addEventListener('mouseleave', () => {
          elementCard.style.borderColor = '#e5e7eb';
        });

        const elementName = iframeDoc.createElement('h4');
        elementName.textContent = element.name;
        elementName.style.cssText = 'font-weight: 500; margin-bottom: 0.5rem;';
        elementCard.appendChild(elementName);

        const preview = iframeDoc.createElement('div');
        preview.style.cssText = 'border-top: 1px solid #e5e7eb; padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.875rem;';
        preview.innerHTML = element.html;
        elementCard.appendChild(preview);

        const useBtn = iframeDoc.createElement('button');
        useBtn.textContent = 'Use This Element';
        useBtn.style.cssText = `
          width: 100%;
          margin-top: 0.75rem;
          padding: 0.5rem;
          background: #ea8d28;
          color: white;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.875rem;
        `;
        useBtn.addEventListener('mouseenter', () => {
          useBtn.style.opacity = '0.9';
        });
        useBtn.addEventListener('mouseleave', () => {
          useBtn.style.opacity = '1';
        });
        useBtn.addEventListener('click', () => {
          const elementKey = Object.keys(elements).find(key => elements[key] === element);
          if (elementKey && onSelect) {
            onSelect(elementKey);
          }
          wrapper.remove();
        });
        elementCard.appendChild(useBtn);

        elementsGrid.appendChild(elementCard);
      });

      categoryDiv.appendChild(elementsGrid);
      content.appendChild(categoryDiv);
    });

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
    console.error('Error injecting Add Element Modal:', error);
    return null;
  }
}
