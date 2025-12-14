'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

export default function LearningCenter() {
  const [activeTab, setActiveTab] = useState('IHC');

  const tabs = ['IHC', 'WB', 'ELISA', 'FC', 'PCR', 'Ebook'];
  
  const leftItems = [
    'IHC/ICC/IF Resource Center',
    'IHC/ICC/IF Principle',
    'IHC/ICC/IF Sample Preparation',
  ];
  
  const rightItems = [
    'IHC/ICC/IF Protocol',
    'IHC/ICC/IF Optimization Tips',
    'IHC/ICC/IF Troubleshooting Tips',
  ];

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] py-12 md:py-16 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6 xl:mb-[30px]">
          <h2 className="text-primary-dark-blue text-2xl md:text-3xl xl:text-[42px] font-bold font-heading mb-1">
            Learning Center
          </h2>
          <div className="flex justify-center mb-2 xl:mb-[10px]">
            <Image 
              src="/icons/underline-blue.svg" 
              alt="" 
              width={240} 
              height={12}
              className="w-auto h-auto"
            />
          </div>
          <p className="text-medium-gray text-sm md:text-base font-normal font-body tracking-tight">
            Welcome to Dr. Booster's Life Science lab! Here you can learn about different methods and tools
          </p>
        </div>

        {/* Content */}
        <div className="bg-light-gray rounded-[0_0_60px_0] xl:rounded-[0_0_120px_0] overflow-hidden">
          {/* Tabs */}
          <div className="bg-primary-light-blue backdrop-blur-[34px] shadow-xl p-2 xl:p-[10px] flex flex-wrap gap-2 xl:gap-[10px]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[80px] xl:min-w-0 bg-transparent border-none px-4 xl:px-5 py-2 xl:py-[10px] text-sm xl:text-sm font-bold font-body cursor-pointer transition-colors rounded-lg xl:rounded-[20px_0_0_0] ${
                  activeTab === tab 
                    ? 'text-primary-light-blue bg-white' 
                    : 'text-light-gray hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="p-6 md:p-8 xl:p-10 grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-6 xl:gap-[20px]">
            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <h3 className="text-primary-dark-blue text-xl md:text-2xl xl:text-[28px] font-bold font-body leading-tight xl:leading-[33.6px] tracking-tight">
                Immunohistochemistry
              </h3>
              <p className="text-medium-gray text-sm md:text-base font-normal font-body leading-relaxed xl:leading-[22.4px] tracking-tight">
                The most common histology methods used for research are Immunohistochemistry, Immunofluorescence and Immunocytochemistry
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-[20px] mt-3 xl:mt-5">
                <div className="flex flex-col gap-3 xl:gap-[10px]">
                  {leftItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 xl:gap-[10px]">
                      <Check size={21} className="text-primary-orange flex-shrink-0 mt-0.5" />
                      <span className="text-primary-orange text-sm md:text-base font-normal font-body tracking-tight hover:underline cursor-pointer">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 xl:gap-[10px]">
                  {rightItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 xl:gap-[10px]">
                      <Check size={21} className="text-primary-orange flex-shrink-0 mt-0.5" />
                      <span className="text-primary-orange text-sm md:text-base font-normal font-body tracking-tight hover:underline cursor-pointer">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="hidden xl:block relative w-full h-[360px]">
              <Image 
                src="/images/learning-illustration.svg" 
                alt="Learning" 
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}