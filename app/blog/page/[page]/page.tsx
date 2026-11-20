'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import ClientPageLayout from '../../../../components/ClientPageLayout';
import NotFoundContent from '../../../../components/NotFoundContent';
import Pagination from '../../../../components/Pagination';
import { siteConfig } from '../../../../site.config';
import { BlogPost, PaginatedPosts } from '../../../../lib/types';

// Анимации
function AnimatedSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
    >
    {children}
    </motion.div>
  );
}

function AnimatedBlogPost({ children, index = 0 }: { children: React.ReactNode; index: number; }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    animate={isInView ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: index * 0.1, ease: "easeOut" } } : { opacity: 0, y: 50, scale: 0.95 }}
    whileHover={{ y: -2, transition: { duration: 0.2, ease: "easeOut" } }}
    >
    {children}
    </motion.div>
  );
}

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function BlogPageWithPagination() {
  const params = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!loading && !notFound && currentPage) {
      document.title = `Блог | ${siteConfig.title}`;
    }
  }, [loading, notFound, currentPage]);

  useEffect(() => {
    const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
    const page = parseInt(pageParam || '1', 10);

    if (isNaN(page) || page < 1) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setCurrentPage(page);

    const fetchBlogData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          fetch('/api/posts'),
                                                            fetch('/api/categories')
        ]);

        const [postsData, categoriesData] = await Promise.all([
          postsRes.json(),
                                                              categoriesRes.json()
        ]);

        const allPosts = postsData.posts || [];
        const postsPerPage = siteConfig.blog.pagination.postsPerPage;
        const totalPagesCount = Math.ceil(allPosts.length / postsPerPage);

        if (page > totalPagesCount && totalPagesCount > 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const paginatedPosts = allPosts.slice(startIndex, endIndex);

        setPosts(paginatedPosts);
        setCategories(categoriesData.categories || []);
        setTotalPosts(allPosts.length);
        setTotalPages(totalPagesCount);
        setHasNextPage(page < totalPagesCount);
        setHasPrevPage(page > 1);
        setNotFound(false);
      } catch (error) {
        console.error('Ошибка получения данных блога:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [params]);

  if (loading) {
    return (
      <ClientPageLayout>
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
      <p className="text-slate-400">Загрузка...</p>
      </motion.div>
      </div>
      </ClientPageLayout>
    );
  }

  if (notFound) {
    return (
      <ClientPageLayout>
      <NotFoundContent message="Страница не найдена" />
      </ClientPageLayout>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
    <ClientPageLayout>
    {/* Заголовок */}
    <motion.section className="bg-[#0f172a] text-white py-16" variants={heroVariants}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.h1
    className="text-4xl md:text-5xl font-bold tracking-widest mb-4 uppercase"
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
    >
    Блог
    </motion.h1>
    <motion.p
    className="text-xl text-slate-400 max-w-2xl mx-auto font-light tracking-widest italic"
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
    >
    Мысли о технологиях и жизни
    </motion.p>
    <motion.p
    className="text-sm text-slate-500 mt-2 font-light tracking-wide"
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
    >
    Всего статей: {totalPosts} | Страница {currentPage} из {totalPages}
    </motion.p>
    </div>
    </motion.section>

    {/* Категории */}
    <AnimatedSection className="bg-[#1e293b] py-8 border-b border-slate-700">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-wrap gap-3">
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link href="/blog" className="inline-flex items-center px-4 py-2 text-sm rounded-full transition-colors bg-[#3b82f6] text-white">
    Все
    </Link>
    </motion.div>
    {categories.map((category: string, index: number) => (
      <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link href={`/blog/category/${category}/page/1`} className="inline-flex items-center px-4 py-2 text-sm rounded-full transition-colors text-slate-300 bg-[#0f172a] border border-slate-700 hover:border-[#3b82f6]">
      {category}
      </Link>
      </motion.div>
    ))}
    </div>
    </div>
    </AnimatedSection>

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
        <div className="text-xs text-slate-500">
        {new Date(post.date).getFullYear()}
        </div>
        </div>

        <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href={`/blog/category/${post.category}/page/1`} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1e293b] text-slate-300 hover:bg-[#3b82f6] hover:text-white transition-all">
        {post.category}
        </Link>
        </motion.div>
        {siteConfig.blog.display.showReadTime && (
          <span className="text-xs text-slate-500">
          {post.readTime} мин. чтения
          </span>
        )}
        </div>

        <h2 className="text-xl font-bold mb-2 text-white hover:text-[#3b82f6] transition-colors">
        <Link href={`/blog/${post.slug}`} className="no-underline">
        {post.title}
        </Link>
        </h2>

        {siteConfig.blog.display.showExcerpt && (
          <p className="text-slate-400 mb-4 line-clamp-2">
          {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between">
        {siteConfig.blog.display.showTags && (
          <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, siteConfig.blog.display.maxTagsToShow).map((tag: string) => (
            <motion.div key={tag} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={`/blog/tag/${tag}/page/1`} className="inline-flex items-center px-2.5 py-1 text-xs text-slate-400 bg-[#1e293b] rounded-full hover:bg-slate-700 transition-all">
            #{tag}
            </Link>
            </motion.div>
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
      <motion.div className="text-slate-600 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      </motion.div>
      <motion.h3 className="text-xl font-bold text-white mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      Пока нет статей
      </motion.h3>
      <motion.p className="text-slate-400 max-w-md mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      Скоро здесь появятся новые записи!
      </motion.p>
      </AnimatedSection>
    )}

    {/* Пагинация */}
    {totalPages > 1 && (
      <AnimatedSection className="mt-12" delay={0.3}>
      <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/blog/page"
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      />
      </AnimatedSection>
    )}
    </div>
    </section>
    </ClientPageLayout>
    </motion.div>
  );
}
