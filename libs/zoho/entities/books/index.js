/**
 * Books Entities Index
 * 
 * Exports all Zoho Books entity classes
 */

// Core entities
export { BooksItemEntity } from './BooksItemEntity';
export { BooksContactEntity } from './BooksContactEntity';

// Transaction entities
export { BooksInvoiceEntity } from './BooksInvoiceEntity';
export { BooksSalesOrderEntity } from './BooksSalesOrderEntity';
export { BooksPurchaseOrderEntity } from './BooksPurchaseOrderEntity';
export { BooksBillEntity } from './BooksBillEntity';
export { BooksEstimateEntity } from './BooksEstimateEntity';
export { BooksCreditNoteEntity } from './BooksCreditNoteEntity';

// Unified line item entity (replaces separate item entities)
export { BooksLineItemEntity } from './BooksLineItemEntity';
