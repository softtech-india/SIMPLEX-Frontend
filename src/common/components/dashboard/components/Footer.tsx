import { Heart } from 'lucide-react';
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            SIMPLEX V1.1
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="text-gray-600 hidden sm:block">
            Simplex Electrical Engineering Pvt. Ltd.
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>© {currentYear} Softtech.</span>
          <span className="hidden sm:flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}