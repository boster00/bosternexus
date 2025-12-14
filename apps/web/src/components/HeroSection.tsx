'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative px-4 md:px-8 xl:px-[60px] py-12 md:py-16 xl:py-20 pb-16 md:pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06316e] to-[#3d87d2] rounded-br-[120px] -z-10" />
      
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 xl:gap-12 items-start mb-12 xl:mb-[60px]">
          {/* Promo Card */}
          <div className="backdrop-blur-[10px] bg-primary-light-blue/80 rounded-lg p-6 md:p-8 xl:p-[35px_32px] flex flex-col gap-4 xl:gap-5">
            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <h3 className="text-white text-xl md:text-2xl xl:text-[28px] font-bold font-body leading-tight xl:leading-[33.6px]">
                Review On Biocompare & Get $30 Amazon Gift Cards
              </h3>
              <p className="text-white text-sm md:text-base font-normal font-body leading-relaxed xl:leading-[22.4px]">
                Our partners at Biocompare offer a raffle for your review (see details in this link). Boster Bio will match each review with an additional $30, no limit!
              </p>
            </div>
            <button className="bg-primary-orange text-white border-none rounded-full px-5 py-2 xl:py-[10px] text-base font-normal font-body cursor-pointer hover:opacity-90 transition-opacity self-start shadow-md">
              Get Started
            </button>
            <div className="relative w-full h-[160px] rounded-lg overflow-hidden">
              <Image 
                src="/images/amazon-promo.jpg" 
                alt="Amazon" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="pt-0 xl:pt-[80px] flex flex-col items-center xl:items-start text-center xl:text-left">
            <h1 className="text-white text-3xl md:text-4xl xl:text-[48px] font-bold font-heading leading-tight xl:leading-[48px] uppercase mb-2 xl:mb-[10px] tracking-tight">
              ANTIBODY & ELISA<br /><span className="text-primary-orange">EXPERTS</span>
            </h1>
            <p className="text-white text-sm md:text-base font-normal font-body leading-relaxed xl:leading-[22.4px]">
              31 years designing high affinity antibodies and immunoassays. Proudly serving the brightest minds in scientific research.
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-10">
          <button className="w-4 h-2 flex items-center justify-center bg-primary-light-blue border-none text-white p-0 cursor-pointer hover:opacity-80 transition-opacity">
            <ChevronLeft size={16} />
          </button>
          <button className="w-4 h-2 flex items-center justify-center bg-primary-light-blue border-none text-white p-0 cursor-pointer hover:opacity-80 transition-opacity">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}