# BosterNexus Image Organization Guide

## 📁 Simplified Folder Structure

```
media/images/
├── pages/              # Page-specific content
│   └── [hero, banners, categories, blog, services, CMS content]
│
├── products/           # Product images (SKU-based Magento structure)
│   ├── p/a/            # SKUs starting with "PA..."
│   ├── b/d/            # SKUs starting with "BD..."
│   ├── e/l/            # SKUs starting with "EL..."
│   └── [a-z]/[a-z]/    # First two letters of SKU (lowercase)
│
├── global/             # Reusable elements
│   └── [logos, icons, UI elements, badges, certifications]
│
└── other/              # Catch-all for edge cases
    └── [temporary, email templates, social media, misc]
```

---

## 🎯 What Goes Where?

### **pages/** - Any page-specific content
Use this for images that belong to specific pages or content:
- ✅ Hero section images
- ✅ Banner images for categories
- ✅ Blog post featured images
- ✅ Service page photos
- ✅ CMS content images
- ✅ Team photos (about page)
- ✅ Promotional banners
- ✅ Category landing page images
- ✅ Resource/guide images

**Examples:**
```
pages/hero-antibodies.jpg
pages/banner-spring-sale.jpg
pages/blog-western-blot-guide.jpg
pages/service-custom-antibody.jpg
pages/team-photo-dr-smith.jpg
```

---

### **products/** - Product catalog images (SKU-based)

**🔑 Magento-Style Organization**

Product images are organized using the **first two letters of the SKU** as nested subfolders:

```
SKU: PA1012 → products/p/a/PA1012-main.jpg
SKU: BD2345 → products/b/d/BD2345-main.jpg
SKU: ELISA1 → products/e/l/ELISA1-main.jpg
SKU: A123   → products/a/1/A123-main.jpg
```

**Why this structure?**
- ✅ Prevents directory bloat (thousands of files in one folder)
- ✅ Deterministic (path can be calculated from SKU)
- ✅ Scales infinitely
- ✅ Performance: Filesystems handle 100-1000 files per directory better
- ✅ Industry standard (used by Magento, OpenCart)

**Image naming convention:**
```
{SKU}-{type}.{ext}

Types:
- main      : Primary product image
- thumb     : Thumbnail (300x300)
- gallery-1 : Additional gallery image #1
- gallery-2 : Additional gallery image #2
- gallery-3 : etc.
- detail    : Detail/close-up shot
- package   : Package/box image
- label     : Product label
```

**Examples:**
```
products/p/a/PA1012-main.jpg      (primary image)
products/p/a/PA1012-thumb.jpg     (thumbnail)
products/p/a/PA1012-gallery-1.jpg (additional view)
products/p/a/PA1012-gallery-2.jpg (additional view)
products/b/d/BD2345-main.jpg
products/b/d/BD2345-thumb.jpg
products/e/l/ELISA1-main.jpg
products/e/l/ELISA1-detail.jpg
```

**Size recommendations:**
- Thumbnail: 300x300px
- Main: 800x800px or 1200x1200px
- Gallery: 800x800px or 1200x1200px

---

### **global/** - Reusable elements
Images used across multiple pages or globally:
- ✅ Company logos (various sizes/colors)
- ✅ UI icons (search, cart, menu, etc.)
- ✅ Partner logos (logo parade)
- ✅ Certification badges
- ✅ Trust badges (secure payment, etc.)
- ✅ UI elements (patterns, dividers)
- ✅ Placeholder images

**Examples:**
```
global/logo.svg
global/logo-white.svg
global/icon-search.svg
global/icon-cart.svg
global/partner-university-1.png
global/badge-iso-certified.png
global/placeholder-product.jpg
```

---

### **other/** - Catch-all for edge cases
Use sparingly for things that don't fit elsewhere:
- ✅ Temporary uploads
- ✅ Email newsletter graphics
- ✅ Social media assets (if not also on web)
- ✅ Testing/staging assets
- ✅ Legacy/archived images

**Examples:**
```
other/email-template-header.jpg
other/social-media-facebook-post.jpg
other/temp-upload-pending-approval.jpg
```

---

## 🎨 Naming Conventions

### General Rules
1. **Use kebab-case**: `hero-antibody-research.jpg` ✅ (not `Hero_Antibody_Research.jpg` ❌)
2. **Be descriptive**: `blog-western-blot-tutorial.jpg` ✅ (not `img001.jpg` ❌)
3. **Include dimensions for variants**: `logo-200w.svg`, `banner-1920x400.jpg`
4. **Use prefixes for clarity**: `icon-search.svg`, `badge-iso.png`
5. **Version numbers if needed**: `hero-main-v2.jpg`

### Product Image Naming

**Format:** `{SKU}-{type}.{ext}`

**SKU:** Product SKU (e.g., PA1012, BD2345, ELISA1)
**Type:** Image type descriptor
- `main` - Primary product image (required)
- `thumb` - Thumbnail
- `gallery-{n}` - Additional views (gallery-1, gallery-2, etc.)
- `detail` - Close-up/detail shot
- `package` - Product packaging
- `label` - Product label

**Examples:**
```
✅ PA1012-main.jpg
✅ PA1012-thumb.jpg
✅ PA1012-gallery-1.jpg
✅ PA1012-gallery-2.jpg
✅ BD2345-main.jpg
✅ BD2345-detail.jpg
✅ ELISA1-main.jpg
✅ ELISA1-package.jpg

❌ pa1012_image.jpg
❌ product1.jpg
❌ IMG_0001.jpg
```

### Format Examples

**Pages:**
```
✅ pages/hero-main-research.jpg
✅ pages/banner-category-elisa-kits.jpg
✅ pages/blog-post-protein-expression.jpg
✅ pages/service-western-blot-lab.jpg
✅ pages/team-dr-jane-smith.jpg
```

**Global:**
```
✅ global/logo.svg
✅ global/logo-white.svg
✅ global/logo-icon-only.svg
✅ global/icon-search.svg
✅ global/icon-cart-24.svg
✅ global/partner-mit-logo.png
✅ global/badge-certified.png
```

**Other:**
```
✅ other/email-newsletter-header.jpg
✅ other/social-facebook-promotion.jpg
✅ other/temp-staging-test.jpg
```

---

## 📐 Recommended Image Sizes

### Page Images
| Type | Size | Ratio | Format |
|------|------|-------|--------|
| Hero sections | 1920x600px | 16:5 | JPEG/WebP |
| Banners | 1920x400px | - | JPEG/WebP |
| Blog featured | 1200x630px | 1.91:1 | JPEG |
| Service photos | 800x600px | 4:3 | JPEG |
| Team headshots | 400x400px | 1:1 | JPEG |

### Product Images
| Type | Size | Ratio | Format |
|------|------|-------|--------|
| Thumbnails | 300x300px | 1:1 | JPEG/WebP |
| Main | 800-1200px | 1:1 | JPEG/WebP |
| Gallery | 800-1200px | 1:1 | JPEG/WebP |
| Detail | 800-1200px | varies | JPEG/WebP |

### Global Elements
| Type | Size | Format |
|------|------|--------|
| Logos | Multiple | SVG preferred |
| Icons | 24px, 32px, 48px | SVG |
| Badges | 100-200px width | PNG (transparent) |

---

## 🎯 Format Guidelines

### JPEG (.jpg)
**Best for:**
- ✅ Photos (products, team, services)
- ✅ Hero images
- ✅ Complex imagery with many colors

**Not for:**
- ❌ Logos (use SVG)
- ❌ Icons (use SVG)
- ❌ Images needing transparency (use PNG)

### PNG (.png)
**Best for:**
- ✅ Images with transparency
- ✅ Screenshots
- ✅ Logos (if SVG not available)
- ✅ Badges and certifications

**Not for:**
- ❌ Large photos (use JPEG)

### SVG (.svg)
**Best for:**
- ✅ Logos
- ✅ Icons
- ✅ Simple illustrations
- ✅ Anything needing perfect scaling

**Not for:**
- ❌ Photos
- ❌ Complex imagery

### WebP (.webp)
**Best for:**
- ✅ Modern alternative to JPEG/PNG
- ✅ Better compression
- ✅ Use with fallbacks

---

## 🚀 Usage in Code

### Using ImageService (Recommended)

```tsx
import Image from 'next/image'
import { ImageService } from '@/lib/image-service'

// Page hero image
<Image 
  src={ImageService.getPageImage('hero-antibodies.jpg')}
  alt="Antibody Research"
  width={1920}
  height={600}
  priority
/>

// Product main image (by SKU)
<Image 
  src={ImageService.getProductImage('PA1012')}
  alt="BDNF ELISA Kit"
  width={800}
  height={800}
/>

// Product thumbnail (by SKU)
<Image 
  src={ImageService.getProductThumbnail('PA1012')}
  alt="BDNF ELISA Kit"
  width={300}
  height={300}
/>

// Product gallery image
<Image 
  src={ImageService.getProductGalleryImage('PA1012', 2)}
  alt="BDNF ELISA Kit - View 2"
  width={800}
  height={800}
/>

// Logo
<Image 
  src={ImageService.getLogo('logo.svg')}
  alt="BosterNexus"
  width={200}
  height={50}
/>

// Icon
<Image 
  src={ImageService.getIcon('search.svg')}
  alt="Search"
  width={24}
  height={24}
/>
```

### Direct Paths (Alternative)

```tsx
// Product image (manual path calculation)
<Image 
  src="/media/images/products/p/a/PA1012-main.jpg"
  alt="Product"
  width={800}
  height={800}
/>

// But using ImageService is recommended!
```

---

## 📊 SKU Subfolder Distribution

The first two letters create a distribution:

```
a/a, a/b, a/c ... a/z   (26 folders)
b/a, b/b, b/c ... b/z   (26 folders)
...
z/a, z/b, z/c ... z/z   (26 folders)
= 676 possible subfolder combinations
```

For numeric SKUs:
```
1/2, 1/3, 1/4 ...
2/1, 2/3, 2/4 ...
= 100 combinations for digits (0-9)
```

This keeps each subfolder manageable even with 100,000+ products!

---

## 📊 Optimization Checklist

Before adding any image:

- [ ] **Compress the image** (use TinyPNG, Squoosh.app)
- [ ] **Use correct dimensions** (don't upload 4000px for 400px display)
- [ ] **Choose correct format** (JPEG for photos, SVG for logos/icons)
- [ ] **Use descriptive filename** (follow naming convention)
- [ ] **Place in correct folder** (calculate SKU path for products)
- [ ] **Add alt text** when using in code
- [ ] **Target size**: < 200KB for hero, < 100KB for thumbnails

---

## 🔍 Quick Decision Tree

**Where should my image go?**

```
Is it a product photo?
  YES → products/{first-char}/{second-char}/{SKU}-{type}.jpg
       Example: PA1012 → products/p/a/PA1012-main.jpg
  NO  ↓

Is it used across multiple pages? (logo, icon, badge)
  YES → global/
  NO  ↓

Is it for a specific page? (hero, banner, blog, service)
  YES → pages/
  NO  ↓

Doesn't fit anywhere?
  → other/
```

---

## 🛠️ Helper Functions

### Calculate SKU Path (for uploads/scripts)

```javascript
function getSkuPath(sku) {
  const skuLower = sku.toLowerCase();
  const firstChar = skuLower.charAt(0);
  const secondChar = skuLower.charAt(1) || firstChar;
  return `products/${firstChar}/${secondChar}`;
}

// Examples:
getSkuPath('PA1012') // → "products/p/a"
getSkuPath('BD2345') // → "products/b/d"
getSkuPath('ELISA1') // → "products/e/l"
```

---

## 📝 Examples by Use Case

### Product Page
```
products/p/a/PA1012-main.jpg          (primary image, 800x800)
products/p/a/PA1012-thumb.jpg         (thumbnail, 300x300)
products/p/a/PA1012-gallery-1.jpg     (additional view)
products/p/a/PA1012-gallery-2.jpg     (additional view)
products/p/a/PA1012-detail.jpg        (close-up)
global/badge-fast-shipping.png        (trust badge)
global/icon-cart.svg                  (add to cart icon)
```

### Homepage
```
pages/hero-main-antibodies.jpg        (hero section)
global/logo.svg                        (header logo)
global/icon-search.svg                 (search icon)
products/p/a/PA1012-thumb.jpg         (featured product)
products/b/d/BD2345-thumb.jpg         (featured product)
global/partner-mit-logo.png           (partner logos)
```

### Blog Post
```
pages/blog-western-blot-guide.jpg      (featured image)
pages/blog-wb-step1.jpg                (inline images)
global/logo-white.svg                  (footer logo)
```

---

## 🔒 Git Management

### For Small Repos (< 100 products)
✅ Commit images directly to Git

### For Large Repos
Consider Git LFS for files > 1MB:

```bash
# Install Git LFS
git lfs install

# Track image files
git lfs track "*.jpg"
git lfs track "*.png"
git lfs track "*.webp"
```

### Future CDN Migration
- Static images (pages/, global/) → Stay in Git
- Product images → Move to Cloudflare R2 or CDN
- SKU-based structure remains the same on CDN
- ImageService will handle transition transparently

---

## 💡 Tips

1. **Use ImageService.getProductImage(sku)** - Automatic path calculation
2. **Compress before upload** - Faster load times
3. **Use SVG for logos/icons** - Scalable and small
4. **Consistent naming** - Follow {SKU}-{type}.{ext} format
5. **Review periodically** - Remove unused images
6. **Automate uploads** - Script to place images in correct SKU folders

---

## 🆘 Questions?

- **What about products with short SKUs?** - If SKU is 1 char, use it twice (A → a/a/)
- **Special characters in SKU?** - Use URL-safe encoding or strip special chars
- **Bulk uploads?** - Create script using `ImageService.getSkuSubfolderPath(sku)`
- **Large catalogs?** - This structure scales to millions of products
- **Migrating from thumbnails/full-size?** - Use script to reorganize by SKU

For architecture questions, see: `ARCHITECTURE_GUIDE.md`
