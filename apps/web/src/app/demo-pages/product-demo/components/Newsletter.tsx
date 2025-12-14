import React from 'react';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <div className="bg-primary-light-blue/80 backdrop-blur-[10px] py-8 mb-0">
      <div className="max-w-[1200px] mx-auto px-[60px] flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <Mail size={32} className="text-primary-light-blue" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-white font-mulish text-[28px] font-bold">Subscribe to our newsletter</h3>
            <p className="text-white font-mulish text-base">Stay in touch with us to get latest news and special offers</p>
          </div>
        </div>

        <div className="flex items-center gap-0 bg-white rounded-[40px] border border-primary-light-blue overflow-hidden">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-[300px] px-6 py-3 font-mulish text-sm text-medium-gray outline-none"
          />
          <button className="bg-primary-orange text-white px-6 py-3 font-mulish text-sm font-medium hover:bg-primary-orange/90 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}