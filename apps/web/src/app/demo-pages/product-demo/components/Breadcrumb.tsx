import React from 'react';

export default function Breadcrumb() {
  const breadcrumbs = [
    { label: 'Home', href: '#', active: false },
    { label: 'Primary Antibodies', href: '#', active: false },
    { label: 'CD68 Antibodies', href: '#', active: false },
    { label: 'Anti-Macrosialin CD68 Antibody', href: '#', active: true },
  ];

  return (
    <div className="flex items-center gap-[6px] py-5 flex-wrap">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-[#C4C4C4] font-mulish text-sm">/</span>}
          <a
            href={crumb.href}
            className={`font-mulish text-sm ${
              crumb.active ? 'text-medium-gray' : 'text-primary-dark-blue hover:underline'
            }`}
          >
            {crumb.label}
          </a>
        </React.Fragment>
      ))}
    </div>
  );
}