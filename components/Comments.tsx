'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageCircle, Github, Users, Settings } from 'lucide-react';
import { siteConfig } from '../site.config';

interface CommentsProps {
  pageId: string;
  pageTitle: string;
  pageUrl?: string;
  className?: string;
}

// Интерфейс конфигурации комментариев
interface CommentConfig {
  enabled: boolean;
  provider: 'giscus' | 'gitalk' | 'valine' | 'waline' | 'twikoo';
  config: {
    [key: string]: any;
  };
}

// Giscus
interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title';
  theme: 'light' | 'dark' | 'preferred_color_scheme';
  lang: string;
  loading: 'lazy' | 'eager';
  reactionsEnabled: '1' | '0';
  emitMetadata: '1' | '0';
  inputPosition: 'top' | 'bottom';
}

// Gitalk
interface GitalkConfig {
  clientID: string;
  clientSecret: string;
  repo: string;
  owner: string;
  admin: string[];
  id?: string;
  title?: string;
  body?: string;
  language: string;
  perPage: number;
  distractionFreeMode: boolean;
  pagerDirection: 'last' | 'first';
  createIssueManually: boolean;
  proxy?: string;
  flipMoveOptions?: any;
  enableHotKey: boolean;
}

// Valine / Waline (Сделали appId и appKey необязательными, чтобы Waline не ругался)
interface ValineConfig {
  appId?: string;
  appKey?: string;
  serverURL?: string;
  placeholder?: string;
  avatar?: 'mp' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'hide';
  meta?: string[];
  pageSize?: number;
  lang?: string;
  visitor?: boolean;
  highlight?: boolean;
  recordIP?: boolean;
  enableQQ?: boolean;
  requiredFields?: string[];
}

const getCommentConfig = (): CommentConfig | null => {
  if (typeof window === 'undefined') return null;

  const commentsConfig = siteConfig.comments;

  if (commentsConfig && commentsConfig.enabled) {
    const provider = commentsConfig.provider;

    switch (provider) {
      case 'giscus': {
        const config = commentsConfig.giscus;
        if (config.repo && config.repoId && config.categoryId) {
          return {
            enabled: true,
            provider: 'giscus',
            config: {
              repo: config.repo,
              repoId: config.repoId,
              category: config.category,
              categoryId: config.categoryId,
              mapping: config.mapping,
              theme: config.theme,
              lang: config.lang,
              loading: config.loading,
              reactionsEnabled: config.reactionsEnabled ? '1' : '0',
              emitMetadata: config.emitMetadata ? '1' : '0',
              inputPosition: config.inputPosition
            } as GiscusConfig
          };
        }
        break;
      }

      case 'gitalk': {
        const config = commentsConfig.gitalk;
        if (config.clientID && config.clientSecret && config.repo && config.owner) {
          return {
            enabled: true,
            provider: 'gitalk',
            config: {
              clientID: config.clientID,
              clientSecret: config.clientSecret,
              repo: config.repo,
              owner: config.owner,
              admin: config.admin,
              language: config.language,
              perPage: config.perPage,
              distractionFreeMode: config.distractionFreeMode,
              pagerDirection: config.pagerDirection,
              createIssueManually: config.createIssueManually,
              enableHotKey: config.enableHotKey
            } as GitalkConfig
          };
        }
        break;
      }

      case 'valine': {
        const config = commentsConfig.valine;
        if (config.appId && config.appKey) {
          return {
            enabled: true,
            provider: 'valine',
            config: {
              appId: config.appId,
              appKey: config.appKey,
              placeholder: config.placeholder,
              avatar: config.avatar,
              meta: config.meta,
              pageSize: config.pageSize,
              lang: config.lang,
              visitor: config.visitor,
              highlight: config.highlight,
              recordIP: config.recordIP,
              enableQQ: config.enableQQ,
              requiredFields: config.requiredFields
            } as ValineConfig
          };
        }
        break;
      }

      case 'waline': {
        const config = commentsConfig.waline;
        if (config.serverURL) {
          return {
            enabled: true,
            provider: 'waline',
            config: {
              serverURL: config.serverURL,
              placeholder: config.placeholder,
              avatar: config.avatar,
              meta: config.meta,
              pageSize: config.pageSize,
              lang: config.lang,
              visitor: config.visitor,
              highlight: config.highlight,
              recordIP: config.recordIP,
              enableQQ: config.enableQQ,
              requiredFields: config.requiredFields
            } as any // <--- ИСПРАВЛЕНИЕ ОШИБКИ ЗДЕСЬ
          };
        }
        break;
      }
    }
  }

  // Резервный вариант: проверка переменных окружения
  const giscusRepo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  if (giscusRepo) {
    return {
      enabled: true,
      provider: 'giscus',
      config: {
        repo: giscusRepo,
        repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '',
        category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'General',
        categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
        mapping: (process.env.NEXT_PUBLIC_GISCUS_MAPPING as any) || 'pathname',
        theme: (process.env.NEXT_PUBLIC_GISCUS_THEME as any) || 'noborder_dark', // Сменил на темную
        lang: process.env.NEXT_PUBLIC_GISCUS_LANG || 'ru',
        loading: (process.env.NEXT_PUBLIC_GISCUS_LOADING as any) || 'lazy',
        reactionsEnabled: process.env.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED === 'true' ? '1' : '0',
        emitMetadata: process.env.NEXT_PUBLIC_GISCUS_EMIT_METADATA === 'true' ? '1' : '0',
        inputPosition: (process.env.NEXT_PUBLIC_GISCUS_INPUT_POSITION as any) || 'bottom'
      } as GiscusConfig
    };
  }

  return null;
};

// --- КОМПОНЕНТЫ СИСТЕМ КОММЕНТАРИЕВ ---

const GiscusComments = ({ config, pageId }: { config: GiscusConfig; pageId: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', config.repo);
    script.setAttribute('data-repo-id', config.repoId);
    script.setAttribute('data-category', config.category);
    script.setAttribute('data-category-id', config.categoryId);
    script.setAttribute('data-mapping', config.mapping);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', config.reactionsEnabled);
    script.setAttribute('data-emit-metadata', config.emitMetadata);
    script.setAttribute('data-input-position', config.inputPosition);
    script.setAttribute('data-theme', config.theme);
    script.setAttribute('data-lang', config.lang);
    script.setAttribute('data-loading', config.loading);
    script.crossOrigin = 'anonymous';
    script.async = true;
    ref.current.appendChild(script);
  }, [config, pageId]);

  return <div ref={ref} className="giscus-container" />;
};

const GitalkComments = ({ config, pageId, pageTitle }: { config: GitalkConfig; pageId: string; pageTitle: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const loadGitalk = async () => {
      if (typeof window === 'undefined') return;
      if (!document.querySelector('link[href*="gitalk"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/gitalk@latest/dist/gitalk.css';
        document.head.appendChild(link);
      }
      if (!(window as any).Gitalk) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/gitalk@latest/dist/gitalk.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      const Gitalk = (window as any).Gitalk;
      if (Gitalk && ref.current) {
        const gitalk = new Gitalk({
          ...config,
          id: pageId.length > 50 ? pageId.substring(0, 50) : pageId,
          title: pageTitle,
          body: `Комментарий к странице: ${pageTitle}` // Переведено
        });
        gitalk.render(ref.current);
      }
    };
    loadGitalk();
  }, [config, pageId, pageTitle]);

  return <div ref={ref} className="gitalk-container" />;
};

const ValineComments = ({ config, pageId }: { config: ValineConfig; pageId: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadValine = async () => {
      if (typeof window === 'undefined') return;
      if (!(window as any).Valine) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/valine@latest/dist/Valine.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      const Valine = (window as any).Valine;
      if (Valine && ref.current) {
        new Valine({ el: ref.current, path: pageId, ...config });
      }
    };
    loadValine();
  }, [config, pageId]);

  return <div ref={ref} className="valine-container" />;
};

const WalineComments = ({ config, pageId }: { config: ValineConfig; pageId: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWaline = async () => {
      if (typeof window === 'undefined') return;
      if (!document.querySelector('link[href*="waline"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@waline/client@v2/dist/waline.css';
        document.head.appendChild(link);
      }
      if (!(window as any).Waline) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@waline/client@v2/dist/waline.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      const Waline = (window as any).Waline;
      if (Waline && ref.current) {
        Waline.init({ el: ref.current, path: pageId, ...config });
      }
    };
    loadWaline();
  }, [config, pageId]);

  return <div ref={ref} className="waline-container" />;
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---

export default function Comments({ pageId, pageTitle, pageUrl, className = '' }: CommentsProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const commentConfig = getCommentConfig();
  const commentsConfig = siteConfig.comments;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (commentsConfig && commentsConfig.enabled === false) return null;

  if (!commentConfig) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center shadow-sm">
            <Settings size={28} className="text-slate-400" strokeWidth={1.5} />
          </div>
          <div className="max-w-md">
            <p className="text-slate-400 text-sm font-light tracking-wide leading-relaxed">
              Комментарии не настроены. Добавьте конфигурацию в файл site.config.ts
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center shadow-sm">
              <Settings size={28} className="text-red-400" strokeWidth={1.5} />
            </div>
            <div className="max-w-md">
              <h4 className="text-lg font-light text-red-400 mb-3 tracking-wide">
                Ошибка загрузки комментариев
              </h4>
              <p className="text-red-400 text-sm font-light tracking-wide leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCommentSystem = () => {
    try {
      switch (commentConfig.provider) {
        case 'giscus': return <GiscusComments config={commentConfig.config as GiscusConfig} pageId={pageId} />;
        case 'gitalk': return <GitalkComments config={commentConfig.config as GitalkConfig} pageId={pageId} pageTitle={pageTitle} />;
        case 'valine': return <ValineComments config={commentConfig.config as ValineConfig} pageId={pageId} />;
        case 'waline': return <WalineComments config={commentConfig.config as ValineConfig} pageId={pageId} />;
        default: throw new Error(`Неподдерживаемая система комментариев: ${commentConfig.provider}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      return null;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="mt-1 pt-8 border-t border-slate-700 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-50"></div>
        </div>
        <div className="prose prose-invert max-w-none">
          {renderCommentSystem()}
        </div>
      </div>
    </div>
  );
}