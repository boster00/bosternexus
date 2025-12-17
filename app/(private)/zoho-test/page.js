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
  
  // Toggle states for sample data fetching (default: only salesorders enabled)
  const [sampleDataModules, setSampleDataModules] = useState({
    salesorders: true,
    invoices: false,
    purchaseorders: false,
    bills: false,
  });

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
    setSyncStatus(null);
    try {
      const response = await apiClient.post("/zoho/books/sync-historical", {
        days: syncDays || 180,
      });
      setSyncStatus(response);
      setResults(response);
      toast.success(`Sync completed: ${response.summary}`);
      // Reload latest sync dates
      await loadLatestSyncDates();
    } catch (error) {
      toast.error(`Sync error: ${error.message}`);
      setSyncStatus({ error: error.message });
      setResults({ error: error.message });
    } finally {
      setSyncLoading(false);
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

  const handleGetList = async () => {
    if (!module) {
      toast.error("Please select a module");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/zoho/test", {
        action: "getList",
        service,
        module,
        limit: limit || 5,
      });
      setResults(response);
      toast.success(`Retrieved ${response.count || 0} records`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    if (!module || !recordId) {
      toast.error("Please provide both module and record ID");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/zoho/test", {
        action: "getById",
        service,
        module,
        recordId,
      });
      setResults(response);
      toast.success("Record retrieved successfully");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!module || !searchCriteria) {
      toast.error("Please provide both module and search criteria");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/zoho/test", {
        action: "search",
        service,
        module,
        searchCriteria,
      });
      setResults(response);
      toast.success(`Found ${response.count || 0} matching records`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncItems = async () => {
    if (service !== "books") {
      toast.error("Item sync is only available for Zoho Books");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/zoho/books/items/sync", {
        per_page: 5,
        page: 1,
      });
      setResults(response);
      if (response.success) {
        toast.success(`Successfully synced ${response.data?.synced || 0} items to database`);
      } else {
        toast.error(`Sync completed with errors: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
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
        toast.warning(`Retrieved ${totalCount} records with ${errorCount} error(s)`);
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

  const handleToggleSampleModule = (module) => {
    setSampleDataModules(prev => ({
      ...prev,
      [module]: !prev[module],
    }));
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

            {/* Get List Section */}
            <div className="card card-border bg-base-100 p-6">
              <h2 className="text-xl font-bold mb-4">2. Get List from Module</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Module</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                  >
                    <option value="">Select a module...</option>
                    {getModulesForService().map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Limit</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    className="input input-bordered w-full"
                    placeholder="Enter limit (default: 5)"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
                  />
                  <label className="label">
                    <span className="label-text-alt">Maximum number of records to retrieve (default: 5)</span>
                  </label>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleGetList}
                  disabled={loading || !module}
                >
                  {loading ? "Loading..." : "Get List"}
                </button>
              </div>
            </div>

            {/* Get by ID Section */}
            <div className="card card-border bg-base-100 p-6">
              <h2 className="text-xl font-bold mb-4">3. Get Record by ID</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Module</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                  >
                    <option value="">Select a module...</option>
                    {getModulesForService().map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Record ID</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Enter record ID"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleGetById}
                  disabled={loading || !module || !recordId}
                >
                  {loading ? "Loading..." : "Get Record"}
                </button>
              </div>
            </div>

            {/* Search Section */}
            <div className="card card-border bg-base-100 p-6">
              <h2 className="text-xl font-bold mb-4">4. Search by Criteria</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Module</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                  >
                    <option value="">Select a module...</option>
                    {getModulesForService().map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Search Criteria</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Enter search criteria"
                    value={searchCriteria}
                    onChange={(e) => setSearchCriteria(e.target.value)}
                  />
                </div>

                {/* Search Criteria Instructions */}
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
                  <div>
                    <h3 className="font-bold">Search Criteria Format:</h3>
                    <div className="text-sm mt-2 space-y-1">
                      <p><strong>Zoho Books:</strong> Simple text search (e.g., "item name")</p>
                      <p><strong>Zoho CRM:</strong> Use criteria string format:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Single: <code className="bg-base-200 px-1 rounded">(Last_Name:equals:Smith)</code></li>
                        <li>Multiple AND: <code className="bg-base-200 px-1 rounded">((Last_Name:equals:Smith)and(Company:equals:Zylker))</code></li>
                        <li>Multiple OR: <code className="bg-base-200 px-1 rounded">((Last_Name:equals:Smith)or(Company:equals:Zylker))</code></li>
                        <li>Operators: <code className="bg-base-200 px-1 rounded">equals</code>, <code className="bg-base-200 px-1 rounded">starts_with</code></li>
                      </ul>
                      <p><strong>Zoho Desk:</strong> Simple text search (e.g., "ticket subject")</p>
                      <p className="text-xs opacity-70 mt-2">
                        For detailed CRM criteria syntax, see{" "}
                        <a
                          href="https://www.zoho.com/developer/docs/vertical-solutions/api/v2/search-records.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary"
                        >
                          Zoho CRM Search API Documentation
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-full"
                  onClick={handleSearch}
                  disabled={loading || !module || !searchCriteria}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {/* Fetch Sample Data Section (Books only) */}
            {service === "books" && (
              <div className="card card-border bg-base-100 p-6">
                <h2 className="text-xl font-bold mb-4">5. Fetch Sample Data (5 Records Each)</h2>
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
                      <p>Select modules to fetch 5 sample records each. Raw Zoho JSON will be displayed in the results panel.</p>
                    </div>
                  </div>
                  
                  {/* Toggle checkboxes for each module */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={sampleDataModules.salesorders}
                        onChange={() => handleToggleSampleModule('salesorders')}
                        disabled={loading}
                      />
                      <span className="label-text">Sales Orders</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={sampleDataModules.invoices}
                        onChange={() => handleToggleSampleModule('invoices')}
                        disabled={loading}
                      />
                      <span className="label-text">Invoices</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={sampleDataModules.purchaseorders}
                        onChange={() => handleToggleSampleModule('purchaseorders')}
                        disabled={loading}
                      />
                      <span className="label-text">Purchase Orders</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={sampleDataModules.bills}
                        onChange={() => handleToggleSampleModule('bills')}
                        disabled={loading}
                      />
                      <span className="label-text">Bills</span>
                    </label>
                  </div>

                  <button
                    className="btn btn-primary w-full"
                    onClick={handleFetchSampleData}
                    disabled={loading || Object.values(sampleDataModules).every(v => !v)}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Fetching...
                      </>
                    ) : (
                      "Fetch Sample Data"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Sync Historical Data Section (Books only) */}
            {service === "books" && (
              <div className="card card-border bg-base-100 p-6">
                <h2 className="text-xl font-bold mb-4">6. Sync Historical Data</h2>
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

                  <button
                    className="btn btn-primary w-full"
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

            {/* Sync Items Section (Books only) */}
            {service === "books" && (
              <div className="card card-border bg-base-100 p-6">
                <h2 className="text-xl font-bold mb-4">6. Sync Items to Database</h2>
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
                      <p>This will:</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Pull 5 items from Zoho Books API</li>
                        <li>Transform and map the data</li>
                        <li>Upsert into <code className="bg-base-200 px-1 rounded">zoho_books_items</code> table</li>
                      </ol>
                    </div>
                  </div>
                  <button
                    className="btn btn-success w-full"
                    onClick={handleSyncItems}
                    disabled={loading}
                  >
                    {loading ? "Syncing..." : "Sync 5 Items to Database"}
                  </button>
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
