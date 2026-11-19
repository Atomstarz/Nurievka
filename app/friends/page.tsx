'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../../site.config';
import ClientPageLayout from '../../components/ClientPageLayout';
import ClientImage from '../../components/ClientImage';
import { LinkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function FriendsPage() {
  // Если друзья отключены в конфиге, ничего не показываем
  if (!siteConfig.friends?.enabled) {
    return null;
  }

  const { friends } = siteConfig;

  // Добавили (friend: any), чтобы TypeScript не ругался на пустой массив
  const featuredFriends = friends.items.filter((friend: any) => friend.featured);
  const otherFriends = friends.items.filter((friend: any) => !friend.featured);

  return (
    <ClientPageLayout>
    <main className="min-h-screen bg-[#0f172a] text-slate-200 pt-16">

    {/* Заголовок */}
    <section className="bg-[#0f172a] py-16 text-center">
    <div className="max-w-4xl mx-auto px-4">
    <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-4 text-white">
    {friends.title || "Друзья"}
    </h1>
    <p className="text-xl text-slate-400 font-light tracking-widest italic">
    {friends.description || "Интересные люди и их проекты"}
    </p>
    </div>
    </section>

    {/* Сетка друзей */}
    <section className="max-w-6xl mx-auto px-4 py-12">
    {friends.items.length === 0 ? (
      <div className="text-center py-20 text-slate-500">
      <LinkIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p className="text-lg">Пока здесь пусто. Добавьте друзей в конфигурации.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredFriends.concat(otherFriends).map((friend: any, index: number) => (
        <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-[#1e293b] rounded-xl p-6 border border-slate-700 hover:border-[#3b82f6] transition-all duration-300 group"
        >
        <div className="flex items-center gap-4 mb-4">
        {friend.avatar ? (
          <ClientImage
          src={friend.avatar}
          alt={friend.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 group-hover:border-[#3b82f6] transition-colors"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center border-2 border-slate-600">
          <span className="text-2xl font-bold text-slate-400">{friend.name.charAt(0)}</span>
          </div>
        )}
        <div>
        <h3 className="text-xl font-bold text-white group-hover:text-[#3b82f6] transition-colors">
        {friend.name}
        </h3>
        <p className="text-sm text-slate-400">{friend.description}</p>
        </div>
        </div>

        {friend.tags && friend.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
          {friend.tags.map((tag: string, i: number) => (
            <span key={i} className="text-xs bg-[#0f172a] text-slate-300 px-2 py-1 rounded-md border border-slate-700">
            {tag}
            </span>
          ))}
          </div>
        )}

        {friend.url && (
          <a
          href={friend.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
          >
          Перейти на сайт
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        )}
        </motion.div>
      ))}
      </div>
    )}
    </section>
    </main>
    </ClientPageLayout>
  );
}
