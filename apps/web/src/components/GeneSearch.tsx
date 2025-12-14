import Image from 'next/image';
import Link from 'next/link';

export default function GeneSearch() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] 2xl:px-[240px] 3xl:px-[300px] py-12 md:py-16 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6 xl:mb-[30px]">
          <h2 className="text-primary-dark-blue text-2xl md:text-3xl xl:text-[42px] font-bold font-heading mb-1">
            Search Products By A-Z genes
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-[591px] h-[11px] border-t-[0.75px] border-primary-light-blue" />
          </div>
        </div>

        {/* Alphabet Grid */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 xl:gap-[9px]">
          {alphabet.map((letter) => (
            <Link
              key={letter}
              href={`/products/genes/${letter.toLowerCase()}`}
              className="w-10 h-10 md:w-12 md:h-12 xl:w-auto xl:h-auto xl:min-w-[40px] flex items-center justify-center text-primary-light-blue text-lg md:text-xl xl:text-xl font-medium font-body hover:bg-primary-light-blue hover:text-white rounded-lg transition-all cursor-pointer"
            >
              {letter}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}