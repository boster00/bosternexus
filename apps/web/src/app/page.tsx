'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import ProductCategories from '@/components/ProductCategories';
import ServicesSection from '@/components/ServicesSection';
import LearningCenter from '@/components/LearningCenter';
import PartnersSection from '@/components/PartnersSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import GeneSearch from '@/components/GeneSearch';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-body">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <ProductCategories />
      <ServicesSection />
      <LearningCenter />
      <PartnersSection />
      <TestimonialsSection />
      <BlogSection />
      <FeaturedProducts />
      <GeneSearch />
      <Newsletter />
      <Footer />
    </div>
  );
}