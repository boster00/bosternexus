import React from 'react';
import Image from 'next/image';

export default function HeroSectionCentered() {
  return (
    <section className="flex flex-col gap-[30px]">
      {/* Title */}
      <div className="flex items-center gap-[23px] px-[60px]">
        <Image 
          src="/images/design-guide/logo.svg" 
          alt="BOSTER" 
          width={256} 
          height={87}
          className="w-64 h-auto"
        />
        <h2 className="font-source text-[32px] font-normal tracking-[-0.64px] text-[#434343]">
          01.Hero Sections
        </h2>
      </div>

      {/* Buttons */}
      <div className="flex gap-5 justify-center">
        <button className="bg-[#EA8D28] text-white font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded hover:bg-[#d17d1f] transition-colors">
          Add button +
        </button>
        <button className="bg-[#EA8D28] text-white font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded hover:bg-[#d17d1f] transition-colors">
          Replace background
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative h-[390px] bg-gradient-to-b from-[#063172] to-[#3D87D2] overflow-hidden">
        {/* Star pattern background */}
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/design-guide/star-pattern.svg" 
            alt="" 
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center gap-[10px] px-4">
          <h1 className="font-josefin text-5xl font-bold tracking-[-0.96px] text-white uppercase text-center">
            HERO SECTION
          </h1>
          <p className="font-mulish text-base font-normal tracking-[-0.32px] leading-[22.4px] text-white text-center max-w-[704px]">
            To be used as the first section for a page. There should be no more than 1 hero section per page. Elements in this section: Header, Paragraph, Lists, Button.
          </p>
        </div>

        {/* Decorative illustration */}
        <div className="absolute right-20 bottom-0">
          <Image 
            src="/images/design-guide/hero-illustration.svg" 
            alt="" 
            width={200} 
            height={200}
            className="w-auto h-48"
          />
        </div>
      </div>
    </section>
  );
}