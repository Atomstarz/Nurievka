'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Star, Calendar, Tag, ShoppingCart, MessageCircle } from 'lucide-react';
import { siteConfig } from '../../site.config';
import Footer from '../../components/Footer';
import NavigationWrapper from '../../components/NavigationWrapper';
import Comments from '../../components/Comments';
import ClientImage from '../../components/ClientImage';
import BackToTop from '../../components/BackToTop';

// Анимации
function AnimatedSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 50 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
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

export default function BooksPage() {
  if (!siteConfig.books?.enabled) {
    return null;
  }

  const { books } = siteConfig;

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
    <NavigationWrapper />

    {/* Темно-синий фон */}
    <main className="min-h-screen bg-[#0f172a] text-slate-200 pt-16">

    {/* Заголовок */}
    <motion.section
    className="bg-[#0f172a] text-white py-16 relative overflow-hidden"
    variants={heroVariants}
    >
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
    <h1 className="text-4xl md:text-5xl font-bold tracking-widest mb-4 uppercase">{books.title}</h1>
    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light tracking-widest italic">
    {books.description}
    </p>
    </div>
    </motion.section>

    {/* Сетка карточек */}
    <AnimatedSection className="pt-16 pb-0">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

    {/* Вот здесь мы добавили (book: any), чтобы TypeScript не падал */}
    {books.items.map((book: any, index: number) => (
      <motion.div
      key={book.id || index}
      className="group relative bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      >
      {/* Обложка */}
      <div className="relative h-64 overflow-hidden bg-[#0f172a]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
      {book.cover ? (
        <ClientImage
        src={book.cover}
        alt={book.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
        <BookOpen size={48} className="text-slate-600" />
        </div>
      )}

      {/* Статус */}
      <div className="absolute top-4 right-4 z-20">
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        book.status === 'reading'
        ? 'bg-blue-900/40 text-blue-400'
        : book.status === 'read'
        ? 'bg-green-900/40 text-green-400'
        : 'bg-slate-800 text-slate-300'
      }`}>
      {book.status === 'reading' && <BookOpen size={10} />}
      {book.status === 'read' && <Star size={10} />}
      {book.status === 'want_to_read' && <Calendar size={10} />}
      {book.status === 'reading' ? 'Читаю' : book.status === 'read' ? 'Прочитано' : 'Хочу'}
      </span>
      </div>
      </div>

      {/* Информация */}
      <div className="relative z-10 p-6">
      <h3 className="text-lg font-bold mb-2 text-white">
      {book.title}
      </h3>

      {book.author && (
        <p className="text-slate-400 mb-2 text-sm">
        Автор: {book.author}
        </p>
      )}

      <p className="text-slate-300 mb-4 text-sm leading-relaxed">
      {book.description}
      </p>

      {/* Комментарий/Отзыв */}
      {book.review && (
        <div className="mb-4 p-3 bg-[#0f172a] rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-slate-300 italic leading-relaxed">
        {book.review}
        </p>
        </div>
      )}

      {/* Рейтинг */}
      {book.rating && (
        <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
          key={i}
          size={14}
          className={`${i < book.rating! ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
          />
        ))}
        </div>
        <span className="text-sm text-slate-400">{book.rating}/5</span>
        </div>
      )}

      {/* Теги */}
      {book.tags && book.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
        {book.tags.map((tag: string) => (
          <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-300 bg-[#0f172a] rounded-full"
          >
          <Tag size={10} />
          {tag}
          </span>
        ))}
        </div>
      )}

      {/* Ссылки на покупку */}
      {book.purchaseLinks && Object.keys(book.purchaseLinks).length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-4">
        {Object.entries(book.purchaseLinks).map(([platform, url]: [string, any]) => {

          const getButtonStyle = (p: string) => {
            switch(p.toLowerCase()) {
              case 'ozon': return 'text-blue-400 bg-blue-900/30 hover:bg-blue-800/50';
              case 'wildberries': return 'text-purple-400 bg-purple-900/30 hover:bg-purple-800/50';
              case 'yandex': return 'text-yellow-400 bg-yellow-900/30 hover:bg-yellow-800/50';
              case 'steam': return 'text-slate-200 bg-slate-700 hover:bg-slate-600';
              default: return 'text-slate-300 bg-[#0f172a] hover:bg-slate-700';
            }
          };

          const getPlatformName = (p: string) => {
            const nameMap: { [key: string]: string } = {
              ozon: 'Ozon',
              wildberries: 'Wildberries',
              yandex: 'Яндекс Маркет',
              steam: 'Steam',
            };
            return nameMap[p.toLowerCase()] || p;
          };

          return (
            <motion.div key={platform} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
            href={url as string}
            target="_blank"
            rel="noopener noreferrer"
            title={`Купить на ${getPlatformName(platform)}`}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${getButtonStyle(platform)}`}
            >
            <ShoppingCart size={16} />
            </Link>
            </motion.div>
          );
        })}
        </div>
      )}
      </div>
      </motion.div>
    ))}
    </div>
    </div>
    </AnimatedSection>

    {/* Секция комментариев */}
    <AnimatedSection className="py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <Comments
    pageId="books"
    pageTitle="Хотелки" // Перевели заголовок
    />
    </div>
    </AnimatedSection>
    </main>

    <Footer />
    <BackToTop />
    </motion.div>
  );
}
