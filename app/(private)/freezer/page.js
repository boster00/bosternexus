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

        console.log('[Freezer] Items processed', {
          totalItems: itemsWithData.length,
          itemsWithDataPreview: JSON.stringify(itemsWithData).substring(0, 300)
        });

        setItems(itemsWithData);
        toast.success(`Found ${response.items.length} items in range`);
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

  const handlePrint = () => {
    window.print();
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
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
                <div className="paper-content p-4">
                  {items.length > 0 ? (
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold mb-4">SKU Range: {beginSku} - {endSku}</h2>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-1">SKU</th>
                            <th className="text-left p-1">Space to Save</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-1 font-mono">{item.sku}</td>
                              <td className="p-1 font-semibold">{item.space_to_save}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

      {/* Print-only version */}
      <div className="print-only">
        <div className="letter-paper">
          <div className="grid-overlay"></div>
          <div className="paper-content p-4">
            {items.length > 0 ? (
              <div className="space-y-2">
                <h2 className="text-lg font-bold mb-4">SKU Range: {beginSku} - {endSku}</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-1">SKU</th>
                      <th className="text-left p-1">Space to Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-1 font-mono">{item.sku}</td>
                        <td className="p-1 font-semibold">{item.space_to_save}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No items to display
              </div>
            )}
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
        }
      `}</style>
    </>
  );
}
