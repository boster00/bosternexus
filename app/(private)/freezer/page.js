'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/libs/api';
import { toast } from 'react-hot-toast';

export default function FreezerPage() {
  const [beginSku, setBeginSku] = useState('');
  const [endSku, setEndSku] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate SKU range and fetch items
  const handleGenerateRange = async () => {
    console.log('[Freezer] handleGenerateRange called', { beginSku, endSku });
    
    if (!beginSku || !endSku) {
      console.warn('[Freezer] Validation failed: missing SKUs', { beginSku, endSku });
      toast.error('Please enter both begin and end SKU');
      return;
    }

    if (beginSku > endSku) {
      console.warn('[Freezer] Validation failed: begin > end', { beginSku, endSku });
      toast.error('Begin SKU must be less than or equal to end SKU');
      return;
    }

    setLoading(true);
    try {
      // Query database for items where SKU is between beginSku and endSku
      console.log('[Freezer] Querying database for SKU range...', { beginSku, endSku });
      
      const requestPayload = { beginSku, endSku };
      console.log('[Freezer] Making API request', {
        endpoint: '/zoho/books/items/by-sku-range',
        beginSku,
        endSku,
        requestPreview: JSON.stringify(requestPayload).substring(0, 300)
      });
      
      const response = await apiClient.post('/zoho/books/items/by-sku-range', requestPayload);
      
      console.log('[Freezer] API response received', {
        success: response.success,
        hasItems: !!response.items,
        itemsCount: response.items?.length || 0,
        error: response.error,
        responsePreview: JSON.stringify(response).substring(0, 300)
      });

      if (response.success && response.items) {
        console.log('[Freezer] Processing response items', {
          itemsCount: response.items.length,
          firstItem: response.items[0],
          itemsPreview: JSON.stringify(response.items).substring(0, 300)
        });
        
        // Process items: treat N/A (null) as 0, calculate space to save
        const itemsWithData = response.items.map(item => {
          // Treat N/A (null) as 0 for calculations and display
          const reorderLevel = item.reorder_level ?? 0;
          const stockOnHand = item.stock_on_hand ?? 0;
          // Space to save is the higher of reorder_level and stock_on_hand
          const spaceToSave = Math.max(reorderLevel, stockOnHand);
          
          return {
            sku: item.sku,
            name: item.name || 'N/A',
            reorder_level: reorderLevel, // Show as 0 instead of null
            stock_on_hand: stockOnHand, // Show as 0 instead of null
            space_to_save: spaceToSave,
          };
        });

        // Filter out items where space_to_save is 0
        const filteredItems = itemsWithData.filter(item => item.space_to_save > 0);
        
        const removedCount = itemsWithData.length - filteredItems.length;
        console.log('[Freezer] Items processed and filtered', {
          totalItemsBeforeFilter: itemsWithData.length,
          totalItemsAfterFilter: filteredItems.length,
          removedCount,
          itemsWithDataPreview: JSON.stringify(filteredItems).substring(0, 300)
        });

        setItems(filteredItems);
        toast.success(`Found ${filteredItems.length} items in range${removedCount > 0 ? ` (${removedCount} items with space_to_save=0 removed)` : ''}`);
      } else {
        console.error('[Freezer] API response indicates failure', {
          success: response.success,
          error: response.error,
          hasItems: !!response.items
        });
        toast.error(response.error || 'Failed to fetch items');
        setItems([]);
      }
    } catch (error) {
      console.error('[Freezer] Error in handleGenerateRange', {
        errorMessage: error.message,
        errorStack: error.stack,
        errorPreview: JSON.stringify(error).substring(0, 300)
      });
      toast.error(`Error: ${error.message}`);
      setItems([]);
    } finally {
      setLoading(false);
      console.log('[Freezer] handleGenerateRange completed');
    }
  };

  // Generate labels array from items
  // Each SKU takes multiple labels based on space_to_save (each level = 3 spaces)
  const generateLabels = () => {
    if (!items || items.length === 0) return [];
    
    const labels = [];
    items.forEach(item => {
      // Calculate number of labels needed: each level = 3 spaces
      const labelsPerSku = Math.ceil(item.space_to_save / 3);
      
      // Add this SKU multiple times (one per label)
      for (let i = 0; i < labelsPerSku; i++) {
        labels.push({
          sku: item.sku,
          space_to_save: item.space_to_save,
          labelIndex: i + 1, // Which label this is for this SKU (1, 2, 3, etc.)
          totalLabels: labelsPerSku, // Total labels for this SKU
        });
      }
    });
    
    return labels;
  };

  // Arrange labels in grid: 11 columns per row, max 7 rows per page
  const arrangeLabelsInGrid = (labels) => {
    const LABELS_PER_ROW = 11;
    const ROWS_PER_PAGE = 7;
    const rows = [];
    
    for (let i = 0; i < labels.length; i += LABELS_PER_ROW) {
      const row = labels.slice(i, i + LABELS_PER_ROW);
      rows.push(row);
    }
    
    // Group rows into pages (7 rows per page)
    const pages = [];
    for (let i = 0; i < rows.length; i += ROWS_PER_PAGE) {
      const pageRows = rows.slice(i, i + ROWS_PER_PAGE);
      pages.push(pageRows);
    }
    
    return { rows, pages };
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate labels and arrange in grid
  const labels = generateLabels();
  const { rows: labelRows, pages: labelPages } = arrangeLabelsInGrid(labels);

  return (
    <>
      <div className="no-print min-h-screen bg-gray-100 p-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-extrabold">Freezer Label Printer</h1>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-colors"
            >
              Print Letter Size Paper
            </button>
          </div>

          {/* Two Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
            {/* Left Panel - Controls */}
            <div className="space-y-4">
              {/* SKU Range Input */}
              <div className="card card-border bg-base-100 p-6">
                <h2 className="text-xl font-bold mb-4">SKU Range</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Begin SKU</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="e.g., A001"
                      value={beginSku}
                      onChange={(e) => setBeginSku(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">End SKU</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="e.g., A100"
                      value={endSku}
                      onChange={(e) => setEndSku(e.target.value.toUpperCase())}
                    />
                  </div>
                  <button
                    className="btn btn-primary w-full"
                    onClick={handleGenerateRange}
                    disabled={loading || !beginSku || !endSku}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Loading...
                      </>
                    ) : (
                      'Generate SKU Range'
                    )}
                  </button>
                </div>
              </div>

              {/* Results Table */}
              {items.length > 0 && (
                <div className="card card-border bg-base-100 p-6">
                  <h2 className="text-xl font-bold mb-4">Reorder Levels</h2>
                  <div className="overflow-x-auto overflow-y-auto border border-gray-200 rounded-lg" style={{ maxHeight: '300px' }}>
                    <table className="table table-zebra w-full">
                      <thead className="sticky top-0 bg-base-100 z-10">
                        <tr>
                          <th>SKU</th>
                          <th>Name</th>
                          <th>Reorder Level</th>
                          <th>Stock On Hand</th>
                          <th>Space to Save</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td className="font-mono font-semibold">{item.sku}</td>
                            <td>{item.name}</td>
                            <td className="font-semibold">{item.reorder_level}</td>
                            <td>{item.stock_on_hand}</td>
                            <td className="font-semibold">{item.space_to_save}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Letter Size Paper Preview */}
            <div className="letter-paper-container">
              <div className="letter-paper">
                {/* Grid overlay */}
                <div className="grid-overlay"></div>
                
                {/* Content area */}
                <div className="paper-content">
                  {items.length > 0 ? (
                    <div className="label-grid">
                      {labelPages[0]?.map((row, rowIndex) => (
                        <div key={rowIndex} className="label-row">
                          {row.map((label, labelIndex) => (
                            <div key={`${rowIndex}-${labelIndex}`} className="label-cell">
                              <div className="label-content">
                                <div className="label-sku">{label.sku}</div>
                                <div className="label-keep">Keep {label.space_to_save}</div>
                              </div>
                            </div>
                          ))}
                          {/* Fill remaining cells in row if less than 11 */}
                          {Array.from({ length: 11 - row.length }).map((_, fillIndex) => (
                            <div key={`fill-${rowIndex}-${fillIndex}`} className="label-cell label-cell-empty"></div>
                          ))}
                        </div>
                      ))}
                      {labelPages.length > 1 && (
                        <div className="text-xs text-gray-400 mt-2 text-center">
                          + {labelPages.length - 1} more page{labelPages.length - 1 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Enter SKU range and click "Generate SKU Range" to view items
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only version - one page per 7 rows */}
      <div className="print-only">
        {items.length > 0 && labelPages.map((pageRows, pageIndex) => (
          <div key={pageIndex} className="letter-paper print-page">
            <div className="grid-overlay"></div>
            <div className="paper-content">
              <div className="label-grid">
                {pageRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="label-row">
                    {row.map((label, labelIndex) => (
                      <div key={`${rowIndex}-${labelIndex}`} className="label-cell">
                        <div className="label-content">
                          <div className="label-sku">{label.sku}</div>
                          <div className="label-keep">Keep {label.space_to_save}</div>
                        </div>
                      </div>
                    ))}
                    {/* Fill remaining cells in row if less than 11 */}
                    {Array.from({ length: 11 - row.length }).map((_, fillIndex) => (
                      <div key={`fill-${rowIndex}-${fillIndex}`} className="label-cell label-cell-empty"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
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
          /* Scale down to fit in 70% width panel while maintaining aspect ratio */
          max-width: 100%;
          aspect-ratio: 8.5 / 11;
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
        }

        /* Label grid layout */
        .label-grid {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .label-row {
          display: flex;
          width: 100%;
          height: 33mm; /* 1.5 inch = 38.1mm, but using 33mm as specified */
          border-bottom: 1px solid #ccc;
        }

        .label-cell {
          width: 16mm;
          height: 100%;
          border-right: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-sizing: border-box;
        }

        .label-cell-empty {
          background: transparent;
        }

        .label-content {
          transform: rotate(90deg);
          transform-origin: center;
          white-space: nowrap;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 33mm; /* Height of row becomes width when rotated */
          height: 16mm; /* Width of cell becomes height when rotated */
        }

        .label-sku {
          font-size: 18px;
          font-weight: bold;
          font-family: monospace;
          margin-bottom: 2px;
        }

        .label-keep {
          font-size: 10px;
          color: #666;
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

          /* Hide navigation bar, screen-only content, and toast notifications */
          .no-print-nav,
          nav,
          .no-print,
          [data-sonner-toast],
          [data-sonner-toaster],
          .react-hot-toast,
          [class*="toast"],
          [id*="toast"] {
            display: none !important;
            visibility: hidden !important;
          }

          /* Ensure body and html have no margins/padding for print */
          body,
          html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
          }

          /* Hide the main container background but keep structure */
          .min-h-screen.bg-gray-100 {
            background: white !important;
            padding: 0 !important;
          }

          /* Show print-only content */
          .print-only {
            display: block !important;
            margin: 0;
            padding: 0;
            background: white;
          }

          .print-only .print-page {
            width: 8.5in !important;
            height: 11in !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }

          .print-only .print-page:last-child {
            page-break-after: auto !important;
          }

          .grid-overlay {
            background-image: 
              linear-gradient(to right, #000 0.2px, transparent 0.2px),
              linear-gradient(to bottom, #000 0.2px, transparent 0.2px) !important;
            background-size: 1mm 1mm !important;
          }

          .label-row {
            height: 33mm !important;
            page-break-inside: avoid !important;
          }

          .label-cell {
            width: 16mm !important;
            height: 33mm !important;
          }

          .label-content {
            width: 33mm !important;
            height: 16mm !important;
          }

          .label-keep {
            font-size: 10px !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          .label-sku {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </>
  );
}
