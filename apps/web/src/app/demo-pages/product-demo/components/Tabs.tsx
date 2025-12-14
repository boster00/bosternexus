'use client';

import React, { useState } from 'react';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('Product Details');
  
  const tabs = ['Product Details', 'Publications', 'Resources', 'Reviews', 'Q&A'];

  return (
    <div className="flex gap-[10px] border-b border-[#C4C4C4] mb-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-4 font-mulish text-lg font-bold relative ${
            activeTab === tab ? 'text-primary-dark-blue' : 'text-medium-gray'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-dark-blue" />
          )}
        </button>
      ))}
    </div>
  );
}