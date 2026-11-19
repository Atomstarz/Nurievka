'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ClientPageLayout from '../../components/ClientPageLayout';
import ThoughtsClient from './ThoughtsClient';
import { Thought } from '../../lib/types';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThoughtsData = async () => {
      try {
        const [thoughtsRes, tagsRes, moodsRes] = await Promise.all([
          fetch('/api/thoughts'),
                                                                   fetch('/api/thoughts?type=tags'),
                                                                   fetch('/api/thoughts?type=moods')
        ]);

        const [thoughtsData, tagsData, moodsData] = await Promise.all([
          thoughtsRes.json(),
                                                                      tagsRes.json(),
                                                                      moodsRes.json()
        ]);

        setThoughts(thoughtsData.thoughts || []);
        setTags(tagsData.tags || []);
        setMoods(moodsData.moods || []);
      } catch (error) {
        console.error('Error fetching thoughts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThoughtsData();
  }, []);

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

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
    <ClientPageLayout>
    <motion.header
    className="bg-[#0f172a] text-white py-16"
    variants={heroVariants}
    >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
    <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-4">
    Заметки
    </h1>
    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light tracking-widest italic">
    Мысли о жизни и технологиях
    </p>
    </div>
    </div>
    </motion.header>

    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
    <ThoughtsClient
    initialThoughts={thoughts}
    initialTags={tags}
    initialMoods={moods}
    />
    </motion.div>
    </ClientPageLayout>
    </motion.div>
  );
}
