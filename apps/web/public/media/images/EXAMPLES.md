# ImageService Usage Examples

## Product Images (SKU-Based)

```tsx
import Image from 'next/image'
import { ImageService } from '@/lib/image-service'

export default function ProductPage({ product }) {
  return (
    <div>
      {/* Main product image - automatic SKU path calculation */}
      <Image 
        src={ImageService.getProductImage(product.sku)}
        alt={product.name}
        width={800}
        height={800}
      />
      
      {/* Thumbnail */}
      <Image 
        src={ImageService.getProductThumbnail(product.sku)}
        alt={product.name}
        width={300}
        height={300}
      />
      
      {/* Gallery images */}
      {[1, 2, 3].map(index => (
        <Image 
          key={index}
          src={ImageService.getProductGalleryImage(product.sku, index)}
          alt={`${product.name} - View ${index}`}
          width={800}
          height={800}
        />
      ))}
    </div>
  )
}
```

## Product Card Component

```tsx
import { ImageService } from '@/lib/image-service'
import Image from 'next/image'

interface ProductCardProps {
  sku: string;
  name: string;
  price: number;
}

export default function ProductCard({ sku, name, price }: ProductCardProps) {
  return (
    <div className="product-card">
      {/* Thumbnail automatically goes to correct SKU folder */}
      <Image 
        src={ImageService.getProductThumbnail(sku)}
        alt={name}
        width={300}
        height={300}
      />
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  )
}

// Usage:
<ProductCard sku="PA1012" name="BDNF ELISA Kit" price={299.99} />
// Image path: /media/images/products/p/a/PA1012-thumb.jpg
```

## Product Grid

```tsx
import { ImageService } from '@/lib/image-service'

export default function ProductGrid({ products }) {
  return (
    <div className="grid">
      {products.map(product => (
        <div key={product.sku}>
          <Image 
            src={ImageService.getProductThumbnail(product.sku)}
            alt={product.name}
            width={300}
            height={300}
          />
          <h3>{product.name}</h3>
          <p>SKU: {product.sku}</p>
        </div>
      ))}
    </div>
  )
}

// Example data:
const products = [
  { sku: 'PA1012', name: 'BDNF ELISA Kit' },      // → products/p/a/PA1012-thumb.jpg
  { sku: 'BD2345', name: 'BDNF Antibody' },       // → products/b/d/BD2345-thumb.jpg
  { sku: 'ELISA1', name: 'ELISA Kit Standard' },  // → products/e/l/ELISA1-thumb.jpg
]
```

## Product Detail Page with Gallery

```tsx
'use client';

import { useState } from 'react';
import { ImageService } from '@/lib/image-service'
import Image from 'next/image'

export default function ProductDetail({ product }) {
  const [selectedImage, setSelectedImage] = useState('main');
  
  const galleryImages = ['main', 'gallery-1', 'gallery-2', 'gallery-3'];
  
  return (
    <div>
      {/* Main display */}
      <Image 
        src={ImageService.getProductImage(product.sku, selectedImage)}
        alt={product.name}
        width={800}
        height={800}
      />
      
      {/* Thumbnail gallery */}
      <div className="thumbnails">
        {galleryImages.map(type => (
          <button 
            key={type}
            onClick={() => setSelectedImage(type)}
          >
            <Image 
              src={ImageService.getProductImage(product.sku, type)}
              alt={`${product.name} - ${type}`}
              width={100}
              height={100}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
```

## Page Images

```tsx
import { ImageService } from '@/lib/image-service'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div>
      {/* Hero image */}
      <Image 
        src={ImageService.getPageImage('hero-antibodies.jpg')}
        alt="Antibody Research"
        width={1920}
        height={600}
        priority
      />
      
      {/* Service photos */}
      <Image 
        src={ImageService.getPageImage('service-custom-antibody.jpg')}
        alt="Custom Antibody Service"
        width={800}
        height={600}
      />
    </div>
  )
}
```

## Blog Post

```tsx
import { ImageService } from '@/lib/image-service'

export default function BlogPost({ post }) {
  return (
    <article>
      {/* Featured image */}
      <Image 
        src={ImageService.getPageImage(`blog-${post.slug}-featured.jpg`)}
        alt={post.title}
        width={1200}
        height={630}
      />
      
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

## Global Header Component

```tsx
import { ImageService } from '@/lib/image-service'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header>
      {/* Logo */}
      <Link href="/">
        <Image 
          src={ImageService.getLogo('logo.svg')}
          alt="BosterNexus"
          width={200}
          height={50}
        />
      </Link>
      
      {/* Icons */}
      <button>
        <Image 
          src={ImageService.getIcon('search.svg')}
          alt="Search"
          width={24}
          height={24}
        />
      </button>
      
      <button>
        <Image 
          src={ImageService.getIcon('cart.svg')}
          alt="Cart"
          width={24}
          height={24}
        />
      </button>
    </header>
  )
}
```

## Search Results with Products

```tsx
import { ImageService } from '@/lib/image-service'

export default function SearchResults({ results }) {
  return (
    <div className="search-results">
      {results.map(item => (
        <div key={item.sku} className="result-card">
          {/* Product thumbnail - SKU-based path */}
          <Image 
            src={ImageService.getProductThumbnail(item.sku)}
            alt={item.name}
            width={150}
            height={150}
          />
          <h3>{item.name}</h3>
          <p>SKU: {item.sku}</p>
          <p>${item.price}</p>
        </div>
      ))}
    </div>
  )
}
```

## Meta Tags (SEO) with Product

```tsx
import { ImageService } from '@/lib/image-service'

export async function generateMetadata({ params }) {
  const product = await getProduct(params.sku)
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [
        ImageService.getFullUrl(
          ImageService.getProductImage(product.sku)
        )
      ]
    }
  }
}
```

## Upload Helper (Backend/Admin)

```typescript
import { ImageService } from '@/lib/image-service'
import fs from 'fs'
import path from 'path'

async function uploadProductImage(sku: string, file: File, type: string = 'main') {
  // Get the correct subfolder path
  const subfolderPath = ImageService.getSkuSubfolderPath(sku);
  // subfolderPath = "p/a" for SKU "PA1012"
  
  const fullPath = path.join(
    process.cwd(),
    'public/media/images/products',
    subfolderPath
  );
  
  // Create directories if they don't exist
  await fs.promises.mkdir(fullPath, { recursive: true });
  
  // Save file
  const filename = `${sku}-${type}.jpg`;
  const filePath = path.join(fullPath, filename);
  
  await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  
  return ImageService.getProductImage(sku, type);
}

// Usage:
await uploadProductImage('PA1012', imageFile, 'main');
// Saves to: public/media/images/products/p/a/PA1012-main.jpg
```

## Bulk Image Organization Script

```typescript
// Script to organize existing product images by SKU
import { ImageService } from '@/lib/image-service'
import fs from 'fs'
import path from 'path'

async function organizeProductImages() {
  const products = await getProductsFromDatabase();
  
  for (const product of products) {
    const sku = product.sku;
    const subfolderPath = ImageService.getSkuSubfolderPath(sku);
    
    // Create target directory
    const targetDir = path.join(
      'public/media/images/products',
      subfolderPath
    );
    await fs.promises.mkdir(targetDir, { recursive: true });
    
    // Move images
    const types = ['main', 'thumb', 'gallery-1', 'gallery-2'];
    for (const type of types) {
      const oldPath = `old-location/${sku}-${type}.jpg`;
      const newPath = path.join(targetDir, `${sku}-${type}.jpg`);
      
      if (fs.existsSync(oldPath)) {
        await fs.promises.rename(oldPath, newPath);
        console.log(`Moved: ${sku}-${type}.jpg → ${subfolderPath}/`);
      }
    }
  }
}
```

## Related Products Component

```tsx
import { ImageService } from '@/lib/image-service'

export default function RelatedProducts({ relatedSkus }) {
  return (
    <div className="related-products">
      <h3>Related Products</h3>
      <div className="grid">
        {relatedSkus.map(sku => (
          <div key={sku}>
            <Image 
              src={ImageService.getProductThumbnail(sku)}
              alt={`Product ${sku}`}
              width={200}
              height={200}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Usage:
<RelatedProducts relatedSkus={['PA1012', 'BD2345', 'ELISA1']} />
// Automatically resolves to correct paths:
// - products/p/a/PA1012-thumb.jpg
// - products/b/d/BD2345-thumb.jpg
// - products/e/l/ELISA1-thumb.jpg
```

## Cart Items with Images

```tsx
import { ImageService } from '@/lib/image-service'

export default function CartItem({ item }) {
  return (
    <div className="cart-item">
      <Image 
        src={ImageService.getProductThumbnail(item.sku)}
        alt={item.name}
        width={80}
        height={80}
      />
      <div>
        <h4>{item.name}</h4>
        <p>SKU: {item.sku}</p>
        <p>Qty: {item.quantity}</p>
      </div>
    </div>
  )
}
```
