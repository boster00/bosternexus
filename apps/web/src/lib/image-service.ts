/**
 * ImageService - Centralized image URL management
 * 
 * Simplified folder structure:
 * - pages/     : Page-specific content (hero, banners, CMS, categories, blog, services)
 * - products/  : Product images (organized by SKU - Magento style)
 * - global/    : Reusable elements (logos, icons, UI components)
 * - other/     : Catch-all for edge cases
 */

const MEDIA_BASE = '/media/images';

export class ImageService {
  /**
   * PAGES - Any page-specific content
   * Use for: hero sections, banners, category pages, blog posts, service pages, CMS content
   */
  static getPageImage(filename: string): string {
    return `${MEDIA_BASE}/pages/${filename}`;
  }

  /**
   * PRODUCTS - Product images (Magento-style SKU-based organization)
   * 
   * Images are organized by first two letters of SKU:
   * - SKU "PA1012" → /products/p/a/PA1012-image.jpg
   * - SKU "BD2345" → /products/b/d/BD2345-thumb.jpg
   * 
   * This prevents having thousands of files in one directory.
   */
  static getProductImagePath(sku: string, filename: string): string {
    const skuLower = sku.toLowerCase();
    const firstChar = skuLower.charAt(0);
    const secondChar = skuLower.charAt(1) || firstChar; // Fallback if SKU is 1 char
    
    return `${MEDIA_BASE}/products/${firstChar}/${secondChar}/${filename}`;
  }

  /**
   * Get product image by SKU and type
   * @param sku - Product SKU (e.g., "PA1012")
   * @param type - Image type: "main", "thumb", "gallery-1", etc.
   */
  static getProductImage(sku: string, type: string = 'main'): string {
    const filename = `${sku}-${type}.jpg`;
    return this.getProductImagePath(sku, filename);
  }

  /**
   * Get product thumbnail
   * @param sku - Product SKU
   */
  static getProductThumbnail(sku: string): string {
    return this.getProductImage(sku, 'thumb');
  }

  /**
   * Get product gallery images
   * @param sku - Product SKU
   * @param index - Gallery image index (1, 2, 3, etc.)
   */
  static getProductGalleryImage(sku: string, index: number): string {
    return this.getProductImage(sku, `gallery-${index}`);
  }

  /**
   * GLOBAL - Reusable elements used across the site
   * Use for: logos, icons, UI elements, partner badges, certifications
   */
  static getLogo(filename: string = 'logo.svg'): string {
    return `${MEDIA_BASE}/global/${filename}`;
  }

  static getIcon(filename: string): string {
    return `${MEDIA_BASE}/global/${filename}`;
  }

  static getGlobalImage(filename: string): string {
    return `${MEDIA_BASE}/global/${filename}`;
  }

  /**
   * OTHER - Catch-all for edge cases
   * Use for: temporary uploads, email templates, social media assets, etc.
   */
  static getOtherImage(filename: string): string {
    return `${MEDIA_BASE}/other/${filename}`;
  }

  /**
   * Helper: Get full URL (useful for meta tags, social sharing)
   */
  static getFullUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}${path}`;
  }

  /**
   * Helper: Get SKU subfolder path (for uploads or file management)
   * @param sku - Product SKU
   * @returns Subfolder path like "p/a" for SKU "PA1012"
   */
  static getSkuSubfolderPath(sku: string): string {
    const skuLower = sku.toLowerCase();
    const firstChar = skuLower.charAt(0);
    const secondChar = skuLower.charAt(1) || firstChar;
    return `${firstChar}/${secondChar}`;
  }

  /**
   * Helper: Build responsive srcSet for different sizes
   * Example: getResponsiveSrcSet('hero-banner.jpg', [640, 1024, 1920])
   */
  static getResponsiveSrcSet(basePath: string, sizes: number[]): string {
    return sizes
      .map(size => {
        const filename = basePath.replace(/(\.[^.]+)$/, `-${size}w$1`);
        return `${filename} ${size}w`;
      })
      .join(', ');
  }
}
