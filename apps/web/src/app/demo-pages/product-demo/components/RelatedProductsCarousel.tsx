'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RelatedProductsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    {
      id: 1,
      name: 'Cytoplasmic and Nuclear Protein Extraction Kit (AR0106)',
      price: 50,
      image: '/images/product-demo/related-product.jpg',
    },
    {
      id: 2,
      name: 'Cytoplasmic and Nuclear Protein Extraction Kit (AR0106)',
      price: 50,
      image: '/images/product-demo/related-product.jpg',
    },
  ];

  return (
    <div className="bg-white py-12 mb-[60px]">
      <div className="max-w-[1200px] mx-auto px-[60px] relative">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-[18px] flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <ChevronLeft size={10} className="text-[#C4C4C4]" strokeWidth={3} />
        </button>

        <div className="flex flex-col gap-6">
          <h2 className="text-primary-light-blue font-mulish text-lg font-bold">
            Customers Who Bought This Also Bought
          </h2>

          <div className="flex gap-6">
            {products.map((product) => (
              <div key={product.id} className="flex gap-3 flex-1">
                <div className="w-[180px] h-[120px] rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-dark-gray font-mulish text-sm underline hover:opacity-80 cursor-pointer">
                    {product.name}
                  </h3>
                  <span className="text-primary-light-blue font-mulish text-lg font-bold">
                    ${product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? 'bg-primary-light-blue' : 'bg-[#C4C4C4]'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentSlide(Math.min(2, currentSlide + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-[18px] flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <ChevronRight size={10} className="text-[#C4C4C4]" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}