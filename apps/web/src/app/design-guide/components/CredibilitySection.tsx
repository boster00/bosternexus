import React from 'react';
import Image from 'next/image';
import { Hourglass, BookOpen, ThumbsUp, FlaskConical } from 'lucide-react';

const stats = [
  {
    icon: Hourglass,
    value: '31Years',
    label: 'of experience'
  },
  {
    icon: BookOpen,
    value: '60000+',
    label: 'Publications'
  },
  {
    icon: ThumbsUp,
    value: '4.8/5',
    label: 'Rating on\nbiocompare.com',
    multiline: true
  },
  {
    icon: null,
    value: '20000+',
    label: 'Antibodies',
    customIcon: true
  },
  {
    icon: FlaskConical,
    value: '2000+',
    label: 'ELISA Kits'
  }
];

export default function CredibilitySection() {
  return (
    <section className="flex flex-col gap-[50px] px-[60px]">
      {/* Title */}
      <div className="flex items-center gap-[23px]">
        <Image 
          src="/images/design-guide/logo.svg" 
          alt="BOSTER" 
          width={256} 
          height={87}
          className="w-64 h-auto"
        />
        <h2 className="font-mulish text-[32px] font-normal tracking-[-0.64px] text-[#434343]">
          06.Credibility Section
        </h2>
      </div>

      {/* Stats */}
      <div className="bg-[#3CA9D6] h-40 flex items-center justify-center">
        <div className="flex items-center gap-0 max-w-[1200px] mx-auto">
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-3 px-8">
                {stat.customIcon ? (
                  <svg className="w-11 h-10" viewBox="0 0 43 40" fill="none">
                    <path d="M21.5 0L43 40H0L21.5 0Z" fill="white"/>
                  </svg>
                ) : stat.icon && (
                  <stat.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                )}
                <div className="flex flex-col items-center gap-[-3px]">
                  <span className="font-mulish text-4xl font-extrabold text-white">
                    {stat.value}
                  </span>
                  <span className={`font-mulish ${stat.multiline ? 'text-base leading-4' : 'text-base'} font-normal tracking-[-0.32px] text-white text-center whitespace-pre-line`}>
                    {stat.label}
                  </span>
                </div>
              </div>
              {index < stats.length - 1 && (
                <div className="h-[30px] w-[2px] bg-white"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}