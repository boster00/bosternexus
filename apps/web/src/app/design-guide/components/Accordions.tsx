'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

const frequentFaqs = [
  {
    question: 'Lorem Ipsum dolor amet consectetur adipiscing elit',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rutrum nisi nec eros posuere, vel malesuada felis bibendum. Duis ullamcorper auctor justo, eget eleifend est fringilla id. Nullam accumsan, purus ut ultrices fermentum, tortor ipsum congue ipsum, vitae scelerisque velit justo quis purus. Fusce eu lobortis metus, ut tristique ipsum. Nullam pretium orci id dictum tincidunt. Donec vitae arcu eu leo malesuada luctus. Sed dapibus elit et magna ultricies, id sodales ipsum consequat. Nulla vulputate, sem ut condimentum fringilla, nibh odio fermentum sapien, non malesuada neque ipsum et diam.'
  },
  {
    question: 'Lorem Ipsum dolor amet consectetur adipiscing elit',
    answer: ''
  },
  {
    question: 'Lorem Ipsum dolor amet consectetur adipiscing elit',
    answer: ''
  }
];

const customerFaqs = [
  {
    question: 'What Are CD68 Macrophages?',
    answer: 'CD68 is a protein highly expressed by cells in the monocyte lineage by circulating macrophages, and by tissue macrophages such as Kupffer cells, microglia.',
    askedDate: '2021-10-20',
    answeredDate: '2021-10-20',
    askedBy: 'Verified customer',
    answeredBy: 'Boster Scientific Support'
  }
];

export default function Accordions() {
  const [expandedFrequent, setExpandedFrequent] = useState<Set<number>>(new Set([0]));
  const [expandedCustomer, setExpandedCustomer] = useState<Set<number>>(new Set());

  const toggleFrequent = (index: number) => {
    const newExpanded = new Set(expandedFrequent);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFrequent(newExpanded);
  };

  const toggleCustomer = (index: number) => {
    const newExpanded = new Set(expandedCustomer);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCustomer(newExpanded);
  };

  return (
    <section className="flex flex-col gap-[50px] px-[60px] pb-20">
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
          10.Accordions
        </h2>
      </div>

      {/* Frequently FAQs */}
      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-col items-center gap-[10px]">
          <h3 className="font-josefin text-[42px] font-bold tracking-[-0.84px] text-[#144B8C]">
            Frequently Faqs
          </h3>
          <p className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
            Anticipated Questions & Suggested Answers
          </p>
        </div>

        <div className="flex flex-col gap-0 max-w-[1080px] mx-auto w-full">
          {frequentFaqs.map((faq, index) => (
            <div key={index} className="border-b border-[#C4C4C4]">
              {expandedFrequent.has(index) && faq.answer && (
                <div className="p-5 bg-white">
                  <p className="font-mulish text-base font-normal tracking-[-0.32px] leading-[22.4px] text-[#6F6F6F] border border-[#6F6F6F] p-4">
                    {faq.answer}
                  </p>
                </div>
              )}
              <button
                onClick={() => toggleFrequent(index)}
                className="w-full flex items-center justify-between p-5 bg-[#3CA9D6] hover:bg-[#2d8fb5] transition-colors"
              >
                <span className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-white">
                  {faq.question}
                </span>
                {expandedFrequent.has(index) ? (
                  <Minus className="w-3 h-3 text-white flex-shrink-0" />
                ) : (
                  <Plus className="w-3 h-3 text-white flex-shrink-0" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Customer FAQs */}
      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-col items-center gap-[10px]">
          <h3 className="font-josefin text-[42px] font-bold tracking-[-0.84px] text-[#144B8C]">
            Customer Faqs
          </h3>
          <p className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
            Customer Questions & Our Responses
          </p>
        </div>

        <div className="flex flex-col gap-10 max-w-[704px] mx-auto w-full">
          {customerFaqs.map((faq, index) => (
            <div key={index} className="flex gap-10">
              {/* Q&A Icons */}
              <div className="flex-shrink-0 w-[75px] h-[75px] rounded-[71px] bg-[#F2F2F2] flex items-center justify-center relative">
                <span className="font-josefin text-[42px] font-bold tracking-[-0.84px] text-[#144B8C] absolute left-2 top-1">
                  Q
                </span>
                <span className="font-josefin text-[42px] font-bold tracking-[-0.84px] text-[#EA8D28] absolute right-2 bottom-1">
                  A
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-[10px]">
                {/* Question */}
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="font-mulish text-sm font-normal tracking-[-0.28px] leading-[16.8px] text-[#144B8C]">
                        Asked: {faq.askedDate}
                      </span>
                      <span className="font-mulish text-sm font-normal tracking-[-0.28px] leading-[16.8px] text-[#144B8C]">
                        {faq.askedBy}
                      </span>
                    </div>
                    <span className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-[#3CA9D6]">
                      Question
                    </span>
                  </div>
                  <p className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
                    {faq.question}
                  </p>
                </div>

                {/* Answer */}
                <div className="bg-[#F2F2F2] rounded p-5 flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-[#3CA9D6]">
                      Answer
                    </span>
                    <div className="flex gap-2">
                      <span className="font-mulish text-sm font-normal tracking-[-0.28px] leading-[16.8px] text-[#144B8C]">
                        Answered: {faq.answeredDate}
                      </span>
                      <span className="font-mulish text-sm font-normal tracking-[-0.28px] leading-[16.8px] text-[#144B8C]">
                        {faq.answeredBy}
                      </span>
                    </div>
                  </div>
                  <p className="font-mulish text-base font-normal tracking-[-0.32px] leading-[22.4px] text-[#6F6F6F]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}