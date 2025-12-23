'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ButtonAccount from './ButtonAccount';
import logo from '@/app/icon.png';
import config from '@/config';

const navLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
  },
  {
    href: '/zoho-test',
    label: 'Zoho Test',
  },
  {
    href: '/freezer',
    label: 'Freezer Printer',
  },
  {
    href: '/webpage-editor',
    label: 'Webpage Editor',
  },
];

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Fixed Logo with Dropdown Button */}
      <div className="fixed top-0 left-0 z-50 no-print-nav">
        <div className="relative">
          {/* Logo Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-white shadow-lg hover:shadow-xl transition-shadow p-2 border-r border-b border-gray-200 rounded-br-lg"
            aria-label="Toggle navigation"
            style={{ borderRadius: '0 0 0.5rem 0' }}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="h-10 w-auto"
              width={200}
              height={60}
              priority
              style={{ objectFit: 'contain' }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 w-64 bg-white rounded-br-lg rounded-bl-lg shadow-xl border-r border-b border-l border-gray-200 overflow-hidden">
              {/* Navigation Links */}
              <nav className="py-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Account Button */}
              <div className="p-4">
                <ButtonAccount />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop (close menu when clicking outside) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
