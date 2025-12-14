import React from 'react';
import Image from 'next/image';

export default function Navigation() {
  return (
    <nav className="bg-[#EA8D28] h-20 px-11">
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between">
        <Image 
          src="/images/design-guide/logo.svg" 
          alt="BOSTER - antibody and ELISA experts" 
          width={144} 
          height={48}
          className="h-12 w-auto"
        />
        
        <div className="flex items-center gap-[7px]">
          <button className="text-white font-mulish text-xl font-bold tracking-[-0.4px] leading-6 px-4 py-2 hover:bg-white/10 rounded transition-colors">
            Parts/Components
          </button>
          <button className="text-[#EA8D28] bg-white font-mulish text-xl font-bold tracking-[-0.4px] leading-6 px-4 py-2 rounded-[20px]">
            Elements
          </button>
          <button className="text-white font-mulish text-xl font-bold tracking-[-0.4px] leading-6 px-4 py-2 hover:bg-white/10 rounded transition-colors">
            Effects /Utilities
          </button>
        </div>
      </div>
    </nav>
  );
}