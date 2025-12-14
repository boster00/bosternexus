'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type ColumnLayout = '1' | '1:1' | '1:1:1' | '2:1';

export default function LayoutGrids() {
  const [activeLayout, setActiveLayout] = useState<ColumnLayout>('1');
  const [activeTab, setActiveTab] = useState<string>('Text');

  return (
    <section className="flex flex-col gap-[30px] px-[60px]">
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
          02.Layout Grids
        </h2>
      </div>

      {/* Section Content */}
      <div className="flex flex-col gap-[30px]">
        {/* Centered Title */}
        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex flex-col items-center">
            <h3 className="font-josefin text-[42px] font-bold tracking-[-0.84px] text-[#144B8C]">
              Centered Title H2
            </h3>
            <div className="w-60 h-3 bg-[#EA8D28] rounded-full mt-1"></div>
          </div>
          <p className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F] text-center">
            Centered title marks the beginning of a new major section.
          </p>
        </div>

        {/* Layout Tabs */}
        <div className="flex gap-[120px] border-b-2 border-gray-200">
          {(['1', '1:1', '1:1:1', '2:1'] as ColumnLayout[]).map((layout) => (
            <button
              key={layout}
              onClick={() => setActiveLayout(layout)}
              className={`pb-4 font-mulish text-xl font-bold tracking-[-0.4px] leading-6 transition-colors ${
                activeLayout === layout
                  ? 'text-[#3CA9D6] border-b-4 border-[#3CA9D6]'
                  : 'text-[#6F6F6F] hover:text-[#3CA9D6]'
              }`}
            >
              {layout} Columns
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-[30px]">
          {/* Sub Tabs */}
          <div className="flex gap-5">
            {['Text', 'Link list', 'Table', 'Grid'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded transition-colors ${
                  activeTab === tab
                    ? 'bg-[#EA8D28] text-white'
                    : 'text-[#EA8D28] border border-[#EA8D28] hover:bg-[#EA8D28] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="bg-[#6F6F6F] text-white font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded hover:bg-[#5a5a5a] transition-colors">
              Delete button -
            </button>
          </div>

          {/* 1 Column Content */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-[10px]">
              <h4 className="font-mulish text-[28px] font-bold tracking-[-0.56px] leading-[33.6px] text-[#3CA9D6]">
                1 Columns
              </h4>
              <p className="font-mulish text-sm font-normal tracking-[-0.28px] leading-[16.8px] text-[#C4C4C4]">
                Sub header should be expanding on the main idea , delete if not needed
              </p>
            </div>
            
            <p className="font-mulish text-base font-normal tracking-[-0.32px] leading-[22.4px] text-[#6F6F6F]">
              Sub header should be expanding on the main idea . Can be used to feature plain contents. Elements included in this section: Header, Paragraphc, Table, Lists, Button. Remove any elements if not needed.
            </p>

            <button className="bg-[#EA8D28] text-white font-mulish text-base font-normal tracking-[-0.32px] leading-[12.8px] px-6 py-3 rounded self-start hover:bg-[#d17d1f] transition-colors">
              Remove the button if not needed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}