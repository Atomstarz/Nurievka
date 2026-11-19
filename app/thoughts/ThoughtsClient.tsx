'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Comments from '../../components/Comments';

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; }) {
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

function AnimatedThought({ children, index = 0 }: { children: React.ReactNode; index: number; }) {
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

interface Thought {
  content: string;
  date: string;
  mood: string;
  tags: string[];
  filename?: string;
  id?: string;
}

interface ThoughtsClientProps {
  initialThoughts: Thought[];
  initialTags: string[];
  initialMoods: string[];
}

export default function ThoughtsClient({ initialThoughts, initialTags, initialMoods }: ThoughtsClientProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [highlightedThought, setHighlightedThought] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1);
        if (hash) {
          setHighlightedThought(hash);
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => setHighlightedThought(''), 1000);
            }
          }, 100);
        } else {
          setHighlightedThought('');
        }
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const filteredThoughts = useMemo(() => {
    return initialThoughts.filter(thought => {
      const matchesMood = !selectedMood || thought.mood === selectedMood;
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => thought.tags.includes(tag));
      return matchesMood && matchesTags;
    });
  }, [initialThoughts, selectedMood, selectedTags]);

  const toggleMood = (mood: string) => setSelectedMood(selectedMood === mood ? '' : mood);
  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const resetFilters = () => { setSelectedMood(''); setSelectedTags([]); };

  return (
    <>
    <AnimatedSection className="bg-[#1e293b] border-b border-slate-700">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-4">
    <h2 className="text-lg font-bold text-white uppercase tracking-widest">Фильтр</h2>
    <div className="text-sm text-slate-400">{filteredThoughts.length} / {initialThoughts.length}</div>
    </div>
    {(selectedMood || selectedTags.length > 0) && (
      <button onClick={resetFilters} className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
      Сбросить
      </button>
    )}
    </div>

    <div className="mb-6">
    <h3 className="text-sm text-slate-400 mb-3">По настроению</h3>
    <div className="flex flex-wrap gap-3">
    {initialMoods.map((mood) => {
      const count = initialThoughts.filter(t => t.mood === mood).length;
      const isSelected = selectedMood === mood;
      return (
        <button
        key={mood}
        onClick={() => toggleMood(mood)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
          isSelected ? 'bg-[#0f172a] text-[#3b82f6] border border-[#3b82f6]' : 'bg-[#0f172a] text-slate-300 border border-slate-700 hover:border-slate-500'
        }`}
        >
        <span className="text-lg">{mood}</span>
        <span className="text-xs text-slate-500">({count})</span>
        </button>
      );
    })}
    </div>
    </div>

    <div>
    <h3 className="text-sm text-slate-400 mb-3">По тегам</h3>
    <div className="flex flex-wrap gap-2">
    {initialTags.map((tag) => {
      const count = initialThoughts.filter(t => t.tags.includes(tag)).length;
      const isSelected = selectedTags.includes(tag);
      return (
        <button
        key={tag}
        onClick={() => toggleTag(tag)}
        className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
          isSelected ? 'bg-[#0f172a] text-[#3b82f6] border border-[#3b82f6]' : 'bg-[#0f172a] text-slate-300 border border-slate-700 hover:border-slate-500'
        }`}
        >
        #{tag} ({count})
        </button>
      );
    })}
    </div>
    </div>
    </div>
    </AnimatedSection>

    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0f172a]">
    {filteredThoughts.length === 0 ? (
      <AnimatedSection className="text-center py-16" delay={0.2}>
      <h3 className="text-xl font-bold text-white mb-3">
      {initialThoughts.length === 0 ? 'Пока нет заметок' : 'Ничего не найдено'}
      </h3>
      <p className="text-slate-400 mb-6">
      {initialThoughts.length === 0 ? 'Начните записывать свои мысли!' : 'Попробуйте изменить фильтры'}
      </p>
      </AnimatedSection>
    ) : (
      <div className="space-y-8">
      {filteredThoughts.map((thought, index) => {
        const thoughtId = thought.id || `thought-${thought.date}-${index}`;
        const isHighlighted = highlightedThought === thoughtId;

        return (
          <AnimatedThought key={`${thought.date}-${index}`} index={index}>
          <article
          id={thoughtId}
          className={`rounded-lg p-8 border transition-all duration-200 ${
            isHighlighted ? 'bg-[#1e293b] border-[#3b82f6] shadow-lg' : 'bg-[#1e293b] border-slate-700 hover:border-slate-500'
          }`}
          >
          <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
          <button onClick={() => toggleMood(thought.mood)} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-[#0f172a] text-slate-300 border border-slate-700 hover:border-[#3b82f6] transition-all">
          <span className="text-base">{thought.mood}</span>
          </button>
          <time className="text-sm text-slate-500">
          {new Date(thought.date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          </div>
          </header>

          <div className="prose prose-invert max-w-none mb-6">
          <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">{thought.content}</p>
          </div>

          {thought.tags.length > 0 && (
            <footer className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
            {thought.tags.map((tag) => (
              <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                selectedTags.includes(tag) ? 'bg-[#0f172a] text-[#3b82f6] border border-[#3b82f6]' : 'bg-[#0f172a] text-slate-400 border border-slate-700 hover:border-slate-500'
              }`}
              >
              #{tag}
              </button>
            ))}
            </footer>
          )}
          </article>
          </AnimatedThought>
        );
      })}
      </div>
    )}

    {filteredThoughts.length > 0 && (
      <AnimatedSection className="text-center mt-12 pt-8 border-t border-slate-700" delay={0.3}>
      <p className="text-sm text-slate-500">
      Показано {filteredThoughts.length} из {initialThoughts.length} заметок
      </p>
      </AnimatedSection>
    )}

    <AnimatedSection className="mt-16" delay={0.4}>
    <Comments pageId="thoughts" pageTitle="Заметки" pageUrl="/thoughts" />
    </AnimatedSection>
    </main>
    </>
  );
}
