'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../site.config';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  basePath = '/blog/page'
}: PaginationProps) {
  const router = useRouter();
  const [jumpPage, setJumpPage] = useState('');
  const maxVisiblePages = siteConfig.blog.pagination.maxVisiblePages;

  const buildPageUrl = (page: number) => `${basePath}/${page}`;

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      router.push(buildPageUrl(pageNumber));
      setJumpPage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleJumpToPage();
  };

    const getPageNumbers = () => {
      const pages: number[] = [];
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push(-1); pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1); pages.push(-1);
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1); pages.push(-1);
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
          pages.push(-2); pages.push(totalPages);
        }
      }
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <nav className="flex flex-col md:flex-row justify-center items-center mt-12 gap-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
      href="/blog/archive"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-[#1e293b] border border-slate-700 rounded-lg hover:bg-slate-700 transition-all"
      title="Архив блога"
      >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Архив
      </Link>
      </motion.div>

      <div className="flex items-center space-x-2">
      {hasPrevPage ? (
        <Link href={buildPageUrl(currentPage - 1)} className="px-3 py-2 text-sm font-medium text-slate-300 bg-[#1e293b] border border-slate-700 rounded-l-md hover:bg-slate-700 transition-colors">
        Назад
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-slate-600 bg-[#1e293b] border border-slate-700 rounded-l-md cursor-not-allowed">
        Назад
        </span>
      )}

      {getPageNumbers().map((pageNumber, index) => {
        if (pageNumber === -1 || pageNumber === -2) {
          return <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm font-medium text-slate-500">...</span>;
        }
        const isCurrentPage = pageNumber === currentPage;
        return (
          <Link
          key={pageNumber}
          href={buildPageUrl(pageNumber)}
          className={`px-3 py-2 text-sm font-medium border transition-colors ${
            isCurrentPage
            ? 'z-10 bg-[#3b82f6] border-[#3b82f6] text-white'
            : 'bg-[#1e293b] border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          >
          {pageNumber}
          </Link>
        );
      })}

      {hasNextPage ? (
        <Link href={buildPageUrl(currentPage + 1)} className="px-3 py-2 text-sm font-medium text-slate-300 bg-[#1e293b] border border-slate-700 rounded-r-md hover:bg-slate-700 transition-colors">
        Вперёд
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-slate-600 bg-[#1e293b] border border-slate-700 rounded-r-md cursor-not-allowed">
        Вперёд
        </span>
      )}
      </div>

      {totalPages > siteConfig.blog.pagination.maxVisiblePages && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>Стр.</span>
        <input
        type="number"
        min={1}
        max={totalPages}
        value={jumpPage}
        onChange={(e) => setJumpPage(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-14 h-9 px-2 text-center text-sm border border-slate-600 rounded-md bg-[#0f172a] text-white focus:outline-none focus:border-[#3b82f6]"
        />
        <span>из {totalPages}</span>
        <button
        onClick={handleJumpToPage}
        disabled={!jumpPage || parseInt(jumpPage, 10) < 1 || parseInt(jumpPage, 10) > totalPages}
        className="px-3 py-1.5 bg-[#3b82f6] text-white rounded text-sm hover:bg-[#2563eb] disabled:bg-slate-700 disabled:text-slate-500 transition-colors"
        >
        ОК
        </button>
        </div>
      )}
      </nav>
    );
}
