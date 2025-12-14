import React from 'react';

export default function HeroSectionLeftRight() {
  return (
    <section className="flex flex-col gap-[30px]">
      {/* Buttons */}
      <div className="flex gap-5 justify-center">
        <button className="bg-[#EA8D28] text-white font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded hover:bg-[#d17d1f] transition-colors">
          Add button +
        </button>
        <button className="bg-[#EA8D28] text-white font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded hover:bg-[#d17d1f] transition-colors">
          Add PDF +
        </button>
        <button className="bg-[#EA8D28] text-white font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded hover:bg-[#d17d1f] transition-colors">
          Replace form
        </button>
        <button className="bg-[#EA8D28] text-white font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded hover:bg-[#d17d1f] transition-colors">
          Replace background
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative h-[420px] bg-gradient-to-b from-[#063172] to-[#3D87D2] overflow-hidden">
        {/* Content Container */}
        <div className="relative h-full max-w-[1200px] mx-auto px-[21px] flex items-center gap-5">
          {/* Left Content */}
          <div className="flex-1 flex flex-col gap-[10px]">
            <h1 className="font-josefin text-5xl font-bold tracking-[-0.96px] text-white uppercase">
              HERO SECTION
            </h1>
            <p className="font-mulish text-base font-normal tracking-[-0.32px] leading-[22.4px] text-white max-w-[472px]">
              To be used as the first section for a page. There should be no more than 1 hero section per page. Elements in this section: Header, Paragraph, Lists, Button.
            </p>
          </div>

          {/* Right Subheading Card */}
          <div className="w-[520px] bg-[#3CA9D6] rounded-br-[90px] p-8 flex flex-col gap-[10px]">
            <h2 className="font-mulish text-[28px] font-bold tracking-[-0.56px] leading-[33.6px] text-white">
              Subheading Section
            </h2>
            <p className="font-mulish text-base font-normal tracking-[-0.32px] leading-[22.4px] text-white">
              To be used as the first section for a page. There should be no more than 1 herosection per page. Elements in this section: Header, Paragraph, Lists, Button.
            </p>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button className="text-white font-mulish text-base tracking-[-0.32px] text-left hover:underline">
                All Primary Antibodies
              </button>
              <button className="text-white font-mulish text-base tracking-[-0.32px] text-left hover:underline">
                Monoclonal Antibodies
              </button>
              <button className="text-white font-mulish text-base tracking-[-0.32px] text-left hover:underline">
                Rabbit Monoclonal
              </button>
              <button className="text-white font-mulish text-base tracking-[-0.32px] text-left hover:underline">
                Secondary Antibodies
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}