import React from 'react';

export default function AlphabetSearch() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col gap-6 mb-[60px]">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-primary-dark-blue font-josefin text-[42px] font-bold tracking-tight">
          Search Products By A-Z genes
        </h2>
        <svg width="591" height="11" viewBox="0 0 591 11" fill="none">
          <path d="M0 5.5C0 8.53757 2.46243 11 5.5 11H585.5C588.538 11 591 8.53757 591 5.5C591 2.46243 588.538 0 585.5 0H5.5C2.46243 0 0 2.46243 0 5.5Z" fill="#3CA9D6"/>
        </svg>
      </div>

      <div className="flex flex-wrap gap-[9px] justify-center">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className="w-10 h-10 flex items-center justify-center text-primary-light-blue font-mulish text-lg font-medium hover:bg-primary-light-blue hover:text-white transition-colors rounded"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}