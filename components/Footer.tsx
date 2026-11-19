'use client';

import Link from 'next/link';
import { siteConfig } from '../site.config';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { footer } = siteConfig;

  const getCopyrightYear = () => {
    if (!footer.copyright.showCurrentYear || footer.copyright.startYear === currentYear.toString()) {
      return footer.copyright.startYear;
    }
    return `${footer.copyright.startYear} - ${currentYear}`;
  };

  return (
    <footer className="bg-[#0f172a] border-t border-slate-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
    {/* Левая часть */}
    <div className="text-sm text-slate-400">
    <span>©{getCopyrightYear()} {footer.copyright.owner}. Сделано с душой.</span>
    </div>

    {/* Правая часть */}
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-slate-500">
    <a href="https://github.com/Atomstarz" target="_blank" rel="noopener noreferrer" className="hover:text-[#3b82f6] transition-colors">
    Мой GitHub
    </a>
    </div>
    </div>
    </div>
    </footer>
  );
}
