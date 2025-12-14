import React from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const services = [
  {
    title: 'Custom Antibodies Services',
    icon: '/images/design-guide/antibodies-icon.svg',
    color: 'blue'
  },
  {
    title: 'Protein Expression',
    icon: '/images/design-guide/protein-icon.svg',
    color: 'orange'
  },
  {
    title: 'ELISA Services',
    icon: '/images/design-guide/elisa-icon.svg',
    color: 'blue'
  },
  {
    title: 'Western Blot Services',
    icon: '/images/design-guide/western-blot-icon.svg',
    color: 'orange'
  }
];

export default function CardDeck() {
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
          03.Card Deck
        </h2>
      </div>

      {/* Services Section */}
      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex flex-col items-center">
            <h3 className="font-josefin text-[42px] font-bold tracking-[-0.84px] text-[#144B8C]">
              Services
            </h3>
            <div className="w-[422px] h-3 bg-[#EA8D28] rounded-full mt-1"></div>
          </div>
          <p className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F] text-center">
            Mouse over one of the services below to see more information
          </p>
        </div>

        {/* Service Cards */}
        <div className="relative">
          <div className="grid grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[#F2F2F2] rounded-tl-[90px] p-8 flex flex-col items-center gap-4 h-64 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex-1 flex items-center justify-center">
                  <Image 
                    src={service.icon} 
                    alt={service.title} 
                    width={96} 
                    height={96}
                    className="w-24 h-24"
                  />
                </div>
                <h4 className={`font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-center ${
                  service.color === 'blue' ? 'text-[#3CA9D6]' : 'text-[#EA8D28]'
                }`}>
                  {service.title}
                </h4>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  service.color === 'blue' ? 'bg-[#3CA9D6]' : 'bg-[#EA8D28]'
                } group-hover:scale-110 transition-transform`}>
                  <Image 
                    src={service.color === 'blue' ? '/images/design-guide/arrow-down-blue.svg' : '/images/design-guide/arrow-down-orange.svg'} 
                    alt="" 
                    width={28} 
                    height={26}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#BABABA] flex items-center justify-center hover:bg-[#a0a0a0] transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#3CA9D6] flex items-center justify-center hover:bg-[#2d8fb5] transition-colors">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button className="flex items-center gap-2 px-8 py-3 rounded-[63px] border border-[#EA8D28] hover:bg-[#EA8D28] group transition-colors">
            <span className="font-mulish text-base tracking-[-0.32px] text-[#EA8D28] group-hover:text-white transition-colors">
              View All
            </span>
            <ArrowRight className="w-3.5 h-2.5 text-[#EA8D28] group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
}