'use client';

import { useEffect, useState, useCallback } from 'react';

interface TocItem { id: string; text: string; level: number; }
interface TableOfContentsProps { content: string; onCollapseChange?: (collapsed: boolean) => void; }

export default function TableOfContents({ content, onCollapseChange }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isManualScroll, setIsManualScroll] = useState<boolean>(false);

  const scanHeadingsFromDOM = useCallback(() => {
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    const tocItems: TocItem[] = [];
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent?.trim() || '';
      const id = heading.id;
      if (id && text) tocItems.push({ id, text, level });
    });
    setToc(tocItems);
  }, []);

  useEffect(() => {
    if (!content) return;
    const timer = setTimeout(() => scanHeadingsFromDOM(), 200);
    return () => clearTimeout(timer);
  }, [content, scanHeadingsFromDOM]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      let shouldRescan = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.matches('h1[id], h2[id], h3[id]') || element.querySelector('h1[id], h2[id], h3[id]')) shouldRescan = true;
            }
          });
        }
      });
      if (shouldRescan) setTimeout(() => scanHeadingsFromDOM(), 300);
    });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
  }, [scanHeadingsFromDOM]);

  const scrollTocToActiveItem = useCallback((activeId: string) => {
    if (isCollapsed || !activeId) return;
    const tocContainer = document.querySelector('.toc-scroll-container');
    const activeButton = document.querySelector(`[data-toc-id="${activeId}"]`);
    if (tocContainer && activeButton) {
      const containerRect = tocContainer.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const margin = 40;
      const isVisible = buttonRect.top >= containerRect.top + margin && buttonRect.bottom <= containerRect.bottom - margin;
      if (!isVisible) {
        const buttonTopRelativeToContainer = buttonRect.top - containerRect.top + tocContainer.scrollTop;
        const containerHeight = containerRect.height;
        const targetScrollTop = buttonTopRelativeToContainer - (containerHeight / 2) + (buttonRect.height / 2);
        tocContainer.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
      }
    }
  }, [isCollapsed]);

  const handleScroll = useCallback(() => {
    if (isManualScroll) return;
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    let currentActiveId = '';
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i];
    if (heading.getBoundingClientRect().top <= 150) { currentActiveId = heading.id; break; }
  }
  if (!currentActiveId && toc.length > 0) currentActiveId = toc[0].id;
  const previousActiveId = activeId;
    setActiveId(currentActiveId);
    if (currentActiveId && currentActiveId !== previousActiveId && !isManualScroll) {
      requestAnimationFrame(() => scrollTocToActiveItem(currentActiveId));
    }
  }, [isManualScroll, toc, activeId, scrollTocToActiveItem]);

  useEffect(() => {
    let ticking = false;
    const smoothHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { handleScroll(); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('scroll', smoothHandleScroll, { passive: true });
    smoothHandleScroll();
    return () => window.removeEventListener('scroll', smoothHandleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (toc.length > 0 && !activeId) {
      const firstId = toc[0].id;
      setActiveId(firstId);
      requestAnimationFrame(() => scrollTocToActiveItem(firstId));
    }
  }, [toc, activeId, scrollTocToActiveItem]);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setIsManualScroll(true);
      setActiveId(id);
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => setIsManualScroll(false), 1000);
    } else {
      scanHeadingsFromDOM();
      setTimeout(() => {
        const retryElement = document.getElementById(id);
        if (retryElement) {
          setIsManualScroll(true);
          setActiveId(id);
          const yOffset = -100;
          const y = retryElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          setTimeout(() => setIsManualScroll(false), 1000);
        }
      }, 100);
    }
  }, [scanHeadingsFromDOM]);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) onCollapseChange(newCollapsedState);
    if (!newCollapsedState && activeId) setTimeout(() => scrollTocToActiveItem(activeId), 300);
  };

    if (toc.length === 0) return null;

    return (
      <div className="sticky top-24 transition-all duration-300 ease-in-out z-10">
      <div className={`bg-[#1e293b] rounded-lg shadow-sm border border-slate-700 overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <div className={`flex items-center p-4 border-b border-slate-700 transition-all duration-300 ease-in-out ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
      {!isCollapsed && <h3 className="text-lg font-bold text-white uppercase tracking-widest">Содержание</h3>}
      <button onClick={handleToggleCollapse} className="p-1 text-slate-400 hover:text-white transition-colors flex-shrink-0" title={isCollapsed ? 'Развернуть' : 'Свернуть'}>
      {isCollapsed ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      )}
      </button>
      </div>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}`}>
      <nav className="toc-scroll-container p-2 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
      <div className="space-y-1">
      {toc.map((item, index) => (
        <button
        key={`${item.id}-${index}`} data-toc-id={item.id}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToHeading(item.id); }}
        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${activeId === item.id ? 'bg-[#0f172a] text-[#3b82f6] font-medium' : 'text-slate-400 hover:text-white hover:bg-[#0f172a]'}`}
        style={{ paddingLeft: `${(item.level - 1) * 0.75 + 0.75}rem` }} title={item.text}
        >
        <span className="block truncate">{item.text}</span>
        </button>
      ))}
      </div>
      </nav>
      </div>
      {isCollapsed && (
        <div className="p-2 transition-opacity duration-300 text-center text-slate-400">
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </div>
      )}
      </div>
      </div>
    );
}
