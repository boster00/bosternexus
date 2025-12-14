'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Maria Teresa Dell\'Anno',
      role: 'Postdoc',
      image: '/images/testimonial-maria.png',
      title: 'This Antibody Works Perfectly!',
      application: 'ELISA',
      material: 'Crispr MEK and STAT3 KO CAFs',
      tips: 'This kit doesn\'t provide PC',
      review: '"I used it for IHC on frozen sections at a dilution of 1:500. It did not need several trials to optimize the protocol. No bad things overall. I will purchase it again."',
      rating: 5,
    },
    {
      name: 'Dr. John Smith',
      role: 'Research Scientist',
      image: '/images/testimonial-image.png',
      title: 'Excellent Quality Product!',
      application: 'Western Blot',
      material: 'Cell lysates',
      tips: 'Works great at 1:1000 dilution',
      review: '"Outstanding antibody with clear bands and minimal background. Highly recommended for WB applications."',
      rating: 5,
    },
  ];

  const currentTestimonial = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] 2xl:px-[240px] 3xl:px-[300px] py-12 md:py-16 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <h2 className="text-primary-dark-blue text-2xl md:text-3xl xl:text-[42px] font-bold font-heading text-center mb-4 xl:mb-[15px]">
          Testimonials
        </h2>

        {/* Testimonial Card */}
        <div className="max-w-[740px] mx-auto bg-white rounded-lg xl:rounded-xl shadow-lg p-6 md:p-8 xl:p-[23px_30px] mb-4 xl:mb-[14px]">
          <div className="flex flex-col gap-4 xl:gap-[14px]">
            {/* Name and Role */}
            <div className="text-center flex flex-col gap-1 xl:gap-[6px]">
              <h3 className="text-primary-dark-blue text-xl md:text-2xl xl:text-[28px] font-bold font-body leading-tight xl:leading-[33.6px] tracking-tight">
                {currentTestimonial.name}
              </h3>
              <p className="text-medium-gray text-sm font-normal font-body leading-tight tracking-tight">
                {currentTestimonial.role}
              </p>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row gap-4 xl:gap-[24px]">
              {/* Image */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-[200px] h-[200px] relative rounded-[30px_0_30px_0] overflow-hidden">
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col gap-3 xl:gap-[10px]">
                <h4 className="text-primary-orange text-lg md:text-xl font-bold font-body leading-tight xl:leading-6">
                  {currentTestimonial.title}
                </h4>
                
                <div className="flex flex-col gap-2 xl:gap-[6px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-primary-dark-blue text-sm md:text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                      Application:
                    </span>
                    <span className="text-medium-gray text-sm md:text-base font-normal font-body tracking-tight">
                      {currentTestimonial.application}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-primary-dark-blue text-sm md:text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                      Starting Material:
                    </span>
                    <span className="text-medium-gray text-sm md:text-base font-normal font-body tracking-tight">
                      {currentTestimonial.material}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-primary-dark-blue text-sm md:text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                      Tips:
                    </span>
                    <span className="text-medium-gray text-sm md:text-base font-normal font-body tracking-tight">
                      {currentTestimonial.tips}
                    </span>
                  </div>
                </div>

                <p className="text-medium-gray text-sm md:text-base font-normal font-body leading-relaxed xl:leading-[22.4px] tracking-tight">
                  {currentTestimonial.review}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-light-gray" />

            {/* Rating */}
            <div className="flex justify-center gap-2 xl:gap-[8px]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="fill-primary-orange text-primary-orange"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 xl:gap-[8px] mb-4 xl:mb-[20px]">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary-light-blue' : 'bg-light-gray'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button className="bg-transparent border border-primary-orange rounded-full px-5 py-2 xl:py-[10px] flex items-center gap-2 xl:gap-[13px] text-primary-orange text-sm md:text-base font-normal font-body cursor-pointer hover:bg-primary-orange hover:text-white transition-all">
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}