'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import TableOfContents from './TableOfContents';
import Comments from './Comments';
import ClientImage from './ClientImage';
import { BlogPost } from '@/lib/types';
import { trackEvent } from './GoogleAnalytics';
import { motion } from "framer-motion";

interface BlogPostContentProps {
  post: BlogPost;
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}

// Генерация ID для заголовков
const generateHeadingId = (text: string) => {
  return text
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
  .trim();
};

export default function BlogPostContent({ post, prevPost, nextPost }: BlogPostContentProps) {
  const [mounted, setMounted] = useState(false);
  const [tocCollapsed, setTocCollapsed] = useState(false);

  // Трекинг уникальных ID
  const usedIds = new Set<string>();

  const generateUniqueId = (text: string) => {
    let baseId = generateHeadingId(text);
    let id = baseId;
    let counter = 1;

    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }

    usedIds.add(id);
    return id;
  };

  useEffect(() => {
    setMounted(true);
    trackEvent('view_article', 'blog', post.title);

    const startTime = Date.now();

    return () => {
      const readingTime = Math.round((Date.now() - startTime) / 1000);
      if (readingTime > 10) {
        trackEvent('read_article', 'blog', post.title, readingTime);
      }
    };
  }, [post.title]);

  useEffect(() => {
    usedIds.clear();
  }, [post.slug]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-[#0f172a] min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="lg:flex lg:gap-8 relative">

    {/* Основной контент */}
    <main className={`min-w-0 transition-all duration-300 ease-in-out ${
      tocCollapsed ? 'lg:flex-1 lg:pr-0' : 'lg:flex-1 lg:pr-8'
    }`}>
    <div className="prose prose-lg prose-invert max-w-none">
    <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => {
        const id = generateUniqueId(children?.toString() || '');
        return <h1 id={id} className="font-bold tracking-wide text-white uppercase mt-8 mb-4">{children}</h1>;
      },
      h2: ({ children }) => {
        const id = generateUniqueId(children?.toString() || '');
        return <h2 id={id} className="font-bold tracking-wide text-white uppercase mt-8 mb-4">{children}</h2>;
      },
      h3: ({ children }) => {
        const id = generateUniqueId(children?.toString() || '');
        return <h3 id={id} className="font-bold tracking-wide text-white mt-6 mb-3">{children}</h3>;
      },
      h4: ({ children }) => {
        const id = generateUniqueId(children?.toString() || '');
        return <h4 id={id} className="font-bold tracking-wide text-white mt-6 mb-3">{children}</h4>;
      },
      h5: ({ children }) => {
        const id = generateUniqueId(children?.toString() || '');
        return <h5 id={id} className="font-bold tracking-wide text-white mt-4 mb-2">{children}</h5>;
      },
      h6: ({ children }) => {
        const id = generateUniqueId(children?.toString() || '');
        return <h6 id={id} className="font-bold tracking-wide text-white mt-4 mb-2">{children}</h6>;
      },
      p: ({ children }) => {
        const hasImage = Array.isArray(children) && children.some((child: any) =>
        child?.type === 'img' || (child?.props && child.props.src)
        );

        if (hasImage) {
          return <div className="text-slate-300 leading-relaxed my-4">{children}</div>;
        }
        return <p className="text-slate-300 leading-relaxed">{children}</p>;
      },
      li: ({ children }) => <li className="text-slate-300">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#3b82f6] pl-4 text-slate-400 italic bg-[#1e293b] py-2 pr-4 rounded-r-lg">
            {children}
            </blockquote>
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline) {
              const finalClassName = match ? className : 'language-txt';
  return (
    <CodeBlock className={finalClassName} inline={inline}>
    {String(children).replace(/\n$/, '')}
    </CodeBlock>
  );
            } else {
              return (
                <code className="bg-[#1e293b] text-[#3b82f6] px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700" {...props}>
                {children}
                </code>
              );
            }
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-8 border border-slate-700 rounded-lg shadow-sm">
            <table className="min-w-full">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#1e293b]">{children}</thead>,
          tbody: ({ children }) => <tbody className="bg-[#0f172a] divide-y divide-slate-700">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-[#1e293b] transition-colors">{children}</tr>,
          th: ({ children, style, ...props }: any) => (
            <th className="px-6 py-4 text-left text-sm font-bold text-white border-b border-slate-700" style={{ textAlign: style?.textAlign || 'left', ...style }} {...props}>{children}</th>
          ),
          td: ({ children, style, ...props }: any) => (
            <td className="px-6 py-4 text-sm text-slate-300 border-b border-slate-700 last:border-b-0" style={{ textAlign: style?.textAlign || 'left', ...style }} {...props}>{children}</td>
          ),
          img: ({ src, alt, ...props }: any) => {
            if (!src) return null;
            if (src.startsWith('http')) {
              return <img src={src} alt={alt || ''} className="rounded-lg shadow-lg max-w-full h-auto mx-auto block my-6 border border-slate-700" {...props} />;
            }
            return <ClientImage src={src.startsWith('/') ? src : `/images/${src}`} alt={alt || ''} width={800} height={400} className="rounded-lg shadow-lg max-w-full h-auto mx-auto block my-6 border border-slate-700" style={{ maxWidth: '100%', height: 'auto' }} />;
          },
          a: ({ href, children }) => (
            <a href={href} className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
            {children}
            </a>
          ),
    }}
    >
    {post.content || post.excerpt}
    </ReactMarkdown>

    {/* Навигация вперёд/назад */}
    {(prevPost || nextPost) && (
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-700">
      <div className="flex-1">
      {prevPost && (
        <Link href={`/blog/${prevPost.slug}`} className="group flex items-center gap-3 p-4 rounded-lg bg-[#1e293b] border border-slate-700 hover:border-[#3b82f6] transition-colors no-underline">
        <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Предыдущая</p>
        <p className="text-white font-medium truncate">{prevPost.title}</p>
        </div>
        </Link>
      )}
      </div>

      <div className="flex-1 ml-4">
      {nextPost && (
        <Link href={`/blog/${nextPost.slug}`} className="group flex items-center justify-end text-right gap-3 p-4 rounded-lg bg-[#1e293b] border border-slate-700 hover:border-[#3b82f6] transition-colors no-underline">
        <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Следующая</p>
        <p className="text-white font-medium truncate">{nextPost.title}</p>
        </div>
        <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      )}
      </div>
      </div>
    )}

    {/* Кнопка возврата */}
    <div className="mt-12 text-center">
    <Link href="/blog" className="inline-flex items-center gap-2 font-medium py-3 px-6 rounded-md transition-colors duration-200 bg-[#1e293b] border border-slate-700 hover:bg-slate-700 hover:border-[#3b82f6] text-white">
    <motion.span className="inline-block" animate={{x: [0, -5, 0]}} transition={{duration: 1.5, repeat: Infinity, ease: "easeInOut"}}>←</motion.span>
    <span>Назад к списку статей</span>
    </Link>
    </div>
    </div>

    {/* Комментарии */}
    <div className="mt-12">
    <Comments pageId={`blog-${post.slug}`} pageTitle={post.title} pageUrl={`/blog/${post.slug}`} />
    </div>
    </main>

    {/* Оглавление (сайдбар) */}
    <aside className={`hidden lg:block transition-all duration-300 ease-in-out ${tocCollapsed ? 'w-16' : 'w-80'}`}>
    {post.content && (
      <TableOfContents content={post.content} onCollapseChange={setTocCollapsed} />
    )}
    </aside>
    </div>
    </div>
    </div>
  );
}
