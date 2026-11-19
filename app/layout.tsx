import './globals.css';
import '../styles/prism-theme.css';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '../site.config';
import GoogleAnalytics from '../components/GoogleAnalytics';
import AnalyticsProvider from '../components/AnalyticsProvider';
import DynamicHead from '../components/DynamicHead';

function getServerAssetPath(path: string): string {
  return path;
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : siteConfig.url),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.title}` },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  icons: { icon: [{ url: getServerAssetPath('/favicon.svg'), type: 'image/svg+xml' }] },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteConfig.url,
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: getServerAssetPath('/favicon.svg'), width: 512, height: 512, alt: siteConfig.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: `@${siteConfig.name}`,
    images: [getServerAssetPath('/favicon.svg')],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rubik+Mono+One&display=swap" as="style" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rubik+Mono+One&display=swap" rel="stylesheet" media="all" />
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" as="style" />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" media="all" />

    <style dangerouslySetInnerHTML={{
      __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rubik+Mono+One&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
      html, body { font-family: 'Inter', sans-serif !important; }
      `
    }} />

    <link rel="icon" href={getServerAssetPath('/favicon.svg')} type="image/svg+xml" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="alternate" type="application/rss+xml" title={`${siteConfig.title} RSS Feed`} href={getServerAssetPath('/rss.xml')} />
    </head>
    <body className="antialiased bg-[#0f172a] text-slate-200">
    <DynamicHead />
    <GoogleAnalytics />
    <Suspense fallback={null}>
    <AnalyticsProvider>{children}</AnalyticsProvider>
    </Suspense>
    </body>
    </html>
  );
}
