'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, ShoppingCart, Search, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary-orange shadow-header">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-[60px] py-4 xl:py-[17px]">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/icons/logo.svg" 
              alt="Boster Bio" 
              width={138} 
              height={46}
              className="h-8 md:h-10 xl:h-[46px] w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex gap-4 xl:gap-6 flex-1 justify-center">
            {['Promotion', 'Products', 'Services', 'Support', 'Blog', 'About', 'Distributors'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-white text-base xl:text-lg font-bold font-body hover:opacity-80 transition-opacity"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 xl:gap-4">
            <button className="hidden lg:flex items-center gap-2 bg-transparent border-none text-white text-sm font-medium font-body cursor-pointer hover:opacity-80 transition-opacity">
              <User size={20} />
              <span>Sign-in</span>
            </button>
            
            <button className="relative bg-transparent border-none text-white cursor-pointer hover:opacity-80 transition-opacity">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-white text-primary-orange text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            
            <button className="flex items-center gap-2 bg-white border-2 border-primary-orange rounded-2xl px-4 xl:px-5 py-2 xl:py-[10px] text-primary-orange text-sm font-medium font-body cursor-pointer hover:bg-primary-orange hover:text-white transition-all">
              <Search size={18} />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <nav className="flex flex-col gap-3">
              {['Promotion', 'Products', 'Services', 'Support', 'Blog', 'About', 'Distributors'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-white text-base font-bold font-body hover:opacity-80 transition-opacity"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="flex items-center gap-3 mt-2 pt-3 border-t border-white/20">
                <button className="flex items-center gap-2 text-white text-sm font-medium font-body">
                  <User size={20} />
                  <span>Sign-in</span>
                </button>
                <button className="relative text-white">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-1 -right-1 bg-white text-primary-orange text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}