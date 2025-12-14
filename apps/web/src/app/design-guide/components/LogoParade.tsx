import React from 'react';
import Image from 'next/image';

export default function LogoParade() {
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
          9.Logo Parade
        </h2>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-[10px]">
        <div className="flex flex-col items-center">
          <h3 className="font-josefin text-[42px] font-bold tracking-[-0.84px] text-[#144B8C]">
            Partners & Customers
          </h3>
          <div className="w-[422px] h-3 bg-[#EA8D28] rounded-full mt-1"></div>
        </div>

        {/* Logo Grid */}
        <div className="mt-6 w-full max-w-[1080px]">
          <Image 
            src="/images/design-guide/partner-logos.svg" 
            alt="Partners & Customers" 
            width={1080} 
            height={330}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}