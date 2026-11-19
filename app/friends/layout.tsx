import { Metadata } from 'next';
import { siteConfig } from '../../site.config';

export const metadata: Metadata = {
  title: 'Друзья',
  description: 'Интересные люди и их сайты',
  keywords: [
    'Друзья',
    'Ссылки',
    'Блоги',
    ...siteConfig.seo.keywords,
  ],
  openGraph: {
    title: `Друзья | ${siteConfig.title}`,
    description: 'Интересные люди и их сайты',
    type: 'website',
    url: `${siteConfig.url}/friends`,
  },
};

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
