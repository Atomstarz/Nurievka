import Link from 'next/link';
import { siteConfig } from '../site.config';

export default function NotFoundContent({
  message = 'Страница не найдена',
  returnLink = '/blog',
  returnText = 'Назад к блогу'
}: { message?: string; returnLink?: string; returnText?: string; }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
    <div className="max-w-lg mx-auto text-center px-4 relative z-10">
    <div className="mb-12">
    <div className="text-8xl md:text-9xl font-bold text-slate-700 mb-6 animate-pulse">404</div>
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase tracking-widest">{message}</h1>
    <p className="text-xl text-slate-400 mb-12 leading-relaxed italic">
    Возможно, она была перемещена или удалена.
    </p>
    <div className="space-y-4">
    <Link href="/" className="inline-flex items-center justify-center w-full bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-700 py-3 px-6 rounded-lg transition-all">
    Вернуться на главную
    </Link>
    <div className="flex gap-4">
    <Link href="/blog" className="flex-1 text-center bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-700 py-2 px-4 rounded-lg transition-all">
    Блог
    </Link>
    <Link href="/thoughts" className="flex-1 text-center bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-700 py-2 px-4 rounded-lg transition-all">
    Заметки
    </Link>
    </div>
    </div>
    </div>
    </div>
  );
}
