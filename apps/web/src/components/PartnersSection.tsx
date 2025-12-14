import Image from 'next/image';

export default function PartnersSection() {
  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] py-12 md:py-16 xl:py-[60px] text-center">
      <div className="max-w-[1920px] mx-auto">
        <h2 className="text-primary-dark-blue text-2xl md:text-3xl xl:text-[42px] font-bold font-heading mb-1">
          Partners & Customers
        </h2>
        <div className="flex justify-center mb-6 xl:mb-[30px]">
          <Image 
            src="/icons/underline-blue.svg" 
            alt="" 
            width={422} 
            height={12}
            className="w-auto h-auto"
          />
        </div>
        <div className="relative w-full h-[150px] md:h-[180px] xl:h-[210px]">
          <Image 
            src="/images/partners-logos.svg" 
            alt="Partners" 
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}