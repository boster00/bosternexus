import React from 'react';
import Image from 'next/image';

const steps = [
  {
    number: 1,
    title: 'Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut\naliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    number: 2,
    title: 'Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut\naliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    number: 3,
    title: 'Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut\naliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    number: 4,
    title: 'Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut\naliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    number: 5,
    title: 'Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut\naliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
];

export default function StepwiseWorkflow() {
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
          8.A Stepwise Workflow
        </h2>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5">
        <h3 className="font-mulish text-[28px] font-bold tracking-[-0.56px] leading-[33.6px] text-[#EA8D28] text-center">
          A Stepwise Workflow
        </h3>
        <p className="font-mulish text-base tracking-[-0.32px] text-[#6F6F6F] text-center">
          This is used for listing out steps with brief description. Each row can accommodate one short paragraph and no other elements.
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-5 max-w-[1082px] mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-5">
              {/* Number and Line */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-[38px] h-[38px] rounded-full bg-[#3CA9D6] flex items-center justify-center">
                  <span className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-white">
                    {step.number}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-[2px] flex-1 min-h-[130px] bg-[#3CA9D6]"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-[10px] pb-5">
                <h4 className="font-mulish text-xl font-bold tracking-[-0.4px] leading-6 text-[#3CA9D6]">
                  {step.title}
                </h4>
                <p className="font-mulish text-base font-normal tracking-[-0.32px] leading-[22.4px] text-[#6F6F6F]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}