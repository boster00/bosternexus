import React from 'react';
import Image from 'next/image';

type CTAVariant = 'light-blue' | 'orange' | 'dark-gray';

const variants: Record<CTAVariant, { bg: string; text: string; button: string; patternLeft: string; patternRight: string }> = {
  'light-blue': {
    bg: 'bg-[#3CA9D6]',
    text: 'text-white',
    button: 'bg-white text-[#3CA9D6] hover:bg-gray-100',
    patternLeft: '/images/design-guide/pattern-light-blue.svg',
    patternRight: '/images/design-guide/pattern-light-blue-right.svg'
  },
  'orange': {
    bg: 'bg-white',
    text: 'text-[#EA8D28]',
    button: 'bg-[#EA8D28] text-white hover:bg-[#d17d1f]',
    patternLeft: '/images/design-guide/pattern-orange.svg',
    patternRight: '/images/design-guide/pattern-orange-right.svg'
  },
  'dark-gray': {
    bg: 'bg-[#6F6F6F]',
    text: 'text-white',
    button: 'bg-[#EA8D28] text-white hover:bg-[#d17d1f]',
    patternLeft: '/images/design-guide/pattern-gray.svg',
    patternRight: '/images/design-guide/pattern-gray-right.svg'
  }
};

function CTABanner({ variant }: { variant: CTAVariant }) {
  const style = variants[variant];
  
  return (
    <div className={`relative h-[200px] ${style.bg} overflow-hidden`}>
      {/* Left Pattern */}
      <div className="absolute left-0 top-0 h-full w-[267px]">
        <Image 
          src={style.patternLeft} 
          alt="" 
          fill
          className="object-cover"
        />
      </div>

      {/* Right Pattern */}
      <div className="absolute right-0 top-0 h-full w-[276px]">
        <Image 
          src={style.patternRight} 
          alt="" 
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center gap-5 px-4">
        <div className="flex flex-col items-center gap-3">
          <h3 className={`font-mulish text-[28px] font-bold tracking-[-0.56px] leading-[33.6px] ${style.text}`}>
            Did you konw?
          </h3>
          <p className={`font-mulish text-base tracking-[-0.32px] ${style.text} text-center max-w-[553px]`}>
            You can Save up to 90% on the above regerent if you buy them from Bosterbio
          </p>
        </div>
        <button className={`font-mulish text-xl font-bold tracking-[-0.4px] leading-6 px-8 py-3 rounded transition-colors ${style.button}`}>
          Check out these great deals now !
        </button>
      </div>
    </div>
  );
}

export default function CallToAction() {
  return (
    <section className="flex flex-col gap-[50px] px-[60px]">
      {/* Title */}
      <div className="flex items-center gap-[23px]">
        <Image 
          src="/images/design-guide/logo.svg" 
          alt="BOSTER" 
          width={256} 
          height={87}
          className="w-64 h-auto"
        />
        <h2 className="font-mulish text-[32px] font-normal tracking-[-0.64px] text-[#434343]">
          05.Call To Action
        </h2>
      </div>

      {/* CTA Variants */}
      <div className="flex flex-col gap-0">
        <CTABanner variant="light-blue" />
        <CTABanner variant="orange" />
        <CTABanner variant="dark-gray" />
      </div>
    </section>
  );
}