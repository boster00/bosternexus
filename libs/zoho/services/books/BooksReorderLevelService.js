/**
 * BooksReorderLevelService
 * 
 * Service for calculating reorder levels for Zoho Books items
 * based on sales order line items within a look-back window.
 * 
 * Workflow:
 * 1. Get all line items from sales orders within look-back window (join query)
 * 2. Remove outliers (qty > 5)
 * 3. Calculate expected sales in inventory turnover period
 * 4. Calculate reorder_level (rounded)
 * 5. Update zoho_books_items table
 */

import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { Logger } from '@/libs/utils/logger';
import { BooksItemEntity } from '@/libs/zoho/entities/books';

export class BooksReorderLevelService {
  constructor() {
    this.dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false,
      autoTimestamps: true,
    });
  }

  /**
   * Calculate and update reorder levels for items based on sales order history
   * 
   * @param {number} lookBackDays - Days to look back (default: 180)
   * @param {number} inventoryTurnoverDays - Target inventory turnover period in days (default: 90)
   * @param {string} userId - User ID (optional, for logging)
   * @returns {Promise<object>} Result with updated items count and errors
   */
  async calculateAndUpdateReorderLevels(lookBackDays = 180, inventoryTurnoverDays = 90, userId = null) {
    Logger.info('Starting reorder level calculation', {
      lookBackDays,
      inventoryTurnoverDays,
    });

    const errors = [];
    let updatedCount = 0;

    try {
      // Step 1: Get all line items from sales orders within look-back window
      const lineItems = await this.getSalesOrderLineItems(lookBackDays);

      if (lineItems.length === 0) {
        Logger.info('No line items found in look-back window', { lookBackDays });
        return {
          updated: 0,
          errors: [],
          summary: 'No sales order line items found in the specified look-back period.',
        };
      }

      Logger.info(`Found ${lineItems.length} line items from sales orders`, {
        lookBackDays,
        lineItemCount: lineItems.length,
      });

      // Step 2: Remove outliers (qty > 5)
      const filteredItems = lineItems.filter(item => {
        const qty = item.quantity ? Number(item.quantity) : 0;
        return qty <= 5;
      });

      Logger.info(`Filtered outliers (qty > 5)`, {
        originalCount: lineItems.length,
        filteredCount: filteredItems.length,
        removed: lineItems.length - filteredItems.length,
      });

      if (filteredItems.length === 0) {
        Logger.info('All items were outliers (qty > 5)', {});
        return {
          updated: 0,
          errors: [],
          summary: 'All line items had quantity > 5 and were filtered out.',
        };
      }

      // Step 3: Calculate reorder levels by SKU
      const reorderLevels = this.calculateReorderLevels(
        filteredItems,
        lookBackDays,
        inventoryTurnoverDays
      );

      Logger.info(`Calculated reorder levels for ${Object.keys(reorderLevels).length} SKUs`, {
        skuCount: Object.keys(reorderLevels).length,
      });

      // Step 4: Update zoho_books_items table
      const updateResults = await this.updateItemsTable(reorderLevels);

      updatedCount = updateResults.updated;
      errors.push(...(updateResults.errors || []));

      Logger.info('Reorder level calculation completed', {
        updatedCount,
        errorCount: errors.length,
        detailsCount: updateResults.details?.length || 0,
      });

      return {
        updated: updatedCount,
        errors,
        itemDetails: updateResults.details || [],
        summary: `Updated reorder levels for ${updatedCount} items. ${errors.length} errors occurred.`,
        details: {
          lookBackDays,
          inventoryTurnoverDays,
          totalLineItems: lineItems.length,
          filteredLineItems: filteredItems.length,
          skusProcessed: Object.keys(reorderLevels).length,
          itemsCreated: (updateResults.details || []).filter(d => d.action === 'created').length,
          itemsUpdated: (updateResults.details || []).filter(d => d.action === 'updated').length,
        },
      };

    } catch (error) {
      Logger.error('Error calculating reorder levels', error, {
        lookBackDays,
        inventoryTurnoverDays,
      });
      throw error;
    }
  }

  /**
   * Step 3.1: Get sample sales orders and their line items (for testing)
   * Gets 5 most recent sales orders with their line items
   * 
   * @param {number} limit - Number of sales orders to fetch (default: 5)
   * @returns {Promise<object>} Result with sales orders, line items, and detailed logs
   */
  async getSampleSalesOrdersAndLineItems(limit = 5) {
    Logger.info('Step 3.1: Getting sample sales orders and line items', { limit });

    const logs = [];
    const result = {
      salesOrders: [],
      lineItems: [],
      summary: {},
    };

    try {
      // Get most recent sales orders
      logs.push(`Fetching ${limit} most recent sales orders...`);
      const { data: salesOrders, error: soError } = await this.dal.select(
        'zoho_books_salesorders',
        {
          queryBuilder: (query) => {
            return query
              .select('id, zoho_id, salesorder_number, date, customer_name, total')
              .order('date', { ascending: false })
              .limit(limit);
          },
        }
      );

      if (soError) {
        throw new Error(`Failed to fetch sales orders: ${soError.message}`);
      }

      if (!salesOrders || salesOrders.length === 0) {
        logs.push('No sales orders found in database');
        return {
          success: true,
          salesOrders: [],
          lineItems: [],
          summary: { salesOrderCount: 0, lineItemCount: 0 },
          logs,
        };
      }

      logs.push(`Found ${salesOrders.length} sales orders`);
      result.salesOrders = salesOrders;

      // Get line items for these sales orders
      const salesOrderIds = salesOrders.map(so => so.id).filter(Boolean);
      logs.push(`Fetching line items for ${salesOrderIds.length} sales orders...`);

      const { data: lineItems, error: liError } = await this.dal.select(
        'zoho_books_line_items',
        {
          columns: 'id, parent_id, parent_type, zoho_id, item_id, sku, name, description, quantity, rate, total',
          queryBuilder: (query) => {
            return query
              .in('parent_id', salesOrderIds)
              .eq('parent_type', 'salesorder')
              .order('parent_id', { ascending: true });
          },
        }
      );

      if (liError) {
        throw new Error(`Failed to fetch line items: ${liError.message}`);
      }

      const lineItemsArray = lineItems || [];
      logs.push(`Found ${lineItemsArray.length} line items`);

      // Enrich line items with sales order info
      const salesOrderMap = new Map(salesOrders.map(so => [so.id, so]));
      result.lineItems = lineItemsArray.map(item => ({
        ...item,
        sales_order_number: salesOrderMap.get(item.parent_id)?.salesorder_number || null,
        sales_order_date: salesOrderMap.get(item.parent_id)?.date || null,
        sales_order_customer: salesOrderMap.get(item.parent_id)?.customer_name || null,
      }));

      // Summary
      result.summary = {
        salesOrderCount: salesOrders.length,
        lineItemCount: lineItemsArray.length,
        uniqueItems: new Set(lineItemsArray.map(li => li.sku || li.item_id).filter(Boolean)).size,
        totalQuantity: lineItemsArray.reduce((sum, li) => sum + (Number(li.quantity) || 0), 0),
      };

      logs.push(`Summary: ${result.summary.salesOrderCount} sales orders, ${result.summary.lineItemCount} line items, ${result.summary.uniqueItems} unique items, ${result.summary.totalQuantity} total quantity`);

      return {
        success: true,
        salesOrders: result.salesOrders,
        lineItems: result.lineItems,
        summary: result.summary,
        logs,
      };

    } catch (error) {
      Logger.error('Error in Step 3.1: Get sample sales orders and line items', error);
      logs.push(`ERROR: ${error.message}`);
      return {
        success: false,
        error: error.message,
        salesOrders: result.salesOrders,
        lineItems: result.lineItems,
        summary: result.summary,
        logs,
      };
    }
  }

  /**
   * Step 3.2: Summarize line items into items array with sum qty
   * Groups line items by SKU/item_id and sums quantities
   * 
   * @param {Array} lineItems - Array of line items from Step 3.1
   * @param {number} maxQuantity - Maximum quantity to include (filters outliers, default: 5)
   * @returns {Promise<object>} Result with summarized items array and detailed logs
   */
  async summarizeLineItemsIntoItems(lineItems = [], maxQuantity = 5, lookBackDays = 180, inventoryTurnoverDays = 90) {
    Logger.info('Step 3.2: Summarizing line items into items array and calculating reorder levels', {
      lineItemCount: lineItems.length,
      maxQuantity,
      lookBackDays,
      inventoryTurnoverDays,
    });

    const logs = [];
    const result = {
      items: [],
      summary: {},
    };

    try {
      if (!Array.isArray(lineItems) || lineItems.length === 0) {
        logs.push('No line items provided');
        return {
          success: false,
          error: 'No line items provided',
          items: [],
          summary: {},
          logs,
        };
      }

      logs.push(`Processing ${lineItems.length} line items...`);

      // Filter outliers (qty > maxQuantity)
      const filteredItems = lineItems.filter(item => {
        const qty = item.quantity ? Number(item.quantity) : 0;
        return qty <= maxQuantity;
      });

      const outlierCount = lineItems.length - filteredItems.length;
      logs.push(`Filtered ${outlierCount} outliers (qty > ${maxQuantity}). ${filteredItems.length} items remaining.`);

      // Group by SKU (or item_id if SKU is missing)
      const itemsMap = new Map();

      for (const item of filteredItems) {
        const key = item.sku || item.item_id || `item_${item.item_id}`;
        
        if (!itemsMap.has(key)) {
          itemsMap.set(key, {
            sku: item.sku || null,
            item_id: item.item_id || null,
            name: item.name || 'N/A',
            description: item.description || null,
            rate: item.rate ? Number(item.rate) : null,
            total: 0,
            quantity: 0,
            lineItemCount: 0,
            firstInstance: item, // Keep first instance for other fields
          });
        }

        const summary = itemsMap.get(key);
        const qty = item.quantity ? Number(item.quantity) : 0;
        const total = item.total ? Number(item.total) : 0;

        summary.quantity += qty;
        summary.total += total;
        summary.lineItemCount += 1;

        // Update name/description if missing
        if (!summary.name && item.name) {
          summary.name = item.name;
        }
        if (!summary.description && item.description) {
          summary.description = item.description;
        }
        if (!summary.rate && item.rate) {
          summary.rate = Number(item.rate);
        }
      }

      // Convert map to array
      result.items = Array.from(itemsMap.values());
      logs.push(`Summarized into ${result.items.length} unique items`);

      // Calculate reorder levels for each item
      logs.push(`Calculating reorder levels (lookBackDays: ${lookBackDays}, inventoryTurnoverDays: ${inventoryTurnoverDays})...`);
      
      for (const item of result.items) {
        // Expected sales in inventory turnover period
        // Formula: (total sales in lookBackDays / lookBackDays) * inventoryTurnoverDays
        const dailyAverage = item.quantity / lookBackDays;
        const expectedSales = dailyAverage * inventoryTurnoverDays;
        
        // Round: < 1.5 = 1, >= 1.5 = 2
        const reorderLevel = expectedSales < 1.5 ? 1 : Math.round(expectedSales);
        
        // Add calculated reorder level to item
        item.calculated_reorder_level = reorderLevel;
        item.calculation_details = {
          totalQuantity: item.quantity,
          lookBackDays,
          inventoryTurnoverDays,
          dailyAverage: dailyAverage.toFixed(2),
          expectedSales: expectedSales.toFixed(2),
        };
      }

      logs.push(`Calculated reorder levels for ${result.items.length} items`);

      // Summary statistics
      result.summary = {
        inputLineItemCount: lineItems.length,
        filteredLineItemCount: filteredItems.length,
        outlierCount,
        uniqueItemCount: result.items.length,
        totalQuantity: result.items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: result.items.reduce((sum, item) => sum + item.total, 0),
        lookBackDays,
        inventoryTurnoverDays,
        itemsWithReorderLevel: result.items.filter(item => item.calculated_reorder_level !== undefined).length,
      };

      logs.push(`Summary: ${result.summary.uniqueItemCount} unique items, ${result.summary.totalQuantity} total quantity, ${result.summary.totalValue.toFixed(2)} total value`);
      logs.push(`Reorder levels calculated: ${result.summary.itemsWithReorderLevel} items`);

      return {
        success: true,
        items: result.items,
        summary: result.summary,
        logs,
      };

    } catch (error) {
      Logger.error('Error in Step 3.2: Summarize line items', error);
      logs.push(`ERROR: ${error.message}`);
      return {
        success: false,
        error: error.message,
        items: result.items,
        summary: result.summary,
        logs,
      };
    }
  }

  /**
   * Step 3.3: Upload items array with sum qty into database
   * Updates zoho_books_items table with the summarized items
   * 
   * @param {Array} items - Array of summarized items from Step 3.2
   * @returns {Promise<object>} Result with update count and detailed logs
   */
  async uploadItemsToDatabase(items = []) {
    Logger.info('Step 3.3: Uploading items to database', {
      itemCount: items.length,
    });

    const logs = [];
    const result = {
      updated: 0,
      errors: [],
      details: [],
    };

    try {
      if (!Array.isArray(items) || items.length === 0) {
        logs.push('No items provided');
        return {
          success: false,
          error: 'No items provided',
          updated: 0,
          errors: [],
          details: [],
          logs,
        };
      }

      logs.push(`Processing ${items.length} items for database update...`);

      // Get existing items by SKU or item_id
      const skus = items.map(item => item.sku).filter(Boolean);
      const itemIds = items.map(item => item.item_id).filter(Boolean);

      logs.push(`Looking up ${skus.length} items by SKU and ${itemIds.length} items by item_id...`);

      const allExistingItems = [];

      // Query by SKU
      if (skus.length > 0) {
        const { data: itemsBySku, error: skuError } = await this.dal.select(
          'zoho_books_items',
          {
            queryBuilder: (query) => {
              return query
                .select('id, zoho_id, sku, name, reorder_level, stock_on_hand')
                .in('sku', skus);
            },
          }
        );

        if (skuError) {
          logs.push(`Warning: Error fetching items by SKU: ${skuError.message}`);
        } else if (itemsBySku) {
          allExistingItems.push(...itemsBySku);
        }
      }

      // Query by zoho_id (item_id from Zoho)
      if (itemIds.length > 0) {
        const { data: itemsById, error: idError } = await this.dal.select(
          'zoho_books_items',
          {
            queryBuilder: (query) => {
              return query
                .select('id, zoho_id, sku, name, reorder_level, stock_on_hand')
                .in('zoho_id', itemIds);
            },
          }
        );

        if (idError) {
          logs.push(`Warning: Error fetching items by zoho_id: ${idError.message}`);
        } else if (itemsById) {
          allExistingItems.push(...itemsById);
        }
      }

      // Create maps for lookup
      const itemsBySku = new Map();
      const itemsByItemId = new Map();

      const uniqueItems = new Map();
      allExistingItems.forEach(item => {
        if (!uniqueItems.has(item.id)) {
          uniqueItems.set(item.id, item);
        }
      });

      uniqueItems.forEach(item => {
        if (item.sku) {
          itemsBySku.set(item.sku, item);
        }
        if (item.zoho_id) {
          itemsByItemId.set(item.zoho_id, item);
        }
      });

      logs.push(`Found ${uniqueItems.size} existing items in database`);

      // Process each item
      logs.push(`Starting to process ${items.length} items...`);
      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        try {
          logs.push(`Processing item ${idx + 1}/${items.length}: SKU=${item.sku || 'N/A'}, item_id=${item.item_id || 'N/A'}, name=${item.name || 'N/A'}`);
          
          // Find existing item - prioritize SKU lookup
          let existingItem = null;
          let lookupMethod = null;
          
          if (item.sku) {
            existingItem = itemsBySku.get(item.sku);
            lookupMethod = 'SKU';
            logs.push(`  Looked up by SKU "${item.sku}": ${existingItem ? 'FOUND' : 'NOT FOUND'}`);
          }
          
          if (!existingItem && item.item_id) {
            existingItem = itemsByItemId.get(item.item_id);
            lookupMethod = 'zoho_id';
            logs.push(`  Looked up by item_id (zoho_id) "${item.item_id}": ${existingItem ? 'FOUND' : 'NOT FOUND'}`);
          }
          
          if (!existingItem) {
            logs.push(`  Item not found by either SKU or zoho_id`);
          } else {
            logs.push(`  Item found via ${lookupMethod}`);
          }

          if (!existingItem) {
            // Item doesn't exist - create/upsert it
            logs.push(`  Item not found - will create new item in database`);
            
            // Prepare item record for upsert
            // Use item_id as zoho_id (this is the Zoho Books item ID)
            const newItemRecord = {
              zoho_id: item.item_id || null, // This is the Zoho Books item_id
              sku: item.sku || null,
              name: item.name || 'Unknown Item',
              description: item.description || null,
              rate: item.rate ? Number(item.rate) : null,
              // Note: quantity and total from summarized items are not stored in items table
              // They're used for reorder level calculation only
              status: 'active', // Default status
              item_type: 'inventory', // Default type
              product_type: 'goods', // Default product type
              reorder_level: item.calculated_reorder_level !== undefined ? item.calculated_reorder_level : null, // Use calculated reorder level from Step 3.2
              stock_on_hand: 0, // Default
              available_stock: 0, // Default
              synced_at: new Date().toISOString(),
            };

            // Validate: Need either SKU or zoho_id for upsert
            if (!newItemRecord.sku && !newItemRecord.zoho_id) {
              const errorInfo = {
                sku: item.sku || null,
                item_id: item.item_id || null,
                name: item.name || null,
                error: 'Cannot create item: missing both SKU and item_id (zoho_id). At least one is required.',
              };
              result.errors.push(errorInfo);
              logs.push(`  ERROR: Cannot create item - missing both SKU and item_id`);
              continue;
            }
            
            // Prefer SKU for conflict key, but zoho_id is also acceptable as fallback
            if (!newItemRecord.sku) {
              logs.push(`  WARNING: Item missing SKU, will use zoho_id as conflict key`);
            }

            try {
              // Determine conflict key: prefer SKU, fallback to zoho_id if SKU is null
              const conflictKey = newItemRecord.sku ? 'sku' : 'zoho_id';
              logs.push(`  Using conflict key: ${conflictKey} (SKU: ${newItemRecord.sku || 'N/A'}, zoho_id: ${newItemRecord.zoho_id || 'N/A'})`);
              
              // Upsert the item (will create if doesn't exist, update if exists)
              // Use SKU as primary conflict key if available, otherwise use zoho_id
              const { data: upsertedItems, error: upsertError } = await this.dal.upsert(
                'zoho_books_items',
                [newItemRecord],
                { onConflict: conflictKey }
              );

              if (upsertError) {
                const errorInfo = {
                  sku: item.sku || null,
                  item_id: item.item_id || null,
                  name: item.name || null,
                  error: `Failed to upsert item: ${upsertError.message}`,
                };
                result.errors.push(errorInfo);
                logs.push(`  ERROR: Failed to upsert item - ${upsertError.message}`);
                Logger.error('Failed to upsert item', upsertError, {
                  item: newItemRecord,
                });
                continue;
              }

              logs.push(`  ✓ Created new item in database: zoho_id=${newItemRecord.zoho_id}, sku=${newItemRecord.sku || 'N/A'}`);
              
              result.details.push({
                sku: item.sku || item.item_id,
                item_id: item.item_id,
                name: item.name,
                quantity: item.quantity,
                action: 'created',
                newItemId: upsertedItems?.[0]?.id || null,
                zoho_id: newItemRecord.zoho_id,
              });

              result.updated++;
              logs.push(`  ✓ Successfully created item ${idx + 1}`);

            } catch (error) {
              const errorInfo = {
                sku: item.sku || null,
                item_id: item.item_id || null,
                name: item.name || null,
                error: `Exception during upsert: ${error.message}`,
                errorStack: error.stack,
              };
              result.errors.push(errorInfo);
              logs.push(`  EXCEPTION: Failed to create item - ${error.message}`);
              Logger.error('Exception creating item', error, {
                item: newItemRecord,
              });
              continue;
            }
          } else {
            // Item exists - update it using SKU as conflict key
            logs.push(`  Found existing item: id=${existingItem.id}, zoho_id=${existingItem.zoho_id}, sku=${existingItem.sku || 'N/A'}, current_reorder_level=${existingItem.reorder_level}`);

            // Prepare update record (merge existing data with new data)
            const updateRecord = {
              zoho_id: item.item_id || existingItem.zoho_id, // Keep existing if new is missing
              sku: item.sku || existingItem.sku, // Update SKU if provided
              name: item.name || existingItem.name, // Update name if provided
              description: item.description || existingItem.description || null,
              rate: item.rate ? Number(item.rate) : existingItem.rate || null,
              // Note: quantity and total from summarized items are not stored in items table
              // They're used for reorder level calculation only
              status: existingItem.status || 'active', // Keep existing status
              item_type: existingItem.item_type || 'inventory', // Keep existing type
              product_type: existingItem.product_type || 'goods', // Keep existing product type
              reorder_level: item.calculated_reorder_level !== undefined ? item.calculated_reorder_level : existingItem.reorder_level, // Use calculated reorder level from Step 3.2
              synced_at: new Date().toISOString(),
            };

            // Determine conflict key: prefer SKU, fallback to zoho_id
            const conflictKey = updateRecord.sku ? 'sku' : 'zoho_id';
            logs.push(`  Updating item using conflict key: ${conflictKey}`);

            try {
              // Upsert the item (will update existing record)
              const { data: updatedItems, error: updateError } = await this.dal.upsert(
                'zoho_books_items',
                [updateRecord],
                { onConflict: conflictKey }
              );

              if (updateError) {
                const errorInfo = {
                  sku: item.sku || null,
                  item_id: item.item_id || null,
                  name: item.name || null,
                  error: `Failed to update item: ${updateError.message}`,
                };
                result.errors.push(errorInfo);
                logs.push(`  ERROR: Failed to update item - ${updateError.message}`);
                Logger.error('Failed to update item', updateError, {
                  item: updateRecord,
                });
                continue;
              }

              logs.push(`  ✓ Updated item in database: ${conflictKey}=${updateRecord[conflictKey] || 'N/A'}`);

              result.details.push({
                sku: item.sku || item.item_id,
                item_id: item.item_id,
                name: item.name,
                quantity: item.quantity,
                action: 'updated',
                existingReorderLevel: existingItem.reorder_level,
                existingStockOnHand: existingItem.stock_on_hand,
                existingItemId: existingItem.id,
                existingZohoId: existingItem.zoho_id,
                updatedItemId: updatedItems?.[0]?.id || null,
              });

              result.updated++;
              logs.push(`  ✓ Successfully updated item ${idx + 1}`);

            } catch (error) {
              const errorInfo = {
                sku: item.sku || null,
                item_id: item.item_id || null,
                name: item.name || null,
                error: `Exception during update: ${error.message}`,
                errorStack: error.stack,
              };
              result.errors.push(errorInfo);
              logs.push(`  EXCEPTION: Failed to update item - ${error.message}`);
              Logger.error('Exception updating item', error, {
                item: updateRecord,
              });
              continue;
            }
          }

        } catch (error) {
          const errorInfo = {
            sku: item.sku || item.item_id || 'unknown',
            item_id: item.item_id || null,
            name: item.name || null,
            error: error.message,
            errorStack: error.stack,
          };
          result.errors.push(errorInfo);
          logs.push(`  EXCEPTION processing item ${idx + 1}: ${error.message}`);
          logs.push(`  Stack: ${error.stack}`);
          Logger.error(`Exception processing item ${idx + 1}`, error, {
            item: {
              sku: item.sku,
              item_id: item.item_id,
              name: item.name,
            },
          });
        }
      }
      
      logs.push(`Finished processing all items. Updated: ${result.updated}, Errors: ${result.errors.length}`);

      logs.push(`Successfully processed ${result.updated} items. ${result.errors.length} errors.`);

      return {
        success: result.errors.length === 0,
        updated: result.updated,
        errors: result.errors,
        details: result.details,
        logs,
      };

    } catch (error) {
      Logger.error('Error in Step 3.3: Upload items to database', error);
      logs.push(`ERROR: ${error.message}`);
      return {
        success: false,
        error: error.message,
        updated: result.updated,
        errors: result.errors,
        details: result.details,
        logs,
      };
    }
  }

  /**
   * Get sales order line items within look-back window using join query
   * Uses raw SQL query via Supabase RPC or direct query
   * 
   * @param {number} lookBackDays - Days to look back
   * @returns {Promise<Array>} Array of line items with sales order date
   */
  async getSalesOrderLineItems(lookBackDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - lookBackDays);
    cutoffDate.setHours(0, 0, 0, 0);

    // Use DAL to query with join
    // Since Supabase PostgREST doesn't support complex joins directly,
    // we'll fetch sales orders first, then line items
    // OR use a database function/RPC
    
    // Approach: Get sales orders in date range, then get their line items
    const { data: salesOrders, error: soError } = await this.dal.select(
      'zoho_books_salesorders',
      {
        queryBuilder: (query) => {
          return query
            .select('id, zoho_id, date')
            .gte('date', cutoffDate.toISOString().split('T')[0])
            .order('date', { ascending: false });
        },
      }
    );

    if (soError) {
      throw new Error(`Failed to fetch sales orders: ${soError.message}`);
    }

    if (!salesOrders || salesOrders.length === 0) {
      return [];
    }

    const salesOrderIds = salesOrders.map(so => so.id).filter(Boolean);

    // If no valid sales order IDs, return empty array
    if (salesOrderIds.length === 0) {
      Logger.info('No sales order IDs found in date range', { lookBackDays });
      return [];
    }

    // Validate UUIDs (basic check - UUIDs should be 36 characters with dashes)
    const invalidIds = salesOrderIds.filter(id => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return !uuidRegex.test(id);
    });

    if (invalidIds.length > 0) {
      Logger.warn('Found invalid UUIDs in sales order IDs', {
        invalidCount: invalidIds.length,
        firstFewInvalid: invalidIds.slice(0, 3),
      });
      // Filter out invalid UUIDs
      const validIds = salesOrderIds.filter(id => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
      });
      
      if (validIds.length === 0) {
        Logger.error('No valid UUIDs found after filtering', {});
        return [];
      }
      
      salesOrderIds.length = 0;
      salesOrderIds.push(...validIds);
    }

    // PostgREST has limits on .in() array size - batch if needed
    // Typical limit is around 100-1000 items depending on PostgREST version
    const BATCH_SIZE = 100;
    const allLineItems = [];

    // Get line items for these sales orders
    // Note: Supabase PostgREST requires at least one value in .in() array
    Logger.info('Fetching line items for sales orders', {
      salesOrderCount: salesOrderIds.length,
      firstFewIds: salesOrderIds.slice(0, 5),
      willBatch: salesOrderIds.length > BATCH_SIZE,
      batchCount: Math.ceil(salesOrderIds.length / BATCH_SIZE),
    });

    // Batch queries if needed to avoid PostgREST limits
    if (salesOrderIds.length <= BATCH_SIZE) {
      // Single query for small arrays
      try {
        // Log query parameters before execution
        Logger.info('Executing line items query (single batch)', {
          table: 'zoho_books_line_items',
          salesOrderCount: salesOrderIds.length,
          firstFewIds: salesOrderIds.slice(0, 3),
          columns: 'id, parent_id, parent_type, zoho_id, item_id, sku, name, description, quantity, rate, total',
        });

        const result = await this.dal.select(
          'zoho_books_line_items',
          {
            columns: 'id, parent_id, parent_type, zoho_id, item_id, sku, name, description, quantity, rate, total',
            queryBuilder: (query) => {
              return query
                .in('parent_id', salesOrderIds)
                .eq('parent_type', 'salesorder');
            },
          }
        );

        if (result.error) {
          // Log the raw error object with all its properties
          console.error('[BooksReorderLevelService] Raw error from DAL:', JSON.stringify(result.error, null, 2));
          Logger.error('Error fetching line items - result.error exists', {
            error: result.error,
            errorType: typeof result.error,
            errorKeys: Object.keys(result.error || {}),
            errorString: String(result.error),
            errorJSON: JSON.stringify(result.error),
            salesOrderCount: salesOrderIds.length,
          });
          throw result.error;
        }

        const lineItems = result.data || [];
        allLineItems.push(...lineItems);
      } catch (error) {
        // Log the raw error object with all its properties
        console.error('[BooksReorderLevelService] Caught error:', {
          error,
          errorType: typeof error,
          errorConstructor: error?.constructor?.name,
          errorKeys: Object.keys(error || {}),
          errorString: String(error),
          errorJSON: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          errorMessage: error?.message,
          errorCode: error?.code,
          errorDetails: error?.details,
          errorHint: error?.hint,
          salesOrderCount: salesOrderIds.length,
        });

        // Log full error details before re-throwing
        Logger.error('Exception while fetching line items', error, {
          salesOrderCount: salesOrderIds.length,
          errorCode: error?.code,
          errorDetails: error?.details,
          errorHint: error?.hint,
          errorMessage: error?.message,
          errorType: typeof error,
          errorKeys: Object.keys(error || {}),
          stack: error?.stack,
        });

        // Re-throw with more context
        const errorMessage = error?.message || 'Unknown error';
        const enhancedError = new Error(`Failed to fetch line items: ${errorMessage}${error?.details ? ` (Details: ${error?.details})` : ''}${error?.hint ? ` (Hint: ${error?.hint})` : ''}`);
        enhancedError.code = error?.code;
        enhancedError.details = error?.details;
        enhancedError.hint = error?.hint;
        enhancedError.originalError = error;
        throw enhancedError;
      }
    } else {
      // Batch queries for large arrays
      for (let i = 0; i < salesOrderIds.length; i += BATCH_SIZE) {
        const batch = salesOrderIds.slice(i, i + BATCH_SIZE);
        
        try {
          Logger.info(`Executing line items query (batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(salesOrderIds.length / BATCH_SIZE)})`, {
            batchSize: batch.length,
            batchStart: i,
            batchEnd: i + batch.length - 1,
          });

          const result = await this.dal.select(
            'zoho_books_line_items',
            {
              columns: 'id, parent_id, parent_type, zoho_id, item_id, sku, name, description, quantity, rate, total',
              queryBuilder: (query) => {
                return query
                  .in('parent_id', batch)
                  .eq('parent_type', 'salesorder');
              },
            }
          );

          if (result.error) {
            console.error(`[BooksReorderLevelService] Error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, JSON.stringify(result.error, null, 2));
            Logger.error(`Error fetching line items batch ${Math.floor(i / BATCH_SIZE) + 1}`, result.error);
            // Continue with other batches instead of failing completely
            continue;
          }

          if (result.data) {
            allLineItems.push(...result.data);
          }
        } catch (error) {
          console.error(`[BooksReorderLevelService] Exception in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, {
            error,
            errorMessage: error?.message,
            errorCode: error?.code,
            errorDetails: error?.details,
          });
          Logger.error(`Exception in batch ${Math.floor(i / BATCH_SIZE) + 1}`, error);
          // Continue with other batches
          continue;
        }
      }
    }

    const lineItems = allLineItems;

    // Enrich line items with sales order date for filtering
    const salesOrderMap = new Map(salesOrders.map(so => [so.id, so]));
    
    return (lineItems || []).map(item => ({
      ...item,
      sales_order_date: salesOrderMap.get(item.parent_id)?.date || null,
    }));
  }

  /**
   * Calculate reorder levels from line items
   * 
   * @param {Array} lineItems - Array of line items with sales order dates
   * @param {number} lookBackDays - Days looked back
   * @param {number} inventoryTurnoverDays - Target inventory turnover period
   * @returns {object} Map of SKU to reorder level data
   */
  calculateReorderLevels(lineItems, lookBackDays, inventoryTurnoverDays) {
    // Group by SKU (or item_id if SKU is null)
    const skuGroups = {};

    for (const item of lineItems) {
      const sku = item.sku || item.item_id || `item_${item.item_id}`;
      
      if (!skuGroups[sku]) {
        skuGroups[sku] = {
          sku,
          item_id: item.item_id,
          name: item.name,
          quantity: 0,
          rate: item.rate,
          total: 0,
          firstInstance: item, // Keep first instance for other fields
        };
      }

      const qty = item.quantity ? Number(item.quantity) : 0;
      skuGroups[sku].quantity += qty;
      skuGroups[sku].total += (item.total ? Number(item.total) : 0);
    }

    // Calculate reorder_level for each SKU
    const reorderLevels = {};

    for (const [sku, group] of Object.entries(skuGroups)) {
      // Expected sales in inventory turnover period
      // Formula: (total sales in lookBackDays / lookBackDays) * inventoryTurnoverDays
      const dailyAverage = group.quantity / lookBackDays;
      const expectedSales = dailyAverage * inventoryTurnoverDays;
      
      // Round: < 1.5 = 1, >= 1.5 = 2
      const reorderLevel = expectedSales < 1.5 ? 1 : Math.round(expectedSales);

      reorderLevels[sku] = {
        ...group.firstInstance,
        sku: group.sku,
        item_id: group.item_id,
        name: group.name,
        calculated_reorder_level: reorderLevel,
        calculation_details: {
          totalQuantity: group.quantity,
          lookBackDays,
          inventoryTurnoverDays,
          dailyAverage: dailyAverage.toFixed(2),
          expectedSales: expectedSales.toFixed(2),
        },
      };
    }

    return reorderLevels;
  }

  /**
   * Update zoho_books_items table with calculated reorder levels
   * Uses upsert logic: creates items if they don't exist, updates if they do
   * Uses SKU as primary conflict key (with zoho_id fallback)
   * 
   * @param {object} reorderLevels - Map of SKU to reorder level data
   * @returns {Promise<object>} Result with updated count and errors
   */
  async updateItemsTable(reorderLevels) {
    Logger.info('Updating items table with calculated reorder levels', {
      reorderLevelsCount: Object.keys(reorderLevels).length,
    });
    
    const errors = [];
    let updated = 0;
    const details = [];

    // Get all items by SKU or item_id to find existing records
    const skus = Object.keys(reorderLevels).filter(s => s && !s.startsWith('item_'));
    const itemIds = Object.values(reorderLevels).map(r => r.item_id).filter(Boolean);

    // Fetch existing items - we'll need to query separately by SKU and zoho_id
    // PostgREST has a limit of ~1000 items for .in() filters, but HTTP URLs have a ~2048 char limit
    // With URL encoding, 100 SKUs creates ~1500-2000 char URLs, so we use 100 as a safe batch size
    const allExistingItems = [];
    const BATCH_SIZE = 100; // HTTP URL length limit (~2048 chars) - 100 SKUs ≈ 1500-2000 chars

    // Query by SKU in batches
    if (skus.length > 0) {
      // Process SKUs in batches
      for (let i = 0; i < skus.length; i += BATCH_SIZE) {
        const skuBatch = skus.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(skus.length / BATCH_SIZE);
        
        const { data: itemsBySku, error: skuError } = await this.dal.select(
          'zoho_books_items',
          {
            columns: 'id, zoho_id, sku, name, reorder_level, status, item_type, product_type, description, rate, stock_on_hand, available_stock',
            queryBuilder: (query) => {
              return query.in('sku', skuBatch);
            },
          }
        );

        if (skuError) {
          Logger.warn(`Error fetching items by SKU (batch ${batchNum}/${totalBatches})`, skuError);
          errors.push({
            batch: `SKU batch ${batchNum}/${totalBatches}`,
            error: skuError.message,
          });
        } else if (itemsBySku) {
          allExistingItems.push(...itemsBySku);
        }
      }
    }

    // Query by zoho_id (item_id from Zoho) in batches
    if (itemIds.length > 0) {
      // Process itemIds in batches
      for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
        const itemIdBatch = itemIds.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(itemIds.length / BATCH_SIZE);
        
        const { data: itemsById, error: idError } = await this.dal.select(
          'zoho_books_items',
          {
            columns: 'id, zoho_id, sku, name, reorder_level, status, item_type, product_type, description, rate, stock_on_hand, available_stock',
            queryBuilder: (query) => {
              return query.in('zoho_id', itemIdBatch);
            },
          }
        );

        if (idError) {
          Logger.warn(`Error fetching items by zoho_id (batch ${batchNum}/${totalBatches})`, idError);
          errors.push({
            batch: `zoho_id batch ${batchNum}/${totalBatches}`,
            error: idError.message,
          });
        } else if (itemsById) {
          allExistingItems.push(...itemsById);
        }
      }
    }

    // Create a map of existing items by SKU and item_id (zoho_id)
    const itemsBySkuMap = new Map();
    const itemsByItemIdMap = new Map();

    // Remove duplicates (same item might be found by both SKU and zoho_id)
    const uniqueItems = new Map();
    allExistingItems.forEach(item => {
      if (!uniqueItems.has(item.id)) {
        uniqueItems.set(item.id, item);
      }
    });

    uniqueItems.forEach(item => {
      if (item.sku) {
        itemsBySkuMap.set(item.sku, item);
      }
      if (item.zoho_id) {
        itemsByItemIdMap.set(item.zoho_id, item);
      }
    });

    // Process each reorder level entry
    for (const [sku, reorderData] of Object.entries(reorderLevels)) {
      // Find existing item - prioritize SKU lookup
      let existingItem = null;
      let lookupMethod = null;
      
      if (sku && !sku.startsWith('item_')) {
        existingItem = itemsBySkuMap.get(sku);
        lookupMethod = 'SKU';
      }
      
      if (!existingItem && reorderData.item_id) {
        existingItem = itemsByItemIdMap.get(reorderData.item_id);
        lookupMethod = 'zoho_id';
      }

      if (!existingItem) {
        // Item doesn't exist - create/upsert it
        Logger.info('Item not found - will create new item in database', {
          sku,
          item_id: reorderData.item_id,
        });
        
        // Prepare item record for upsert
        const newItemRecord = {
          zoho_id: reorderData.item_id || null,
          sku: sku && !sku.startsWith('item_') ? sku : null,
          name: reorderData.name || 'Unknown Item',
          description: reorderData.description || null,
          rate: reorderData.rate ? Number(reorderData.rate) : null,
          status: 'active', // Default status
          item_type: 'inventory', // Default type
          product_type: 'goods', // Default product type
          reorder_level: reorderData.calculated_reorder_level !== undefined ? reorderData.calculated_reorder_level : null,
          stock_on_hand: 0, // Default
          available_stock: 0, // Default
          synced_at: new Date().toISOString(),
        };

        // Validate: Need either SKU or zoho_id for upsert
        if (!newItemRecord.sku && !newItemRecord.zoho_id) {
          errors.push({
            sku: sku || null,
            item_id: reorderData.item_id || null,
            name: reorderData.name || null,
            error: 'Cannot create item: missing both SKU and item_id (zoho_id). At least one is required.',
          });
          continue;
        }

        // Determine conflict key: prefer SKU, fallback to zoho_id
        const conflictKey = newItemRecord.sku ? 'sku' : 'zoho_id';

        try {
          // Upsert the item (will create if doesn't exist, update if exists)
          const { data: upsertedItems, error: upsertError } = await this.dal.upsert(
            'zoho_books_items',
            [newItemRecord],
            { onConflict: conflictKey }
          );

          if (upsertError) {
            errors.push({
              sku: sku || null,
              item_id: reorderData.item_id || null,
              name: reorderData.name || null,
              error: `Failed to upsert item: ${upsertError.message}`,
            });
            Logger.error('Failed to upsert item', upsertError, {
              item: newItemRecord,
            });
            continue;
          }

          details.push({
            sku: sku || reorderData.item_id,
            item_id: reorderData.item_id,
            name: reorderData.name,
            action: 'created',
            newItemId: upsertedItems?.[0]?.id || null,
            zoho_id: newItemRecord.zoho_id,
            reorder_level: newItemRecord.reorder_level,
          });

          updated++;
          Logger.info(`Created new item in database: zoho_id=${newItemRecord.zoho_id}, sku=${newItemRecord.sku || 'N/A'}, reorder_level=${newItemRecord.reorder_level}`);

        } catch (error) {
          errors.push({
            sku: sku || null,
            item_id: reorderData.item_id || null,
            name: reorderData.name || null,
            error: `Exception during upsert: ${error.message}`,
            errorStack: error.stack,
          });
          Logger.error('Exception creating item', error, {
            item: newItemRecord,
          });
          continue;
        }
      } else {
        // Item exists - update it using SKU as conflict key
        Logger.info(`Found existing item: id=${existingItem.id}, zoho_id=${existingItem.zoho_id}, sku=${existingItem.sku || 'N/A'}, current_reorder_level=${existingItem.reorder_level}`);

        // Prepare update record (merge existing data with new data)
        const updateRecord = {
          zoho_id: reorderData.item_id || existingItem.zoho_id, // Keep existing if new is missing
          sku: (sku && !sku.startsWith('item_')) ? sku : existingItem.sku, // Update SKU if provided
          name: reorderData.name || existingItem.name, // Update name if provided
          description: reorderData.description || existingItem.description || null,
          rate: reorderData.rate ? Number(reorderData.rate) : existingItem.rate || null,
          status: existingItem.status || 'active', // Keep existing status
          item_type: existingItem.item_type || 'inventory', // Keep existing type
          product_type: existingItem.product_type || 'goods', // Keep existing product type
          reorder_level: reorderData.calculated_reorder_level !== undefined ? reorderData.calculated_reorder_level : existingItem.reorder_level, // Use calculated reorder level
          synced_at: new Date().toISOString(),
        };

        // Determine conflict key: prefer SKU, fallback to zoho_id
        const conflictKey = updateRecord.sku ? 'sku' : 'zoho_id';

        try {
          // Upsert the item (will update existing record)
          const { data: updatedItems, error: updateError } = await this.dal.upsert(
            'zoho_books_items',
            [updateRecord],
            { onConflict: conflictKey }
          );

          if (updateError) {
            errors.push({
              sku: sku || null,
              item_id: reorderData.item_id || null,
              name: reorderData.name || null,
              error: `Failed to update item: ${updateError.message}`,
            });
            Logger.error('Failed to update item', updateError, {
              item: updateRecord,
            });
            continue;
          }

          details.push({
            sku: sku || reorderData.item_id,
            item_id: reorderData.item_id,
            name: reorderData.name,
            action: 'updated',
            existingReorderLevel: existingItem.reorder_level,
            existingStockOnHand: existingItem.stock_on_hand,
            existingItemId: existingItem.id,
            existingZohoId: existingItem.zoho_id,
            updatedItemId: updatedItems?.[0]?.id || null,
            newReorderLevel: updateRecord.reorder_level,
          });

          updated++;
          Logger.info(`Updated item in database: ${conflictKey}=${updateRecord[conflictKey] || 'N/A'}, reorder_level=${updateRecord.reorder_level}`);

        } catch (error) {
          errors.push({
            sku: sku || null,
            item_id: reorderData.item_id || null,
            name: reorderData.name || null,
            error: `Exception during update: ${error.message}`,
            errorStack: error.stack,
          });
          Logger.error('Exception updating item', error, {
            item: updateRecord,
          });
          continue;
        }
      }
    }

    Logger.info('Items table update completed', {
      updated,
      errorCount: errors.length,
      detailsCount: details.length,
    });

    return { updated, errors, details };
  }
}
