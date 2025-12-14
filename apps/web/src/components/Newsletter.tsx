'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
  };

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] 2xl:px-[240px] 3xl:px-[300px] py-8 md:py-12 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        <div className="bg-primary-light-blue/80 backdrop-blur-[10px] rounded-[60px_0_0_0] p-6 md:p-8 xl:p-[40px] flex flex-col md:flex-row items-center gap-6 xl:gap-[100px]">
          {/* Icon and Text */}
          <div className="flex items-center gap-4 xl:gap-[20px] flex-1">
            <div className="flex-shrink-0">
              <Image
                src="/icons/newsletter-icon.svg"
                alt="Newsletter"
                width={56}
                height={56}
                className="w-12 h-12 md:w-14 md:h-14 xl:w-14 xl:h-14"
              />
            </div>
            <div className="flex flex-col gap-1 xl:gap-[4px]">
              <h3 className="text-white text-xl md:text-2xl xl:text-[28px] font-bold font-body leading-tight xl:leading-[33.6px]">
                Subscribe to our newsletter
              </h3>
              <p className="text-white text-sm md:text-base font-normal font-body tracking-tight">
                Stay in touch with us to get latest news and special offers
              </p>
            </div>
          </div>

          {/* Subscribe Form */}
          <form onSubmit={handleSubmit} className="w-full md:w-auto flex-shrink-0">
            <div className="relative flex items-center bg-white rounded-full border border-primary-light-blue overflow-hidden">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 md:px-6 xl:px-[25px] py-3 xl:py-[13px] text-medium-gray text-sm font-medium font-body tracking-tight border-none outline-none min-w-[200px] md:min-w-[300px]"
                required
              />
              <button
                type="submit"
                className="bg-primary-orange text-white border-none rounded-full px-6 md:px-8 xl:px-[30px] py-3 xl:py-[13px] text-sm font-medium font-body cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}