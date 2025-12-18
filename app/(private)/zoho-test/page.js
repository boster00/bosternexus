"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/libs/api";
import { toast } from "react-hot-toast";
import ButtonAccount from "@/components/ButtonAccount";
import ZohoAuthStatus from "@/components/ZohoAuthStatus";

export default function ZohoTestPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [authStatus, setAuthStatus] = useState({});

  // Form states
  const [service, setService] = useState("books");
  const [module, setModule] = useState("");
  const [recordId, setRecordId] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [limit, setLimit] = useState(5);
  const [syncDays, setSyncDays] = useState(180);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [latestSyncDates, setLatestSyncDates] = useState({});
  const [syncActive, setSyncActive] = useState(false);
  
  // Reorder level calculation states
  const [reorderLookBackDays, setReorderLookBackDays] = useState(180);
  const [reorderInventoryTurnoverDays, setReorderInventoryTurnoverDays] = useState(90);
  const [reorderLoading, setReorderLoading] = useState(false);
  
  // Step-by-step reorder level states
  const [step31Loading, setStep31Loading] = useState(false);
  const [step32Loading, setStep32Loading] = useState(false);
  const [step33Loading, setStep33Loading] = useState(false);
  const [step31Data, setStep31Data] = useState(null);
  const [step32Data, setStep32Data] = useState(null);

  // Handle OAuth callback results
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const serviceParam = searchParams.get("service");

    if (success === "true" && serviceParam) {
      toast.success(`Successfully authenticated with Zoho ${serviceParam}`);
      // Update URL to remove query params
      window.history.replaceState({}, "", "/zoho-test");
    } else if (error && serviceParam) {
      toast.error(`Authentication failed: ${decodeURIComponent(error)}`);
      // Update URL to remove query params
      window.history.replaceState({}, "", "/zoho-test");
    }
  }, [searchParams]);

  // Load latest sync dates on mount and when service changes
  useEffect(() => {
    if (service === "books") {
      loadLatestSyncDates();
    }
  }, [service]);

  const loadLatestSyncDates = async () => {
    try {
      const response = await apiClient.get("/zoho/books/sync-historical");
      if (response.latestDates) {
        setLatestSyncDates(response.latestDates);
      }
    } catch (error) {
      console.error("Error loading latest sync dates:", error);
    }
  };

  const handleSyncHistorical = async () => {
    setSyncLoading(true);
    setSyncActive(true);
    setSyncStatus(null);
    try {
      const response = await apiClient.post("/zoho/books/sync-historical", {
        days: syncDays || 180,
      });
      setSyncStatus(response);
      setResults(response);
      
      if (response.stopped) {
        toast(`Sync stopped by user. ${response.summary || 'Partial sync completed.'}`, { icon: '⚠️' });
      } else {
        toast.success(`Sync completed: ${response.summary}`);
      }
      
      // Reload latest sync dates
      await loadLatestSyncDates();
    } catch (error) {
      toast.error(`Sync error: ${error.message}`);
      setSyncStatus({ error: error.message });
      setResults({ error: error.message });
    } finally {
      setSyncLoading(false);
      setSyncActive(false);
    }
  };

  const handleStopSync = async () => {
    try {
      const response = await apiClient.post("/zoho/books/sync-historical/stop");
      if (response.success) {
        toast.success("Stop request sent. Sync will stop at the next checkpoint.");
        setSyncActive(false);
      } else {
        toast(response.message || "No active sync found to stop", { icon: '⚠️' });
      }
    } catch (error) {
      toast.error(`Error stopping sync: ${error.message}`);
    }
  };

  // Common modules for each service
  const booksModules = [
    "items",
    "invoices",
    "salesorders",
    "purchaseorders",
    "bills",
    "contacts",
    "estimates",
    "creditnotes",
    "debitnotes",
    "organizations",
  ];

  const crmModules = [
    "Contacts",
    "Leads",
    "Deals",
    "Accounts",
    "Campaigns",
    "Products",
    "Vendors",
    "Quotes",
    "Sales_Orders",
    "Purchase_Orders",
  ];

  const deskModules = ["tickets", "contacts", "departments", "agents"];

  const getModulesForService = () => {
    if (service === "books") return booksModules;
    if (service === "crm") return crmModules;
    if (service === "desk") return deskModules;
    return [];
  };

  const handleAuthStatusChange = (status) => {
    setAuthStatus({ [service]: status });
  };

  const handleCalculateReorderLevels = async () => {
    if (service !== "books") {
      toast.error("Reorder level calculation is only available for Zoho Books");
      return;
    }

    setReorderLoading(true);
    try {
      const response = await apiClient.post("/zoho/books/calculate-reorder-levels", {
        lookBackDays: reorderLookBackDays || 180,
        inventoryTurnoverDays: reorderInventoryTurnoverDays || 90,
      });
      setResults(response);
      if (response.success) {
        toast.success(`Successfully updated reorder levels for ${response.updated || 0} items`);
      } else {
        toast(`Calculation completed with ${response.errors?.length || 0} error(s)`, { icon: '⚠️' });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ error: error.message });
    } finally {
      setReorderLoading(false);
    }
  };

  // Step 3.1: Get sample sales orders and line items
  const handleStep31 = async () => {
    if (service !== "books") {
      toast.error("This step is only available for Zoho Books");
      return;
    }

    setStep31Loading(true);
    try {
      const response = await apiClient.get("/zoho/books/reorder-levels/step-3-1?limit=5");
      setStep31Data(response);
      setResults({
        step: '3.1',
        ...response,
      });
      if (response.success) {
        toast.success(`Found ${response.summary?.salesOrderCount || 0} sales orders with ${response.summary?.lineItemCount || 0} line items`);
      } else {
        toast.error(response.error || "Step 3.1 failed");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ step: '3.1', error: error.message });
    } finally {
      setStep31Loading(false);
    }
  };

  // Step 3.2: Summarize line items into items array
  const handleStep32 = async () => {
    if (service !== "books") {
      toast.error("This step is only available for Zoho Books");
      return;
    }

    if (!step31Data || !step31Data.lineItems || step31Data.lineItems.length === 0) {
      toast.error("Please run Step 3.1 first to get line items");
      return;
    }

    setStep32Loading(true);
    try {
      const response = await apiClient.post("/zoho/books/reorder-levels/step-3-2", {
        lineItems: step31Data.lineItems,
        maxQuantity: 5,
        lookBackDays: reorderLookBackDays || 180,
        inventoryTurnoverDays: reorderInventoryTurnoverDays || 90,
      });
      setStep32Data(response);
      setResults({
        step: '3.2',
        ...response,
      });
      if (response.success) {
        const itemCount = response.summary?.uniqueItemCount || 0;
        const reorderCount = response.summary?.itemsWithReorderLevel || 0;
        toast.success(`Summarized ${itemCount} unique items, calculated ${reorderCount} reorder levels`);
      } else {
        toast.error(response.error || "Step 3.2 failed");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ step: '3.2', error: error.message });
    } finally {
      setStep32Loading(false);
    }
  };

  // Step 3.3: Upload items to database
  const handleStep33 = async () => {
    if (service !== "books") {
      toast.error("This step is only available for Zoho Books");
      return;
    }

    if (!step32Data || !step32Data.items || step32Data.items.length === 0) {
      toast.error("Please run Step 3.2 first to get summarized items");
      return;
    }

    setStep33Loading(true);
    try {
      const response = await apiClient.post("/zoho/books/reorder-levels/step-3-3", {
        items: step32Data.items,
      });
      setResults({
        step: '3.3',
        ...response,
      });
      if (response.success) {
        toast.success(`Processed ${response.updated || 0} items`);
      } else {
        toast.warning(`Processed ${response.updated || 0} items with ${response.errors?.length || 0} error(s)`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ step: '3.3', error: error.message });
    } finally {
      setStep33Loading(false);
    }
  };

  // Handler functions for fetching 5 records of each type
  const handleFetchSampleData = async () => {
    setLoading(true);
    const enabledModules = Object.entries(sampleDataModules)
      .filter(([_, enabled]) => enabled)
      .map(([module, _]) => module);
    
    if (enabledModules.length === 0) {
      toast.error("Please select at least one module to fetch");
      setLoading(false);
      return;
    }

    try {
      const results = {};
      const errors = {};
      
      // Fetch data for each enabled module
      for (const module of enabledModules) {
        try {
          const response = await apiClient.post("/zoho/test", {
            action: "getList",
            service: "books",
            module: module,
            limit: 5,
          });
          results[module] = response;
        } catch (error) {
          errors[module] = error.message;
        }
      }

      // Combine all results and errors
      const combinedResults = {
        success: Object.keys(errors).length === 0,
        modules: results,
        errors: errors,
        rawZohoResponses: {}, // Store raw Zoho JSON responses
      };

      // Extract raw Zoho responses from each module's result
      // The API route returns rawResponse which contains the original Zoho JSON
      for (const [module, response] of Object.entries(results)) {
        if (response?.rawResponse) {
          // rawResponse is the full original response from Zoho API
          combinedResults.rawZohoResponses[module] = response.rawResponse;
        } else if (response?.rawZohoJson) {
          // Fallback to rawZohoJson alias
          combinedResults.rawZohoResponses[module] = response.rawZohoJson;
        } else if (response?.data) {
          // Last resort: use normalized data
          combinedResults.rawZohoResponses[module] = response.data;
        }
      }

      setResults(combinedResults);
      
      const totalCount = Object.values(results).reduce((sum, r) => sum + (r.count || 0), 0);
      const errorCount = Object.keys(errors).length;
      
      if (errorCount > 0) {
        toast(`Retrieved ${totalCount} records with ${errorCount} error(s)`, { icon: '⚠️' });
      } else {
        toast.success(`Retrieved ${totalCount} records from ${enabledModules.length} module(s)`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen p-8 pb-24">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Zoho API Test</h1>
          <ButtonAccount />
        </div>

        {/* Two Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Panel - Interactive UI */}
          <div className="space-y-4 overflow-y-auto pr-2">
            {/* Authentication Section */}
            <div className="card card-border bg-base-100 p-6">
              <h2 className="text-xl font-bold mb-4">1. Authentication</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Zoho Service</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={service}
                    onChange={(e) => {
                      setService(e.target.value);
                      setModule("");
                      setResults(null);
                      setAuthStatus({});
                    }}
                  >
                    <option value="books">Zoho Books</option>
                    <option value="crm">Zoho CRM</option>
                    <option value="desk">Zoho Desk</option>
                  </select>
                </div>
                <ZohoAuthStatus
                  service={service}
                  onStatusChange={handleAuthStatusChange}
                />
              </div>
            </div>

            {/* Sync Historical Data Section (Books only) */}
            {service === "books" && (
              <div className="card card-border bg-base-100 p-6">
                <h2 className="text-xl font-bold mb-4">2. Sync Historical Data</h2>
                <div className="space-y-4">
                  <div className="alert alert-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <div className="text-sm">
                      <p>Sync recent transactions from Zoho Books. Syncs most recent records first, then goes back in time. Function is resumable if timeout occurs.</p>
                    </div>
                  </div>

                  {/* Latest Sync Dates Display */}
                  {Object.keys(latestSyncDates).length > 0 && (
                    <div className="bg-base-200 p-3 rounded-lg">
                      <div className="text-sm font-semibold mb-2">Latest Records:</div>
                      <div className="space-y-1 text-xs">
                        {Object.entries(latestSyncDates).map(([module, dateInfo]) => (
                          <div key={module} className="flex justify-between">
                            <span className="capitalize">{module}:</span>
                            <span className={dateInfo ? "text-success" : "text-warning"}>
                              {dateInfo ? dateInfo.timeAgo : "Never synced"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="label">
                      <span className="label-text">Days to Sync</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="730"
                      className="input input-bordered w-full"
                      placeholder="Enter days (default: 180)"
                      value={syncDays}
                      onChange={(e) => setSyncDays(parseInt(e.target.value) || 180)}
                    />
                    <label className="label">
                      <span className="label-text-alt">Number of days to sync (default: 180 = 6 months). Syncs most recent first, then older records.</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary flex-1"
                      onClick={handleSyncHistorical}
                      disabled={syncLoading}
                    >
                      {syncLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Syncing...
                        </>
                      ) : (
                        "Sync Recent Transactions"
                      )}
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={handleStopSync}
                      disabled={!syncActive}
                      title={syncActive ? "Stop sync at next checkpoint" : "No active sync"}
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
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                        />
                      </svg>
                      Stop
                    </button>
                  </div>

                  {syncStatus && (
                    <div className="mt-4">
                      {syncStatus.error ? (
                        <div className="alert alert-error">
                          <span>Error: {syncStatus.error}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="alert alert-success">
                            <span>{syncStatus.summary || "Sync completed"}</span>
                          </div>
                          {syncStatus.synced && (
                            <div className="bg-base-200 p-3 rounded-lg">
                              <div className="text-sm font-semibold mb-2">Records Synced:</div>
                              <div className="space-y-1 text-xs">
                                {Object.entries(syncStatus.synced).map(([module, count]) => (
                                  <div key={module} className="flex justify-between">
                                    <span className="capitalize">{module}:</span>
                                    <span>{count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {syncStatus.errors && syncStatus.errors.length > 0 && (
                            <div className="alert alert-warning">
                              <span>{syncStatus.errors.length} error(s) occurred. Check results panel for details.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calculate Reorder Levels Section (Books only) */}
            {service === "books" && (
              <div className="card card-border bg-base-100 p-6">
                <h2 className="text-xl font-bold mb-4">3. Calculate Reorder Levels</h2>
                <div className="space-y-4">
                  <div className="alert alert-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <div className="text-sm">
                      <p>Calculate and update reorder levels for items based on sales order history:</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Get all line items from sales orders within look-back window</li>
                        <li>Remove outliers (quantity &gt; 5)</li>
                        <li>Calculate expected sales in inventory turnover period</li>
                        <li>Update reorder_level in <code className="bg-base-200 px-1 rounded">zoho_books_items</code> table</li>
                      </ol>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Look Back Days</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="730"
                      className="input input-bordered w-full"
                      placeholder="Enter days (default: 180)"
                      value={reorderLookBackDays}
                      onChange={(e) => setReorderLookBackDays(parseInt(e.target.value) || 180)}
                    />
                    <label className="label">
                      <span className="label-text-alt">Number of days to look back for sales order data (default: 180)</span>
                    </label>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Inventory Turnover Days</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      className="input input-bordered w-full"
                      placeholder="Enter days (default: 90)"
                      value={reorderInventoryTurnoverDays}
                      onChange={(e) => setReorderInventoryTurnoverDays(parseInt(e.target.value) || 90)}
                    />
                    <label className="label">
                      <span className="label-text-alt">Target inventory turnover period in days (default: 90)</span>
                    </label>
                  </div>

                  <button
                    className="btn btn-success w-full"
                    onClick={handleCalculateReorderLevels}
                    disabled={reorderLoading}
                  >
                    {reorderLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Calculating...
                      </>
                    ) : (
                      "Calculate & Update Reorder Levels"
                    )}
                  </button>

                  {/* Step-by-Step Testing */}
                  <div className="divider">OR Test Step-by-Step</div>

                  <div className="space-y-3">
                    <div className="bg-base-200 p-3 rounded-lg">
                      <h3 className="font-semibold text-sm mb-2">Step 3.1: Get Sales Orders & Line Items</h3>
                      <p className="text-xs opacity-70 mb-2">Get 5 most recent sales orders with their line items</p>
                      <button
                        className="btn btn-sm btn-primary w-full"
                        onClick={handleStep31}
                        disabled={step31Loading}
                      >
                        {step31Loading ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Loading...
                          </>
                        ) : (
                          "Step 3.1: Get 5 Sales Orders"
                        )}
                      </button>
                      {step31Data && (
                        <div className="mt-2 text-xs">
                          <div className="text-success">✓ {step31Data.summary?.salesOrderCount || 0} sales orders, {step31Data.summary?.lineItemCount || 0} line items</div>
                        </div>
                      )}
                    </div>

                    <div className="bg-base-200 p-3 rounded-lg">
                      <h3 className="font-semibold text-sm mb-2">Step 3.2: Summarize & Calculate Reorder Levels</h3>
                      <p className="text-xs opacity-70 mb-2">Group by SKU, sum quantities (filters qty &gt; 5), and calculate reorder levels</p>
                      <button
                        className="btn btn-sm btn-primary w-full"
                        onClick={handleStep32}
                        disabled={step32Loading || !step31Data}
                      >
                        {step32Loading ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Processing...
                          </>
                        ) : (
                          "Step 3.2: Summarize Items"
                        )}
                      </button>
                      {step32Data && (
                        <div className="mt-2 text-xs">
                          <div className="text-success">✓ {step32Data.summary?.uniqueItemCount || 0} unique items, {step32Data.summary?.totalQuantity || 0} total qty</div>
                          {step32Data.summary?.itemsWithReorderLevel !== undefined && (
                            <div className="text-success">✓ {step32Data.summary.itemsWithReorderLevel} items with calculated reorder levels</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-base-200 p-3 rounded-lg">
                      <h3 className="font-semibold text-sm mb-2">Step 3.3: Upload to Database</h3>
                      <p className="text-xs opacity-70 mb-2">Update items in database with summarized quantities</p>
                      <button
                        className="btn btn-sm btn-primary w-full"
                        onClick={handleStep33}
                        disabled={step33Loading || !step32Data}
                      >
                        {step33Loading ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Uploading...
                          </>
                        ) : (
                          "Step 3.3: Upload Items"
                        )}
                      </button>
                      {results?.step === '3.3' && (
                        <div className="mt-2 text-xs">
                          <div className="text-success">✓ Processed {results.updated || 0} items</div>
                          {results.errors?.length > 0 && (
                            <div className="text-warning">{results.errors.length} errors</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="card card-border bg-base-100 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Results</h2>
              {results && (
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      const jsonString = JSON.stringify(results.data || results, null, 2);
                      navigator.clipboard.writeText(jsonString).then(() => {
                        toast.success("Copied to clipboard!");
                      }).catch(() => {
                        toast.error("Failed to copy");
                      });
                    }}
                  >
                    Copy JSON
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => setResults(null)}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto">
              {/* Step-by-Step Results */}
              {results?.step && (
                <div className="space-y-4 mb-4">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Step {results.step} Results</h3>
                    
                    {/* Logs */}
                    {results.logs && Array.isArray(results.logs) && results.logs.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Execution Logs:</h4>
                        <div className="bg-base-100 rounded p-3 max-h-48 overflow-auto">
                          {results.logs.map((log, idx) => (
                            <div key={idx} className="text-xs font-mono mb-1">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3.1 Specific Results */}
                    {results.step === '3.1' && (
                      <div className="space-y-3">
                        {results.summary && (
                          <div className="bg-base-100 p-3 rounded">
                            <h4 className="text-sm font-medium mb-2">Summary:</h4>
                            <div className="text-xs space-y-1">
                              <div>Sales Orders: {results.summary.salesOrderCount}</div>
                              <div>Line Items: {results.summary.lineItemCount}</div>
                              <div>Unique Items: {results.summary.uniqueItems}</div>
                              <div>Total Quantity: {results.summary.totalQuantity}</div>
                            </div>
                          </div>
                        )}
                        {results.salesOrders && results.salesOrders.length > 0 && (
                          <details className="bg-base-100 p-3 rounded">
                            <summary className="text-sm font-medium cursor-pointer">Sales Orders ({results.salesOrders.length})</summary>
                            <div className="mt-2 text-xs overflow-auto max-h-48">
                              <pre>{JSON.stringify(results.salesOrders, null, 2)}</pre>
                            </div>
                          </details>
                        )}
                        {results.lineItems && results.lineItems.length > 0 && (
                          <details className="bg-base-100 p-3 rounded">
                            <summary className="text-sm font-medium cursor-pointer">Line Items ({results.lineItems.length})</summary>
                            <div className="mt-2 text-xs overflow-auto max-h-48">
                              <pre>{JSON.stringify(results.lineItems, null, 2)}</pre>
                            </div>
                          </details>
                        )}
                      </div>
                    )}

                    {/* Step 3.2 Specific Results */}
                    {results.step === '3.2' && (
                      <div className="space-y-3">
                        {results.summary && (
                          <div className="bg-base-100 p-3 rounded">
                            <h4 className="text-sm font-medium mb-2">Summary:</h4>
                            <div className="text-xs space-y-1">
                              <div>Input Line Items: {results.summary.inputLineItemCount}</div>
                              <div>Filtered (after outliers): {results.summary.filteredLineItemCount}</div>
                              <div>Outliers Removed: {results.summary.outlierCount}</div>
                              <div>Unique Items: {results.summary.uniqueItemCount}</div>
                              <div>Total Quantity: {results.summary.totalQuantity}</div>
                              <div>Total Value: ${results.summary.totalValue?.toFixed(2)}</div>
                            </div>
                          </div>
                        )}
                        {results.items && results.items.length > 0 && (
                          <details className="bg-base-100 p-3 rounded" open>
                            <summary className="text-sm font-medium cursor-pointer">Summarized Items ({results.items.length})</summary>
                            <div className="mt-2 text-xs overflow-auto max-h-64">
                              <pre>{JSON.stringify(results.items, null, 2)}</pre>
                            </div>
                          </details>
                        )}
                      </div>
                    )}

                    {/* Step 3.3 Specific Results */}
                    {results.step === '3.3' && (
                      <div className="space-y-3">
                        <div className="bg-base-100 p-3 rounded">
                          <h4 className="text-sm font-medium mb-2">Summary:</h4>
                          <div className="text-xs space-y-1">
                            <div>Items Processed: {results.updated || 0}</div>
                            <div>Errors: {results.errors?.length || 0}</div>
                          </div>
                        </div>
                        {results.details && results.details.length > 0 && (
                          <details className="bg-base-100 p-3 rounded">
                            <summary className="text-sm font-medium cursor-pointer">Item Details ({results.details.length})</summary>
                            <div className="mt-2 text-xs overflow-auto max-h-48">
                              <pre>{JSON.stringify(results.details, null, 2)}</pre>
                            </div>
                          </details>
                        )}
                        {results.errors && results.errors.length > 0 && (
                          <details className="bg-base-100 p-3 rounded">
                            <summary className="text-sm font-medium cursor-pointer text-error">Errors ({results.errors.length})</summary>
                            <div className="mt-2 text-xs overflow-auto max-h-48">
                              <pre>{JSON.stringify(results.errors, null, 2)}</pre>
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!results ? (
                <div className="flex items-center justify-center h-full text-base-content/50">
                  <div className="text-center">
                    <p className="text-lg mb-2">No results yet</p>
                    <p className="text-sm">Use the controls on the left to test Zoho API operations</p>
                  </div>
                </div>
              ) : results.error ? (
                <div className="alert alert-error">
                  <span>{results.error}</span>
                </div>
              ) : (
                <div className="space-y-4 h-full">
                  {/* Sync Results Summary */}
                  {results.data?.synced !== undefined && (
                    <div className="space-y-2">
                      <div className={`badge badge-lg ${results.success ? 'badge-success' : 'badge-warning'}`}>
                        Synced: {results.data.synced} / {results.data.total || 0}
                      </div>
                      {results.data.errors && results.data.errors.length > 0 && (
                        <div className="alert alert-warning">
                          <span className="text-sm">
                            {results.data.errors.length} error(s) occurred during sync
                          </span>
                        </div>
                      )}
                      {results.message && (
                        <div className="text-sm opacity-80">{results.message}</div>
                      )}
                    </div>
                  )}
                  
                  {/* Regular Count Badge */}
                  {results.count !== undefined && results.data?.synced === undefined && (
                    <div className="badge badge-primary badge-lg">
                      Count: {results.count}
                    </div>
                  )}
                  
                  {/* Sample Data Results - Show raw Zoho JSON */}
                  {results.rawZohoResponses && Object.keys(results.rawZohoResponses).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm">Raw Zoho JSON Responses:</h3>
                      {Object.entries(results.rawZohoResponses).map(([module, rawData]) => (
                        <div key={module} className="space-y-2">
                          <div className="text-sm font-medium capitalize">{module}:</div>
                          <div className="bg-base-200 rounded-lg p-4 overflow-auto max-h-96">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                              {JSON.stringify(rawData, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Historical Sync Raw Zoho Responses */}
                  {results.data?.rawZohoResponses && Object.keys(results.data.rawZohoResponses).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm">Raw Zoho JSON Responses (Historical Sync):</h3>
                      {Object.entries(results.data.rawZohoResponses).map(([module, responses]) => (
                        <div key={module} className="space-y-3">
                          <div className="text-sm font-medium capitalize">{module}:</div>
                          {Array.isArray(responses) && responses.length > 0 ? (
                            <div className="space-y-3">
                              {responses.map((response, idx) => {
                                // Extract the raw Zoho response structure
                                // The response.data contains: { code, message, [module], page_context, data }
                                const rawData = response.data || {};
                                const moduleKey = module; // e.g., 'salesorders', 'invoices'
                                const moduleArray = rawData[moduleKey] || rawData.data || [];
                                
                                return (
                                  <div key={idx} className="bg-base-200 rounded-lg p-3 border border-base-300">
                                    <div className="text-xs font-semibold mb-2 opacity-70 flex items-center gap-2">
                                      <span>
                                        {response.type === 'batch' ? `Batch Page ${response.page}` : `Transaction ${response.zohoId || idx + 1}`}
                                      </span>
                                      {rawData.code !== undefined && (
                                        <span className={`badge badge-sm ${rawData.code === 0 ? 'badge-success' : 'badge-error'}`}>
                                          Code: {rawData.code}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Show the full raw response structure */}
                                    <div className="space-y-2">
                                      <details className="collapse collapse-arrow bg-base-300 rounded">
                                        <summary className="collapse-title text-xs font-medium">
                                          Full Raw Response Structure
                                        </summary>
                                        <div className="collapse-content">
                                          <div className="bg-base-100 rounded p-2 overflow-auto max-h-96">
                                            <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                                              {JSON.stringify(rawData, null, 2)}
                                            </pre>
                                          </div>
                                        </div>
                                      </details>
                                      
                                      {/* Show the module-specific array (e.g., salesorders array) */}
                                      {Array.isArray(moduleArray) && moduleArray.length > 0 && (
                                        <details className="collapse collapse-arrow bg-base-300 rounded" open>
                                          <summary className="collapse-title text-xs font-medium">
                                            {moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)} Array ({moduleArray.length} records)
                                          </summary>
                                          <div className="collapse-content">
                                            <div className="bg-base-100 rounded p-2 overflow-auto max-h-96">
                                              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                                                {JSON.stringify(moduleArray, null, 2)}
                                              </pre>
                                            </div>
                                          </div>
                                        </details>
                                      )}
                                      
                                      {/* Show page_context if available */}
                                      {rawData.page_context && (
                                        <details className="collapse collapse-arrow bg-base-300 rounded">
                                          <summary className="collapse-title text-xs font-medium">
                                            Page Context
                                          </summary>
                                          <div className="collapse-content">
                                            <div className="bg-base-100 rounded p-2 overflow-auto">
                                              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                                                {JSON.stringify(rawData.page_context, null, 2)}
                                              </pre>
                                            </div>
                                          </div>
                                        </details>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="bg-base-200 rounded-lg p-4 overflow-auto max-h-96">
                              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                                {JSON.stringify(responses, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Module Results Summary (for sample data) */}
                  {results.modules && Object.keys(results.modules).length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Module Results Summary:</h3>
                      {Object.entries(results.modules).map(([module, moduleResult]) => (
                        <div key={module} className="bg-base-200 p-3 rounded-lg">
                          <div className="text-sm font-medium capitalize mb-2">{module}:</div>
                          <div className="text-xs opacity-80">
                            Count: {moduleResult.count || 0}
                          </div>
                          {results.errors?.[module] && (
                            <div className="text-xs text-error mt-1">
                              Error: {results.errors[module]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Raw Zoho JSON from single module fetch */}
                  {results.rawResponse && !results.rawZohoResponses && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Raw Zoho JSON Response:</h3>
                      <div className="bg-base-200 rounded-lg p-4 overflow-auto max-h-96">
                        <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                          {JSON.stringify(results.rawResponse, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {/* Full Results JSON */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Full Response JSON:</h3>
                    <div className="bg-base-200 rounded-lg p-4 h-[calc(100%-4rem)] overflow-auto">
                      <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                        {JSON.stringify(results.data || results, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
