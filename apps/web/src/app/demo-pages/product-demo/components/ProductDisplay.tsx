'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FileText, ChevronDown, Minus, Plus, ShoppingCart, ArrowRight, CircleCheck } from 'lucide-react';

export default function ProductDisplay() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedSku, setSelectedSku] = useState('PA1518');
  const [selectedSize, setSelectedSize] = useState('100μg');
  const [selectedSecondary, setSelectedSecondary] = useState('none');

  const images = [
    { id: 0, url: '/images/product-demo/product-image-1.jpg', alt: 'Product image 1' },
    { id: 1, url: '/images/product-demo/product-image-2.jpg', alt: 'Product image 2' },
    { id: 2, url: '/images/product-demo/product-image-3.jpg', alt: 'Product image 3' },
  ];

  const productIcons = [
    { icon: FileText, label: 'Citations (56)', color: '#3CA9D6' },
    { icon: FileText, label: 'Protocols', color: '#3CA9D6' },
    { icon: FileText, label: 'Q&A (10)', color: '#3CA9D6' },
    { icon: FileText, label: 'Datasheet', color: '#144B8C' },
    { icon: FileText, label: 'MSDS', color: '#144B8C' },
    { icon: FileText, label: 'Request COA', color: '#144B8C' },
  ];

  return (
    <div className="flex gap-6 mb-[60px]">
      {/* Left Column - Image Gallery */}
      <div className="flex flex-col gap-5">
        <div className="flex gap-3">
          <div className="flex flex-col gap-[6px]">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.id)}
                className={`w-[88px] h-[89px] border rounded overflow-hidden ${
                  selectedImage === img.id ? 'border-primary-dark-blue' : 'border-[#C4C4C4]'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={88}
                  height={89}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            <div className="w-[88px] h-[88px] border border-[#C4C4C4] rounded flex items-center justify-center bg-light-gray">
              <span className="text-dark-gray font-mulish text-base text-center leading-tight">
                +5<br />images
              </span>
            </div>
          </div>
          <div className="w-[430px] h-[372px] border border-[#C4C4C4] rounded overflow-hidden relative">
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].alt}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-primary-orange text-white px-3 py-1 rounded-full font-mulish text-sm font-bold">
              TOP SELLER
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-[7px]">
          {productIcons.map((item, index) => (
            <button
              key={index}
              className="flex items-center gap-[7px] hover:opacity-80 transition-opacity"
            >
              <item.icon size={14} color={item.color} fill={item.color} />
              <span className="text-primary-dark-blue font-mulish text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column - Buy Box */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex flex-col gap-[10px]">
          <h1 className="text-primary-dark-blue font-mulish text-[32px] font-bold leading-tight tracking-tight">
            Anti-Macrosialin CD68 Antibody
          </h1>
          <div className="flex items-center gap-[10px]">
            <span className="text-medium-gray font-mulish text-base">CD68/SR-D1 Antibody</span>
            <div className="bg-primary-light-blue rounded-[53px] px-3 py-1 flex items-center gap-[6px]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L10.3511 5.52786L16 6.32295L12 10.4721L12.9442 16L8 13.5279L3.05573 16L4 10.4721L0 6.32295L5.64886 5.52786L8 0Z" fill="white"/>
              </svg>
              <span className="text-white font-mulish text-sm">94/100   146 citation</span>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-[#C4C4C4]" />

        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-[10px]">
            <label className="text-medium-gray font-mulish text-base">Sku:</label>
            <div className="relative">
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-[300px] h-10 px-4 pr-10 border border-[#C4C4C4] rounded text-medium-gray font-mulish text-sm appearance-none cursor-pointer"
              >
                <option value="PA1518">PA1518</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-dark-blue" size={11} />
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex flex-col gap-[10px]">
              <label className="text-medium-gray font-mulish text-base">Size:</label>
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-[120px] h-10 px-4 pr-10 border border-[#C4C4C4] rounded text-medium-gray font-mulish text-sm appearance-none cursor-pointer"
                >
                  <option value="100μg">100μg</option>
                  <option value="50μg">50μg</option>
                  <option value="200μg">200μg</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-dark-blue" size={11} />
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              <label className="text-medium-gray font-mulish text-base">Quantity:</label>
              <div className="flex items-center border border-[#C4C4C4] rounded h-10">
                <button
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-primary-dark-blue hover:bg-light-gray"
                >
                  <Minus size={24} />
                </button>
                <span className="w-12 text-center text-medium-gray font-mulish text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-primary-dark-blue hover:bg-light-gray"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-medium-gray font-mulish text-base">Free Secondary Antibody:</label>
            <div className="flex gap-3">
              {[
                { value: 'none', label: 'I do not want\nfree secondary ab' },
                { value: 'BA1054', label: 'BA1054 HRP\nconjugated' },
                { value: 'BA1003', label: 'BA1003 Biotin\nconjugated' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedSecondary(option.value)}
                  className={`flex-1 h-10 px-4 border rounded text-sm font-mulish whitespace-pre-line leading-tight flex items-center justify-center ${
                    selectedSecondary === option.value
                      ? 'border-primary-dark-blue bg-primary-dark-blue/5 text-medium-gray'
                      : 'border-[#C4C4C4] text-medium-gray hover:border-primary-dark-blue'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-primary-orange font-mulish text-base">Price:</span>
            <span className="text-primary-orange font-mulish text-[28px] font-bold">$370</span>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <CircleCheck size={20} className="text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" />
              <p className="text-medium-gray font-mulish text-sm leading-tight">
                3+ in stock in USA, Ships Next Business Day. 1 in stock in Europe, Ships Next Business Day.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-primary-orange text-white rounded h-12 flex items-center justify-center gap-2 hover:bg-primary-orange/90 transition-colors">
                <span className="font-mulish text-base">Add to cart</span>
                <ShoppingCart size={24} />
              </button>
              <button className="flex-1 border-2 border-primary-orange text-primary-orange rounded h-12 flex items-center justify-center gap-2 hover:bg-primary-orange/5 transition-colors">
                <span className="font-mulish text-base">Get A Quote</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}