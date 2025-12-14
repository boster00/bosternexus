'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';

export default function Sidebar() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    'More CD68/SR-D1 Products',
    'Compatible Secondaries For Host Rabbit',
    'Cytokine Research Related Products',
  ];

  return (
    <div className="w-[312px] flex flex-col gap-[12px]">
      {/* BOGO Promotion */}
      <div className="relative h-[150px] rounded overflow-hidden">
        <Image
          src="/images/product-demo/bogo-mascot.png"
          alt="BOGO For Antibodies"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/80 to-transparent p-6 flex flex-col justify-center gap-[6px]">
          <h3 className="text-white font-mulish text-base font-bold leading-tight">
            BOGO For<br />Antibodies
          </h3>
          <button className="text-white font-mulish text-sm underline hover:opacity-80 text-left">
            Learn More
          </button>
        </div>
      </div>

      {/* Whitepaper PDF */}
      <div className="border border-[#C4C4C4] rounded overflow-hidden">
        <Image
          src="/images/product-demo/whitepaper-preview.png"
          alt="Validation Whitepaper For CD68/SR-D1"
          width={312}
          height={474}
          className="w-full h-auto"
        />
      </div>

      {/* Related Products */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-primary-orange font-mulish text-base font-bold">Related products</h3>
        
        <div className="flex flex-col">
          {categories.map((category) => (
            <div key={category} className="border-b border-[#C4C4C4] last:border-b-0">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full flex items-center justify-between py-3 hover:bg-light-gray transition-colors"
              >
                <span className="text-primary-orange font-mulish text-base font-bold">{category}</span>
                <Plus size={12} className="text-primary-orange" />
              </button>
            </div>
          ))}
        </div>
        
        <button className="text-[#C4C4C4] font-mulish text-base font-bold underline hover:opacity-80 text-left">
          Show More
        </button>
      </div>
    </div>
  );
}