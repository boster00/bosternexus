/**
 * Backward compatibility export
 * 
 * This file re-exports from the new libs/zoho/ structure
 * to maintain compatibility with existing imports.
 * 
 * New code should import directly from @/libs/zoho (which resolves to index.js)
 */

export { default } from "./zoho/index";
export { Zoho } from "./zoho/index";
