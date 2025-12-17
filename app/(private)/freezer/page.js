'use client';

export default function FreezerPage() {
  const handlePrint = () => {
    window.print();
  };

  // Define print elements with exact millimeter positioning
  // Each element can specify: x, y (position in mm), width, height (size in mm), 
  // text (content), orientation ('horizontal' or 'vertical')
  const printElements = [
    {
      id: 'example-1',
      x: 10, // 10mm from left
      y: 10, // 10mm from top
      width: 50, // 50mm wide
      height: 20, // 20mm tall
      text: 'Horizontal Text Example',
      orientation: 'horizontal',
      fontSize: 12, // font size in points
    },
    {
      id: 'example-2',
      x: 70, // 70mm from left
      y: 10, // 10mm from top
      width: 20, // 20mm wide (becomes height for vertical text)
      height: 50, // 50mm tall (becomes width for vertical text)
      text: 'Vertical Text Example',
      orientation: 'vertical',
      fontSize: 12,
    },
    {
      id: 'example-3',
      x: 10, // 10mm from left
      y: 40, // 40mm from top
      width: 80, // 80mm wide
      height: 15, // 15mm tall
      text: 'Another Horizontal Text',
      orientation: 'horizontal',
      fontSize: 10,
    },
  ];

  // Render a print element with millimeter-based positioning
  const renderPrintElement = (element) => {
    const style = {
      position: 'absolute',
      left: `${element.x}mm`,
      top: `${element.y}mm`,
      width: element.orientation === 'vertical' ? `${element.height}mm` : `${element.width}mm`,
      height: element.orientation === 'vertical' ? `${element.width}mm` : `${element.height}mm`,
      fontSize: `${element.fontSize || 12}pt`,
      ...(element.orientation === 'vertical' ? {
        transform: 'rotate(90deg)',
        transformOrigin: 'center',
      } : {}),
    };

    return (
      <div
        key={element.id}
        className="print-element"
        style={style}
      >
        {element.text}
      </div>
    );
  };

  return (
    <>
      <div className="no-print min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Freezer Label Printer</h1>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-colors"
            >
              Print Letter Size Paper
            </button>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">How to Define Print Elements</h2>
            <p className="text-sm text-gray-700 mb-2">
              Print elements are defined in the <code className="bg-gray-100 px-1 rounded">printElements</code> array with the following properties:
            </p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li><strong>x, y:</strong> Position in millimeters from top-left corner (0, 0)</li>
              <li><strong>width, height:</strong> Size in millimeters</li>
              <li><strong>text:</strong> The text content to display</li>
              <li><strong>orientation:</strong> 'horizontal' or 'vertical' (controls text direction)</li>
              <li><strong>fontSize:</strong> Font size in points (optional, defaults to 12pt)</li>
            </ul>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Note:</strong> For vertical text, width and height are swapped automatically to accommodate the rotated text direction.
            </p>
          </div>

          {/* Letter Size Paper Container - Preview */}
          <div className="letter-paper-container">
            <div className="letter-paper">
              {/* Grid overlay */}
              <div className="grid-overlay"></div>
              
              {/* Content area with print elements */}
              <div className="paper-content">
                {printElements.map(renderPrintElement)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only version */}
      <div className="print-only">
        <div className="letter-paper">
          <div className="grid-overlay"></div>
          <div className="paper-content">
            {printElements.map(renderPrintElement)}
          </div>
        </div>
      </div>

      <style>{`
        /* Letter size: 8.5" × 11" = 21.59cm × 27.94cm = 215.9mm × 279.4mm */
        /* 1mm grid spacing for precise positioning */
        
        .no-print {
          /* Screen styles */
        }

        .print-only {
          display: none;
        }

        .letter-paper-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 20px;
          background: #f0f0f0;
        }

        .letter-paper {
          width: 8.5in;
          height: 11in;
          background: white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
          position: relative;
          margin: 0 auto;
          overflow: hidden;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(to right, #d0d0d0 0.5px, transparent 0.5px),
            linear-gradient(to bottom, #d0d0d0 0.5px, transparent 0.5px);
          background-size: 1mm 1mm;
          pointer-events: none;
          z-index: 1;
        }

        .paper-content {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          padding: 0;
          /* No padding to allow absolute positioning from true top-left (0mm, 0mm) */
        }

        .print-element {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
          word-wrap: break-word;
          overflow: hidden;
        }

        /* Print styles - exact letter size */
        @media print {
          @page {
            size: letter;
            margin: 0;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Hide screen-only content */
          .no-print {
            display: none !important;
          }

          /* Show print-only content */
          .print-only {
            display: block !important;
            width: 8.5in;
            height: 11in;
            margin: 0;
            padding: 0;
            background: white;
          }

          .print-only .letter-paper {
            width: 8.5in !important;
            height: 11in !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }

          .grid-overlay {
            background-image: 
              linear-gradient(to right, #000 0.2px, transparent 0.2px),
              linear-gradient(to bottom, #000 0.2px, transparent 0.2px) !important;
            background-size: 1mm 1mm !important;
          }

          /* Hide borders on print elements when printing */
          .print-element {
            border: none !important;
          }

          /* Ensure transforms (rotations) work correctly in print */
          .print-element {
            transform: inherit !important;
            transform-origin: inherit !important;
          }
        }
      `}</style>
    </>
  );
}
