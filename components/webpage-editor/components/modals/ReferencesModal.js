'use client';

/**
 * ReferencesModal - Shows Effects/Utilities content from new.html
 * This is a simplified version that displays the utilities content
 * In a real implementation, you might want to fetch this from new.html or store it separately
 */
export default function ReferencesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // For now, we'll show a message that this content should come from new.html
  // In production, you'd extract the utilities section HTML and display it here
  const utilitiesContent = `
    <div class="container">
      <h2>Effects / Utilities</h2>
      <p>This section contains utility classes for colors, spacing, sizing, alignment, and more.</p>
      <p>Please refer to the new.html file's "Effects / Utilities" tab (id="utilities") for the complete reference.</p>
      <p>The utilities section includes:</p>
      <ul>
        <li>Colors (text and background)</li>
        <li>Font Sizes</li>
        <li>List Styles</li>
        <li>Text Alignment</li>
        <li>Items Alignment</li>
        <li>Background Positions</li>
        <li>Font Style</li>
        <li>Spacing (padding and margin)</li>
        <li>Sizing (width and height)</li>
        <li>Tooltips</li>
        <li>Buttons</li>
      </ul>
      <p>To view the full reference, please open the new.html file in your browser and navigate to the "Effects / Utilities" tab.</p>
    </div>
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Effects / Utilities Reference</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div dangerouslySetInnerHTML={{ __html: utilitiesContent }} />
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> For the complete utilities reference with all examples and code snippets, 
              please refer to the new.html file's "Effects / Utilities" section (lines 2535-3447).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
