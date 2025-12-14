# Image Folder Quick Reference

## 📁 Structure

```
images/
├── pages/          → Page-specific (hero, blog, services, CMS)
├── products/       → Product photos (SKU-based Magento structure)
│   └── {char1}/{char2}/  → First 2 letters of SKU
├── global/         → Logos, icons, reusable elements
└── other/          → Catch-all
```

## 🔑 Product Images (SKU-Based)

**Magento-style organization using first 2 letters of SKU:**

```
SKU: PA1012 → products/p/a/PA1012-main.jpg
SKU: BD2345 → products/b/d/BD2345-main.jpg
SKU: ELISA1 → products/e/l/ELISA1-main.jpg
```

**Naming:** `{SKU}-{type}.{ext}`

Types: `main`, `thumb`, `gallery-1`, `gallery-2`, `detail`, `package`, `label`

## 🎯 Quick Decision

| Image Type | Folder | Example |
|------------|--------|---------|
| Hero image | `pages/` | `hero-antibodies.jpg` |
| Blog image | `pages/` | `blog-post-title.jpg` |
| Service photo | `pages/` | `service-custom-antibody.jpg` |
| Product main | `products/{c1}/{c2}/` | `PA1012-main.jpg` |
| Product thumb | `products/{c1}/{c2}/` | `PA1012-thumb.jpg` |
| Product gallery | `products/{c1}/{c2}/` | `PA1012-gallery-1.jpg` |
| Logo | `global/` | `logo.svg` |
| Icon | `global/` | `icon-search.svg` |
| Badge | `global/` | `badge-certified.png` |
| Email graphic | `other/` | `email-header.jpg` |

## 💻 Code Usage

```tsx
import { ImageService } from '@/lib/image-service'

// Page images
ImageService.getPageImage('hero-main.jpg')

// Product images (by SKU - automatic path calculation)
ImageService.getProductImage('PA1012')              // main image
ImageService.getProductThumbnail('PA1012')          // thumbnail
ImageService.getProductGalleryImage('PA1012', 2)    // gallery image #2

// Global elements
ImageService.getLogo('logo.svg')
ImageService.getIcon('search.svg')
ImageService.getGlobalImage('badge.png')

// Other
ImageService.getOtherImage('temp.jpg')

// Helper: Get SKU subfolder path
ImageService.getSkuSubfolderPath('PA1012')  // Returns: "p/a"
```

## ✅ Naming

**Pages:**
- Use kebab-case: `hero-antibodies.jpg`
- Be descriptive: `blog-western-blot.jpg`

**Products:**
- Format: `{SKU}-{type}.{ext}`
- Examples: `PA1012-main.jpg`, `PA1012-thumb.jpg`, `PA1012-gallery-1.jpg`

**Global:**
- Prefix icons: `icon-search.svg`
- Include size: `logo-200w.svg`

## 📏 Sizes

- Hero: 1920x600px
- Product main: 800-1200px (1:1)
- Product thumb: 300x300px
- Icons: 24-48px (SVG)
- Compress: < 200KB

## 🔍 SKU Path Calculation

```javascript
SKU "PA1012":
  First char: 'p'
  Second char: 'a'
  Path: products/p/a/PA1012-main.jpg

SKU "BD2345":
  First char: 'b'
  Second char: 'd'
  Path: products/b/d/BD2345-main.jpg
```

---

See `README.md` for complete guide.
