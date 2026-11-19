'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { siteConfig } from '../../site.config';
import ClientPageLayout from '../../components/ClientPageLayout';
import Comments from '../../components/Comments';
import ClientImage from '../../components/ClientImage';
import {
  CheckCircleIcon,
  CodeBracketIcon,
  ServerIcon,
  CloudIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 }
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } }
};

function AnimatedSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
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

const skillIcons: { [key: string]: any } = {
  '': ServerIcon,
  '': CloudIcon,
  '': CodeBracketIcon,
};

export default function AboutPage() {
  const { about, profile, name } = siteConfig;

  return (
    <ClientPageLayout>
    {/* Hero Section */}
    <motion.section
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    className="relative bg-[#0f172a] text-slate-200 overflow-hidden"
    >
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="flex flex-col lg:flex-row items-center gap-12">

    {/* Аватарка */}
    <motion.div
    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
    className="w-64 h-64 relative group cursor-pointer"
    >
    <motion.div
    className="absolute inset-0 rounded-full"
    animate={{
      background: [
        "conic-gradient(from 0deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.5), rgba(59, 130, 246, 0.3))",
          "conic-gradient(from 360deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.5), rgba(59, 130, 246, 0.3))"
      ]
    }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    style={{ padding: "3px", borderRadius: "50%" }}
    >
    <div className="w-full h-full rounded-full bg-[#0f172a]" />
    </motion.div>

    <motion.div
    className="absolute inset-1 rounded-full overflow-hidden"
    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
    whileTap={{ scale: 0.95 }}
    >
    <ClientImage
    src={profile.avatar}
    alt={name}
    width={256}
    height={256}
    className="w-full h-full rounded-full object-cover border-4 border-slate-700 shadow-lg transition-shadow duration-300"
    priority
    />
    </motion.div>
    </motion.div>

    {/* Инфо */}
    <div className="flex-1 text-center lg:text-left">
    <motion.h1
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
    className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-4 text-white"
    >
    {name}
    </motion.h1>
    <motion.p
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
    className="text-xl text-slate-400 mb-6 font-light tracking-widest italic"
    >
    {profile.bio}
    </motion.p>
    {profile.location && (
      <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
      className="flex items-center justify-center lg:justify-start gap-2 text-slate-400"
      >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="font-light tracking-wide">{profile.location}</span>
      </motion.div>
    )}

    {/* Соцсети */}
    <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.0 }}
    className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-6"
    >
    {profile.github && (
      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2.5 text-slate-400 hover:text-[#3b82f6] transition-colors rounded-full hover:bg-[#1e293b]" title="GitHub">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
      </a>
    )}
    </motion.div>
    </div>
    </div>
    </div>
    </motion.section>

    {/* Основной контент */}
    <div className="bg-[#0f172a] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {/* Интро */}
    {about.intro && about.intro.paragraphs && about.intro.paragraphs.length > 0 && (
      <AnimatedSection className="mb-20">
      <div className="text-center mb-12">
      <h2 className="text-4xl font-bold tracking-widest text-white mb-4 uppercase">Обо мне</h2>
      <div className="w-24 h-1 bg-[#3b82f6] mx-auto rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto">
      {about.intro.paragraphs.map((paragraph, index) => (
        <p key={index} className="text-lg text-slate-300 leading-relaxed mb-6 text-center font-light tracking-wide">
        {paragraph}
        </p>
      ))}
      </div>
      </AnimatedSection>
    )}

    {/* Образование */}
    {about.education && about.education.items && about.education.items.length > 0 && (
      <AnimatedSection className="mb-20">
      <div className="text-center mb-12">
      <h2 className="text-4xl font-bold tracking-widest text-white mb-4 uppercase">Образование</h2>
      <div className="w-24 h-1 bg-[#3b82f6] mx-auto rounded-full" />
      </div>
      <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700 hidden md:block"></div>
      <div className="space-y-12">
      {about.education.items.map((edu, index) => (
        <div key={index} className="relative flex gap-8">
        <div className="hidden md:flex w-16 h-16 bg-[#1e293b] rounded-full items-center justify-center flex-shrink-0 border border-slate-700 z-10">
        <AcademicCapIcon className="w-8 h-8 text-[#3b82f6]" />
        </div>
        <div className="flex-1 bg-[#1e293b] rounded-lg p-8 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
        <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
        <p className="text-slate-400 font-medium text-lg">{edu.school}</p>
        </div>
        <span className="text-slate-300 bg-[#0f172a] px-4 py-2 rounded-md text-sm mt-2 md:mt-0 border border-slate-700">{edu.year}</span>
        </div>
        <p className="text-slate-400 leading-relaxed">{edu.description}</p>
        </div>
        </div>
      ))}
      </div>
      </div>
      </AnimatedSection>
    )}

    {/* Опыт */}
    {(about as any).experience?.items && (about as any).experience.items.length > 0 && (
      <AnimatedSection className="mb-20">
      <div className="text-center mb-12">
      <h2 className="text-4xl font-bold tracking-widest text-white mb-4 uppercase">Опыт</h2>
      <div className="w-24 h-1 bg-[#3b82f6] mx-auto rounded-full" />
      </div>
      <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700 hidden md:block"></div>
      <div className="space-y-12">
      {(about as any).experience.items.map((exp: any, index: number) => (
        <div key={index} className="relative flex gap-8">
        <div className="hidden md:flex w-16 h-16 bg-[#1e293b] rounded-full items-center justify-center text-[#3b82f6] font-bold text-xl border border-slate-700 z-10">
        {index + 1}
        </div>
        <div className="flex-1 bg-[#1e293b] rounded-lg p-8 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
        <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
        <p className="text-slate-400 font-medium text-lg">{exp.company}</p>
        </div>
        <span className="text-slate-300 bg-[#0f172a] px-4 py-2 rounded-md text-sm mt-2 md:mt-0 border border-slate-700">{exp.year}</span>
        </div>
        <p className="text-slate-400 mb-6">{exp.description}</p>
        {exp.highlights && exp.highlights.length > 0 && (
          <div className="space-y-3">
          {exp.highlights.map((highlight: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
            <span className="text-slate-300">{highlight}</span>
            </div>
          ))}
          </div>
        )}
        </div>
        </div>
      ))}
      </div>
      </div>
      </AnimatedSection>
    )}

    {/* Навыки */}
    {about.skills && about.skills.categories && about.skills.categories.length > 0 && (
      <AnimatedSection className="mb-20">
      <div className="text-center mb-12">
      <h2 className="text-4xl font-bold tracking-widest text-white mb-4 uppercase">Навыки</h2>
      <div className="w-24 h-1 bg-[#3b82f6] mx-auto rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {about.skills.categories.map((category, index) => {
        const IconComponent = skillIcons[category.name] || CodeBracketIcon;
        return (
          <div key={index} className="bg-[#1e293b] rounded-lg p-8 border border-slate-700">
          <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center border border-slate-700">
          <IconComponent className="w-8 h-8 text-[#3b82f6]" />
          </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">{category.name}</h3>
          <div className="space-y-5">
          {category.skills.map((skill, idx) => (
            <div key={idx}>
            <div className="flex justify-between mb-3">
            <span className="text-slate-200 font-medium text-sm">{skill.name}</span>
            <span className="text-slate-400 font-bold text-sm bg-[#0f172a] px-2 py-1 rounded-md border border-slate-700">{skill.level}%</span>
            </div>
            <div className="w-full bg-[#0f172a] rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div className="h-2.5 rounded-full bg-[#3b82f6]" style={{ width: `${skill.level}%` }} />
            </div>
            </div>
          ))}
          </div>
          </div>
        );
      })}
      </div>
      </AnimatedSection>
    )}

    {/* Комментарии */}
    <section className="mb-20">
    <Comments
    pageId="about"
    pageTitle="Обо мне"
    pageUrl="/about"
    />
    </section>
    </div>
    </ClientPageLayout>
  );
}
