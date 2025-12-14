'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    name: "Maria Teresa Dell'Anno",
    role: 'Postdoc',
    image: '/images/design-guide/testimonial-image.png',
    title: 'This Antibody Works Perfectly!',
    application: 'ELISA',
    startingMaterial: 'Crispr MEK and STAT3 KO CAFs',
    tips: "This kit doesn't provide PC",
    quote: '"I used it for IHC on frozen sections at a dilution of 1:500. It did not need several trials to optimize the protocol. No bad things overall. I will purchase it again."',
    rating: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="flex flex-col gap-[15px] px-[60px]">
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
          07.Testimonials
        </h2>
      </div>

      {/* Section Title */}
      <h3 className="font-josefin text-[42px] font-bold tracking-[-0.84px] text-[#144B8C] text-center">
        Testimonials
      </h3>

      {/* Testimonial Card */}
      <div className="max-w-[740px] mx-auto">
        <div className="bg-white rounded-[20px] shadow-[0_0_40px_rgba(0,0,0,0.1)] p-10 flex flex-col gap-[14px]">
          {/* Name and Role */}
          <div className="flex flex-col gap-[10px]">
            <h4 className="font-mulish text-[28px] font-bold tracking-[-0.56px] leading-[33.6px] text-[#144B8C]">
              {testimonials[currentIndex].name}
            </h4>
            <p className="font-mulish text-sm font-normal tracking-[-0.28px] leading-[16.8px] text-[#144B8C]">
              {testimonials[currentIndex].role}
            </p>
          </div>

          {/* Content */}
          <div className="flex gap-6">
            {/* Image */}
            <div className="flex-shrink-0">
              <Image 
                src={testimonials[currentIndex].image} 
                alt={testimonials[currentIndex].name} 
                width={200} 
                height={200}
                className="rounded-[30px_0_30px_0] object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-[10px]">
              <h5 className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-[#EA8D28]">
                {testimonials[currentIndex].title}
              </h5>
              
              <div className="flex flex-col gap-[6px]">
                <div className="flex gap-2">
                  <span className="font-mulish text-base font-bold tracking-[-0.32px] leading-[19.2px] text-[#144B8C]">
                    Application:
                  </span>
                  <span className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
                    {testimonials[currentIndex].application}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-mulish text-base font-bold tracking-[-0.32px] leading-[19.2px] text-[#144B8C]">
                    Starting Material:
                  </span>
                  <span className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
                    {testimonials[currentIndex].startingMaterial}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-mulish text-base font-bold tracking-[-0.32px] leading-[19.2px] text-[#144B8C]">
                    Tips:
                  </span>
                  <span className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F]">
                    {testimonials[currentIndex].tips}
                  </span>
                </div>
              </div>

              <p className="font-mulish text-base font-normal tracking-[-0.32px] leading-[22.4px] text-[#6F6F6F] mt-2">
                {testimonials[currentIndex].quote}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F2F2F2]"></div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-[18px] h-[18px] fill-[#EA8D28] text-[#EA8D28]" 
              />
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-[#3CA9D6]"></div>
          <div className="w-2 h-2 rounded-full bg-[#C4C4C4]"></div>
          <div className="w-2 h-2 rounded-full bg-[#C4C4C4]"></div>
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-4">
        <button className="flex items-center gap-2 px-8 py-3 rounded-[63px] border border-[#EA8D28] hover:bg-[#EA8D28] group transition-colors">
          <span className="font-mulish text-base tracking-[-0.32px] text-[#EA8D28] group-hover:text-white transition-colors">
            View All
          </span>
          <ArrowRight className="w-3.5 h-2.5 text-[#EA8D28] group-hover:text-white transition-colors" />
        </button>
      </div>
    </section>
  );
}