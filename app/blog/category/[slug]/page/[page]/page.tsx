'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import ClientPageLayout from '@/components/ClientPageLayout';
import NotFoundContent from '@/components/NotFoundContent';
import Pagination from '@/components/Pagination';
import { siteConfig } from '@/site.config';
import { BlogPost } from '@/lib/types';
// Анимации
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
    {children}
    </motion.div>
  );
}

function AnimatedBlogPost({ children, index = 0 }: { children: React.ReactNode; index: number; }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={isInView ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: index * 0.1, ease: "easeOut" } } : { opacity: 0, y: 50, scale: 0.95 }} whileHover={{ y: -2, transition: { duration: 0.2, ease: "easeOut" } }}>
    {children}
    </motion.div>
  );
}

const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };
const heroVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent((Array.isArray(params.category) ? params.category[0] : params.category) || '');
  const page = parseInt((Array.isArray(params.page) ? params.page[0] : params.page) || '1', 10);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!loading && !notFound && category) {
      document.title = `Категория: ${category} | ${siteConfig.title}`;
    }
  }, [loading, notFound, category]);

  useEffect(() => {
    if (isNaN(page) || page < 1 || !category) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchBlogData = async () => {
      try {
        const res = await fetch(`/api/posts?category=${encodeURIComponent(category)}`);
        const data = await res.json();

        const allPosts = data.posts || [];
        const postsPerPage = siteConfig.blog.pagination.postsPerPage;
        const totalPagesCount = Math.ceil(allPosts.length / postsPerPage);

        if (page > totalPagesCount && totalPagesCount > 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;

        setPosts(allPosts.slice(startIndex, endIndex));
        setTotalPosts(allPosts.length);
        setTotalPages(totalPagesCount);
        setHasNextPage(page < totalPagesCount);
        setHasPrevPage(page > 1);
        setNotFound(false);
      } catch (error) {
        console.error('Ошибка получения данных категории:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [category, page]);

  if (loading) {
    return (
      <ClientPageLayout>
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
      <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
      <p className="text-slate-400">Загрузка...</p>
      </div>
      </div>
      </ClientPageLayout>
    );
  }

  if (notFound) {
    return <ClientPageLayout><NotFoundContent message="Категория не найдена" /></ClientPageLayout>;
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
    <ClientPageLayout>
    {/* Заголовок */}
    <motion.section className="bg-[#0f172a] text-white py-16" variants={heroVariants}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.h1 className="text-4xl md:text-5xl font-bold tracking-widest mb-4 uppercase" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
    {category}
    </motion.h1>
    <motion.p className="text-xl text-slate-400 max-w-2xl mx-auto font-light tracking-widest italic" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
    Статьи в этой категории
    </motion.p>
    <motion.p className="text-sm text-slate-500 mt-2 font-light tracking-wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
    Всего статей: {totalPosts} | Страница {page} из {totalPages}
    </motion.p>
    </div>
    </motion.section>

    {/* Список статей */}
    <section className="bg-[#0f172a] py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    {posts.length > 0 ? (
      <div className="space-y-8">
      {posts.map((post: BlogPost, index: number) => (
        <AnimatedBlogPost key={post.slug} index={index}>
        <article className="border-b border-slate-700 pb-6 last:border-b-0">
        <div className="flex items-start gap-4">
        {/* Дата */}
        <div className="flex-shrink-0 w-16 text-center">
        <div className="text-sm text-slate-400">
        {new Date(post.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
        </div>
        <div className="text-xs text-slate-500">{new Date(post.date).getFullYear()}</div>
        </div>

        <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1e293b] text-slate-300 border border-slate-700">
        {post.category}
        </span>
        {siteConfig.blog.display.showReadTime && (
          <span className="text-xs text-slate-500">{post.readTime} мин. чтения</span>
        )}
        </div>

        <h2 className="text-xl font-bold mb-2 text-white hover:text-[#3b82f6] transition-colors">
        <Link href={`/blog/${post.slug}`} className="no-underline">{post.title}</Link>
        </h2>

        {siteConfig.blog.display.showExcerpt && (
          <p className="text-slate-400 mb-4 line-clamp-2">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between">
        {siteConfig.blog.display.showTags && (
          <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, siteConfig.blog.display.maxTagsToShow).map((tag: string) => (
            <Link key={tag} href={`/blog/tag/${tag}/page/1`} className="inline-flex items-center px-2.5 py-1 text-xs text-slate-400 bg-[#1e293b] rounded-full hover:bg-slate-700 transition-all">
            #{tag}
            </Link>
          ))}
          </div>
        )}
        </div>
        </div>
        </div>
        </article>
        </AnimatedBlogPost>
      ))}
      </div>
    ) : (
      <AnimatedSection className="text-center py-16" delay={0.2}>
      <h3 className="text-xl font-bold text-white mb-3">Пока нет статей</h3>
      <p className="text-slate-400 max-w-md mx-auto">В этой категории пока ничего нет.</p>
      </AnimatedSection>
    )}

    {/* Пагинация */}
    {totalPages > 1 && (
      <AnimatedSection className="mt-12" delay={0.3}>
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/blog/category/${category}/page`} hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />
      </AnimatedSection>
    )}
    </div>
    </section>
    </ClientPageLayout>
    </motion.div>
  );
}
