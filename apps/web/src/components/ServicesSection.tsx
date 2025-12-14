import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    { icon: '/icons/service-custom-antibodies.svg', title: 'Custom Antibodies Services', w: 96, h: 88 },
    { icon: '/icons/service-protein-expression.svg', title: 'Protein Expression', w: 93, h: 93 },
    { icon: '/icons/service-elisa.svg', title: 'ELISA Services', w: 105, h: 82 },
    { icon: '/icons/service-western-blot.svg', title: 'Western Blot Services', w: 88, h: 88 },
    { icon: '/icons/service-ihc-if.svg', title: 'IHC/IF Services', w: 90, h: 90 },
    { icon: '/icons/service-aav.svg', title: 'AAV Packaging Services', w: 93, h: 95 },
  ];

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] py-12 md:py-16 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6 xl:mb-[30px]">
          <h2 className="text-primary-dark-blue text-2xl md:text-3xl xl:text-[42px] font-bold font-heading mb-1">
            Services
          </h2>
          <div className="flex justify-center mb-2 xl:mb-[10px]">
            <Image 
              src="/icons/underline-blue.svg" 
              alt="" 
              width={156} 
              height={12}
              className="w-auto h-auto"
            />
          </div>
          <p className="text-medium-gray text-sm md:text-base font-normal font-body tracking-tight">
            Mouse over one of the services below to see more information
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6 mb-5 xl:mb-[15px]">
          {services.map((service, i) => (
            <div 
              key={i} 
              className="bg-light-gray rounded-[60px_0_0_0] xl:rounded-[90px_0_0_0] p-6 md:p-8 xl:p-[56px_24px] flex flex-col items-center justify-between gap-3 xl:gap-4 text-center cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all min-h-[200px] xl:min-h-[256px]"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 xl:w-auto xl:h-auto relative flex items-center justify-center">
                <Image 
                  src={service.icon} 
                  alt="" 
                  width={service.w} 
                  height={service.h}
                  className="w-full h-full xl:w-auto xl:h-auto object-contain"
                />
              </div>
              <h3 className="text-primary-light-blue xl:text-primary-orange text-base md:text-lg xl:text-xl font-bold font-body leading-tight xl:leading-6 tracking-tight">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="flex items-center justify-center gap-10 xl:gap-[40px]">
          <button className="hidden xl:flex w-4 h-2 items-center justify-center bg-divider-gray hover:bg-primary-light-blue border-none text-white p-0 cursor-pointer transition-colors">
            <ChevronLeft size={16} />
          </button>
          
          <button className="bg-transparent border border-primary-orange rounded-full px-5 py-2 xl:py-[10px] flex items-center gap-2 xl:gap-[13px] text-primary-orange text-sm md:text-base font-normal font-body cursor-pointer hover:bg-primary-orange hover:text-white transition-all">
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
          
          <button className="hidden xl:flex w-4 h-2 items-center justify-center bg-primary-light-blue border-none text-white p-0 cursor-pointer hover:opacity-80 transition-opacity">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}