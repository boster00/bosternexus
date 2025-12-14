'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';

type TabName = 'Product Details' | 'Publications' | 'Resources' | 'Reviews' | 'Q&A';

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState<TabName>('Product Details');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Product Info']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

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
          04.Tabs
        </h2>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-0 border-b-2 border-gray-200">
        {(['Product Details', 'Publications', 'Resources', 'Reviews', 'Q&A'] as TabName[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-6 font-mulish text-xl font-bold tracking-[-0.4px] leading-6 transition-colors ${
              activeTab === tab
                ? 'text-[#3CA9D6] bg-white rounded-t-[20px] border-b-4 border-[#3CA9D6]'
                : 'text-[#6F6F6F] hover:text-[#3CA9D6]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex gap-5">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-[30px]">
          {/* Product Info Section */}
          <div className="rounded border border-[#C4C4C4]">
            <button
              onClick={() => toggleSection('Product Info')}
              className="w-full flex items-center justify-between p-5 bg-[#3CA9D6] rounded-t"
            >
              <h3 className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-white">
                Product Info
              </h3>
              {expandedSections.has('Product Info') ? (
                <Minus className="w-3 h-3 text-white" />
              ) : (
                <Plus className="w-3 h-3 text-white" />
              )}
            </button>
            
            {expandedSections.has('Product Info') && (
              <div className="p-5 bg-white">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-[#C4C4C4]">
                      <td className="py-3 font-mulish text-base font-bold tracking-[-0.32px] text-[#3CA9D6]">
                        Product Name
                      </td>
                      <td className="py-3 font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
                        Anti-Macrosialin CD68 Antibody<br />
                        <span className="text-[#3CA9D6] hover:underline cursor-pointer">View all CD68/SR-D1 Antibodies</span>
                      </td>
                    </tr>
                    <tr className="border-b border-[#C4C4C4]">
                      <td className="py-3 font-mulish text-base font-bold tracking-[-0.32px] text-[#3CA9D6]">
                        SKU/Catalog Number
                      </td>
                      <td className="py-3 font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
                        PA1518
                      </td>
                    </tr>
                    <tr className="border-b border-[#C4C4C4]">
                      <td className="py-3 font-mulish text-base font-bold tracking-[-0.32px] text-[#3CA9D6]">
                        Size
                      </td>
                      <td className="py-3 font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
                        100 μg/vial
                      </td>
                    </tr>
                    <tr className="border-b border-[#C4C4C4]">
                      <td className="py-3 font-mulish text-base font-bold tracking-[-0.32px] text-[#3CA9D6]">
                        Form
                      </td>
                      <td className="py-3 font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
                        Lyophilized
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button className="mt-4 font-mulish text-base font-bold tracking-[-0.32px] text-[#C4C4C4] underline hover:text-[#6F6F6F]">
                  Show More`
                </button>
              </div>
            )}
          </div>

          {/* Assay Dilution Section */}
          <div className="rounded border border-[#C4C4C4]">
            <button
              onClick={() => toggleSection('Assay Dilution')}
              className="w-full flex items-center justify-between p-5 bg-[#3CA9D6] rounded-t"
            >
              <h3 className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-white">
                Assay Dilution & Images
              </h3>
              {expandedSections.has('Assay Dilution') ? (
                <Minus className="w-3 h-3 text-white" />
              ) : (
                <Plus className="w-3 h-3 text-white" />
              )}
            </button>
          </div>

          {/* Protein Target Section */}
          <div className="rounded border border-[#C4C4C4]">
            <button
              onClick={() => toggleSection('Protein Target')}
              className="w-full flex items-center justify-between p-5 bg-[#F2F2F2] rounded-t"
            >
              <h3 className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-[#3CA9D6]">
                Protein Target Info & Infographic
              </h3>
              <Plus className="w-3 h-3 text-[#3CA9D6]" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[312px] flex flex-col gap-3">
          {/* Promo Card */}
          <div className="border border-[#C4C4C4] rounded overflow-hidden">
            <Image 
              src="/images/design-guide/promo-bogo.png" 
              alt="BOGO For Antibodies" 
              width={312} 
              height={150}
              className="w-full"
            />
          </div>

          {/* PDF Card */}
          <div className="border border-[#C4C4C4] rounded overflow-hidden">
            <Image 
              src="/images/design-guide/validation-whitepaper.png" 
              alt="Validation Whitepaper" 
              width={312} 
              height={474}
              className="w-full"
            />
          </div>

          {/* Related Products */}
          <div className="bg-[#EA8D28] text-white p-4 rounded">
            <h4 className="font-mulish text-base font-bold tracking-[-0.32px] mb-3">
              Related products
            </h4>
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-between text-left hover:underline">
                <span className="font-mulish text-base font-bold tracking-[-0.32px]">
                  More CD68/SR-D1 Products
                </span>
                <Plus className="w-3 h-3" />
              </button>
              <button className="flex items-center justify-between text-left hover:underline">
                <span className="font-mulish text-base font-bold tracking-[-0.32px]">
                  Compatible Secondaries For Host Rabbit
                </span>
                <Plus className="w-3 h-3" />
              </button>
              <button className="flex items-center justify-between text-left hover:underline">
                <span className="font-mulish text-base font-bold tracking-[-0.32px]">
                  Cytokine Research Related Products
                </span>
                <Plus className="w-3 h-3" />
              </button>
              <button className="font-mulish text-base font-bold tracking-[-0.32px] text-[#C4C4C4] underline text-left">
                Show More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}