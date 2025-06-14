"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              CarRent
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/account" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md">
              حسابي
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M12 15l6-6M6 6l6 6" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/account"
                className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                حسابي
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
