'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductCategories() {
  const [activeCategory, setActiveCategory] = useState('Antibodies');

  const categories = [
    { name: 'Antibodies', active: true },
    { name: 'ELISA Kits', active: false },
    { name: 'Recombinant Proteins', active: false },
    { name: 'Reagents Kits', active: false },
  ];

  const categoryContent = {
    title: 'Primary And Secondary Antibodies',
    description: 'Boster Bio offers over 16,000 antibodies that have been validated for IHC, WB, ELISA, and FC in human, mouse, and rat samples. Rabbit and mouse monoclonal antibodies as well as rabbit polyclonal antibodies are available. Buy a primary antibody and get a secondary antibody for free!',
    tags: ['All Primary Antibodies', 'Monoclonal Antibodies', 'Rabbit Monoclonal', 'Secondary Antibodies'],
  };

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] py-12 md:py-16 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6 xl:gap-8">
          {/* Categories Sidebar */}
          <div className="flex flex-col gap-6 xl:gap-[30px]">
            <div className="flex flex-col gap-1">
              <h2 className="text-primary-dark-blue text-2xl md:text-3xl xl:text-[42px] font-bold font-heading leading-tight tracking-tight">
                Product Categories
              </h2>
              <Image 
                src="/icons/underline-orange.svg" 
                alt="" 
                width={368}
                height={27}
                className="w-auto h-auto"
              />
            </div>
            
            <div className="flex flex-col gap-2 xl:gap-[10px]">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`${
                    activeCategory === cat.name 
                      ? 'bg-primary-orange' 
                      : 'bg-primary-dark-blue'
                  } text-white border-none px-4 xl:px-5 py-3 xl:py-4 text-left text-lg md:text-xl xl:text-[26px] font-bold xl:font-medium font-body cursor-pointer hover:opacity-90 transition-all rounded-none`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category Content */}
          <div className="bg-primary-light-blue rounded-[0_0_60px_0] xl:rounded-[0_0_120px_0] p-6 md:p-8 xl:p-10 flex flex-col gap-5 xl:gap-[20px]">
            <h3 className="text-white text-xl md:text-2xl xl:text-[28px] font-bold font-body leading-tight xl:leading-[33.6px] tracking-tight">
              {categoryContent.title}
            </h3>
            <p className="text-white text-sm md:text-base font-normal font-body leading-relaxed xl:leading-[22.4px] tracking-tight">
              {categoryContent.description}
            </p>
            <div className="flex flex-wrap gap-3 xl:gap-4">
              {categoryContent.tags.map((label) => (
                <span 
                  key={label} 
                  className="bg-primary-orange text-white px-4 md:px-5 xl:px-6 py-2 xl:py-3 rounded-full text-sm md:text-base font-normal font-body leading-4"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}