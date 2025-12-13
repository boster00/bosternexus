'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>BosterNexus</h1>
          </div>
          <nav className={styles.nav}>
            <Link href="/products">Products</Link>
            <Link href="/services">Services</Link>
            <Link href="/support">Support</Link>
            <Link href="/promotions">Promotions</Link>
          </nav>
          <div className={styles.headerActions}>
            <Link href="/signin">Sign In</Link>
            <Link href="/register" className={styles.registerBtn}>Register</Link>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products, antibodies, proteins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>
      </div>

      {/* Main Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h2>Advancing Life Science Research</h2>
          <p>High-quality antibodies, proteins, and ELISA kits for your research needs</p>
          <div className={styles.bannerActions}>
            <Link href="/products" className={styles.primaryButton}>Browse Products</Link>
            <Link href="/services" className={styles.secondaryButton}>Our Services</Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className={styles.services}>
        <h2 className={styles.sectionTitle}>Our Services</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <h3>Custom Antibodies</h3>
            <p>Design and production of tailored antibodies for your specific research needs</p>
            <Link href="/services/custom-antibodies" className={styles.learnMore}>Learn More →</Link>
          </div>
          <div className={styles.serviceCard}>
            <h3>Recombinant Protein Expression</h3>
            <p>Production of proteins in various expression systems with high purity and yield</p>
            <Link href="/services/protein-expression" className={styles.learnMore}>Learn More →</Link>
          </div>
          <div className={styles.serviceCard}>
            <h3>ELISA Services</h3>
            <p>Testing samples and providing scientific consultation for your ELISA needs</p>
            <Link href="/services/elisa" className={styles.learnMore}>Learn More →</Link>
          </div>
          <div className={styles.serviceCard}>
            <h3>Western Blot Services</h3>
            <p>Competitively priced Western blot services with fast turnaround times</p>
            <Link href="/services/western-blot" className={styles.learnMore}>Learn More →</Link>
          </div>
          <div className={styles.serviceCard}>
            <h3>IHC/IF Services</h3>
            <p>Histology, immunohistochemistry, and immunofluorescence services</p>
            <Link href="/services/ihc-if" className={styles.learnMore}>Learn More →</Link>
          </div>
          <div className={styles.serviceCard}>
            <h3>AAV Packaging Services</h3>
            <p>Advanced AAV packaging technology for efficient production</p>
            <Link href="/services/aav" className={styles.learnMore}>Learn More →</Link>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className={styles.products}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productsGrid}>
          <div className={styles.productCard}>
            <div className={styles.productImage}>ELISA Kit</div>
            <h3>ELISA Kits</h3>
            <p>High sensitivity ELISA kits for various targets</p>
            <div className={styles.productActions}>
              <Link href="/products/elisa-kits" className={styles.learnMore}>Learn More</Link>
              <Link href="/products/elisa-kits" className={styles.buyNow}>Buy Now</Link>
            </div>
          </div>
          <div className={styles.productCard}>
            <div className={styles.productImage}>Antibody</div>
            <h3>Antibodies</h3>
            <p>Monoclonal and polyclonal antibodies for research</p>
            <div className={styles.productActions}>
              <Link href="/products/antibodies" className={styles.learnMore}>Learn More</Link>
              <Link href="/products/antibodies" className={styles.buyNow}>Buy Now</Link>
            </div>
          </div>
          <div className={styles.productCard}>
            <div className={styles.productImage}>Protein</div>
            <h3>Proteins</h3>
            <p>Recombinant proteins with high purity and activity</p>
            <div className={styles.productActions}>
              <Link href="/products/proteins" className={styles.learnMore}>Learn More</Link>
              <Link href="/products/proteins" className={styles.buyNow}>Buy Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Resources */}
      <section className={styles.resources}>
        <h2 className={styles.sectionTitle}>Educational Resources</h2>
        <div className={styles.resourcesGrid}>
          <Link href="/resources/western-blotting" className={styles.resourceCard}>
            <h3>Western Blotting</h3>
            <p>Application resource center</p>
          </Link>
          <Link href="/resources/elisa" className={styles.resourceCard}>
            <h3>ELISA</h3>
            <p>Application resource center</p>
          </Link>
          <Link href="/resources/flow-cytometry" className={styles.resourceCard}>
            <h3>Flow Cytometry</h3>
            <p>Application resource center</p>
          </Link>
          <Link href="/resources/pcr" className={styles.resourceCard}>
            <h3>PCR</h3>
            <p>Application resource center</p>
          </Link>
        </div>
      </section>

      {/* Promotions */}
      <section className={styles.promotions}>
        <h2 className={styles.sectionTitle}>Current Promotions</h2>
        <div className={styles.promotionCard}>
          <h3>Top ELISA Kits - Special Discount</h3>
          <p>Get up to 20% off on our best-selling ELISA kits. Limited time offer!</p>
          <Link href="/promotions" className={styles.primaryButton}>View Promotions</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>Email: info@bosternexus.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Research Blvd, Science City, SC 12345</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <Link href="/products">Products</Link>
            <Link href="/services">Services</Link>
            <Link href="/support">Support</Link>
            <Link href="/about">About Us</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/sitemap">Sitemap</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Follow Us</h4>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 BosterNexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

