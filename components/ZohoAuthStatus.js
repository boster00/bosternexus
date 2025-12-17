"use client";

import { useState, useEffect, useRef } from "react";
import apiClient from "@/libs/api";
import { toast } from "react-hot-toast";

/**
 * ZohoAuthStatus Component
 * 
 * Displays authentication status and provides OAuth flow controls for Zoho services
 */
export default function ZohoAuthStatus({ service, onStatusChange }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  
  // Use ref to store the latest callback without including it in dependency array
  const onStatusChangeRef = useRef(onStatusChange);
  
  // Update ref when callback changes
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  const checkStatus = async (abortSignal = null, useLiveCheck = false) => {
    setLoading(true);
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ZohoAuthStatus.js:26',message:'checkStatus entry',data:{service,useLiveCheck,abortSignal:!!abortSignal},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Use "check" action (expiration time only) for initial mount
      // Use "authenticate" action (live API call) for refresh button
      const action = useLiveCheck ? "authenticate" : "check";
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ZohoAuthStatus.js:32',message:'action determined',data:{action},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Add timeout only for live checks (authenticate action)
      const timeoutPromise = useLiveCheck 
        ? new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timed out after 15 seconds")), 15000);
          })
        : null;

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ZohoAuthStatus.js:40',message:'before API call',data:{action,service,hasTimeout:!!timeoutPromise},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      const apiCallPromise = apiClient.post("/zoho/test", {
        action,
        service,
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ZohoAuthStatus.js:47',message:'API call promise created, awaiting',data:{action},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      const response = timeoutPromise 
        ? await Promise.race([apiCallPromise, timeoutPromise])
        : await apiCallPromise;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ZohoAuthStatus.js:52',message:'API call completed',data:{hasResponse:!!response,authenticated:response?.authenticated},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Check if request was aborted
      if (abortSignal?.aborted) {
        return;
      }
      
      setStatus(response);
      if (onStatusChangeRef.current) {
        onStatusChangeRef.current(response);
      }
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ZohoAuthStatus.js:58',message:'error caught',data:{errorMessage:error.message,errorName:error.name,aborted:abortSignal?.aborted},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Check if request was aborted
      if (abortSignal?.aborted) {
        return;
      }
      
      console.error("Error checking Zoho auth status:", error);
      setStatus({ 
        authenticated: false, 
        error: error.message || "Failed to check authentication status",
        message: error.message || "Failed to check authentication status"
      });
      if (onStatusChangeRef.current) {
        onStatusChangeRef.current({ authenticated: false, error: error.message });
      }
    } finally {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ZohoAuthStatus.js:73',message:'finally block',data:{aborted:abortSignal?.aborted},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      if (!abortSignal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    
    // On mount, use expiration time check only (no live API call)
    checkStatus(abortController.signal, false);

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const handleAuthorize = () => {
    window.location.href = `/api/zoho/auth/authorize?service=${service}`;
  };

  const handleRevoke = async () => {
    if (!confirm(`Are you sure you want to revoke authentication for Zoho ${service}?`)) {
      return;
    }

    setRevoking(true);
    try {
      await apiClient.post("/zoho/auth/revoke", { service });
      toast.success(`Authentication revoked for Zoho ${service}`);
      await checkStatus();
    } catch (error) {
      toast.error(`Failed to revoke: ${error.message}`);
    } finally {
      setRevoking(false);
    }
  };

  const handleRefreshToken = async () => {
    setRefreshing(true);
    try {
      const response = await apiClient.post("/zoho/auth/refresh", { service });
      if (response.success) {
        toast.success(response.message || `Token refreshed successfully for Zoho ${service}`);
        // Refresh status to show updated token details
        await checkStatus();
      } else {
        toast.error(response.error || "Failed to refresh token");
      }
    } catch (error) {
      toast.error(`Failed to refresh token: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm"></span>
        <span className="text-sm opacity-70">Checking status...</span>
      </div>
    );
  }

  const isAuthenticated = status?.authenticated === true;

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 p-3 rounded-lg ${
        isAuthenticated
          ? "bg-success/20 text-success"
          : "bg-error/20 text-error"
      }`}>
        <span className="font-semibold">
          {isAuthenticated ? "✓ Authenticated" : "✗ Not Authenticated"}
        </span>
        {status?.message && (
          <span className="text-sm opacity-80">{status.message}</span>
        )}
      </div>

      {/* Token Details Section */}
      {isAuthenticated && status?.tokenDetails && (
        <div className="card card-border bg-base-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Token Details</h4>
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => setShowTokenDetails(!showTokenDetails)}
            >
              {showTokenDetails ? "Hide" : "Show"} Details
            </button>
          </div>
          
          {showTokenDetails && (
            <div className="space-y-3 text-sm">
              {/* Access Token */}
              <div>
                <div className="font-medium mb-1">Access Token:</div>
                <div className="bg-base-200 p-2 rounded font-mono text-xs break-all">
                  {status.tokenDetails.accessTokenFull || status.tokenDetails.accessToken || "N/A"}
                </div>
                {status.tokenDetails.expiresAt && (
                  <div className="text-xs opacity-70 mt-1">
                    Expires: {new Date(status.tokenDetails.expiresAt).toLocaleString()}
                    {status.tokenDetails.isExpired && (
                      <span className="text-error ml-2">(Expired)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Refresh Token */}
              <div>
                <div className="font-medium mb-1">Refresh Token:</div>
                {status.tokenDetails.refreshTokenFull ? (
                  <>
                    <div className="bg-base-200 p-2 rounded font-mono text-xs break-all">
                      {status.tokenDetails.refreshTokenFull}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      (Does not expire)
                    </div>
                  </>
                ) : (
                  <div className="text-xs opacity-70">Not available</div>
                )}
              </div>

              {/* Metadata */}
              {status.tokenDetails.metadata && Object.keys(status.tokenDetails.metadata).length > 0 && (
                <div>
                  <div className="font-medium mb-1">Metadata:</div>
                  <div className="bg-base-200 p-2 rounded text-xs">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(status.tokenDetails.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {!isAuthenticated ? (
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAuthorize}
            >
              Authorize with Zoho {service}
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleRefreshToken}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh Token"}
            </button>
          </div>
        ) : (
          <>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => checkStatus(null, true)}
              disabled={loading}
            >
              Refresh Status
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleRefreshToken}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh Token"}
            </button>
            <button
              className="btn btn-error btn-sm"
              onClick={handleRevoke}
              disabled={revoking}
            >
              {revoking ? "Revoking..." : "Revoke"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
