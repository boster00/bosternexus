'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ title, content, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between py-4 hover:opacity-80 transition-opacity"
      >
        <h2 className="text-primary-light-blue font-mulish text-lg font-bold">{title}</h2>
        {isOpen ? (
          <Minus size={12} className="text-primary-light-blue" />
        ) : (
          <Plus size={12} className="text-primary-light-blue" />
        )}
      </button>
      
      {isOpen && (
        <div className="pb-6">
          {content}
        </div>
      )}
    </div>
  );
}