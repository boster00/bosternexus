import React from 'react';
import Image from 'next/image';
import { User, ShoppingCart, Search } from 'lucide-react';

export default function Header() {
  const navItems = ['Promotion', 'Products', 'Services', 'Support', 'Blog', 'About', 'Distributors'];

  return (
    <header className="bg-primary-orange h-20">
      <div className="max-w-[1200px] mx-auto px-[60px] h-full flex items-center justify-between">
        <Image
          src="/images/product-demo/logo.svg"
          alt="BOSTER - antibody and ELISA experts"
          width={138}
          height={46}
          className="h-12 w-auto"
        />

        <nav className="flex items-center gap-7">
          {navItems.map((item) => (
            <button
              key={item}
              className="text-white font-mulish text-lg font-bold hover:opacity-80 transition-opacity"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-white hover:opacity-80 transition-opacity">
            <User size={20} strokeWidth={2} />
          </button>
          <button className="text-white hover:opacity-80 transition-opacity">
            <ShoppingCart size={20} strokeWidth={2} />
          </button>
          <button className="text-white hover:opacity-80 transition-opacity">
            <Search size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}