import React from 'react';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import ProductDisplay from './components/ProductDisplay';
import Tabs from './components/Tabs';
import ProductDetails from './components/ProductDetails';
import RelatedProductsCarousel from './components/RelatedProductsCarousel';
import AlphabetSearch from './components/AlphabetSearch';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

export default function ProductDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-[1200px] mx-auto px-[60px]">
        <Breadcrumb />
        <ProductDisplay />
        <Tabs />
        <ProductDetails />
      </div>
      <RelatedProductsCarousel />
      <div className="max-w-[1200px] mx-auto px-[60px]">
        <AlphabetSearch />
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
}