import useUserStore from '@/store/userStore';
import { Heart } from 'lucide-react';
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { companyName } = useUserStore();

  return (
    <footer className="bg-gray-100 backdrop-blur-sm border-t border-gray-200/50 py-2 px-6 mt-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Simplex V 1 .1
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="text-gray-600 hidden sm:block">
            {companyName || 'NA'}
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