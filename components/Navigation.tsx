'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { siteConfig } from '../site.config';
import SearchModal from './SearchModal';
import { BlogPost, Thought } from '../lib/types';
import { trackEvent } from './GoogleAnalytics';

interface NavigationProps {
  posts: BlogPost[];
  thoughts: Thought[];
}

export default function Navigation({ posts, thoughts }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavClick = (itemName: string, href: string) => trackEvent('click_navigation', 'navigation', `${itemName} - ${href}`);
  const handleSearchOpen = () => { setIsSearchOpen(true); trackEvent('open_search', 'search', 'navigation_search'); };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); handleSearchOpen(); }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <>
    <nav className="fixed top-0 w-full bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 z-50">
    <div className="container-custom">
    <div className="flex items-center justify-between h-16">
    <Link href="/" className="text-xl font-bold tracking-widest text-white uppercase">
    {siteConfig.name}
    </Link>

    <div className="hidden md:flex items-center space-x-8">
    {siteConfig.navigation.main
      .filter(item => item.href.includes('projects') ? siteConfig.projects?.enabled : true)
      .map((item) => (
        <Link key={item.href} href={item.href} className="text-slate-300 hover:text-[#3b82f6] transition-colors" onClick={() => handleNavClick(item.name, item.href)}>
        {item.name}
        </Link>
      ))}

      <button onClick={handleSearchOpen} className="p-2 text-slate-300 hover:text-[#3b82f6] transition-colors relative group" aria-label="Поиск">
      <Search size={20} />
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-[#1e293b] border border-slate-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Ctrl+K
      </span>
      </button>
      </div>

      <div className="md:hidden flex items-center space-x-2">
      <button onClick={handleSearchOpen} className="p-2 text-slate-300" aria-label="Поиск">
      <Search size={20} />
      </button>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-300" aria-label="Меню">
      {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      </div>
      </div>

      {isOpen && (
        <div className="md:hidden py-4 border-t border-slate-800 bg-[#0f172a]">
        {siteConfig.navigation.main
          .filter(item => item.href.includes('projects') ? siteConfig.projects?.enabled : true)
          .map((item) => (
            <Link key={item.href} href={item.href} className="block py-2 text-slate-300 hover:text-[#3b82f6] transition-colors" onClick={() => { handleNavClick(item.name, item.href); setIsOpen(false); }}>
            {item.name}
            </Link>
          ))}
          </div>
      )}
      </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} posts={posts} thoughts={thoughts} />
      </>
  );
}
